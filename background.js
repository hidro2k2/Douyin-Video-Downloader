const QUEUE_PREFIX = "queue:";
const NEXT_ALARM_PREFIX = "douyin-next:";
const SESSION_AREA = chrome.storage.session || chrome.storage.local;
const DEFAULT_DELAY_MS = 700;

function getQueueKey(tabId) {
  return `${QUEUE_PREFIX}${tabId}`;
}

function getAlarmName(tabId) {
  return `${NEXT_ALARM_PREFIX}${tabId}`;
}

function sessionGet(keys) {
  return new Promise((resolve) => {
    SESSION_AREA.get(keys, (result) => resolve(result || {}));
  });
}

function sessionSet(value) {
  return new Promise((resolve, reject) => {
    SESSION_AREA.set(value, () => {
      const error = chrome.runtime.lastError;
      if (error) {
        reject(new Error(error.message));
        return;
      }
      resolve();
    });
  });
}

function sessionRemove(keys) {
  return new Promise((resolve, reject) => {
    SESSION_AREA.remove(keys, () => {
      const error = chrome.runtime.lastError;
      if (error) {
        reject(new Error(error.message));
        return;
      }
      resolve();
    });
  });
}

function createAlarm(name, delayMs) {
  return new Promise((resolve) => {
    chrome.alarms.create(name, {
      when: Date.now() + delayMs,
    });
    resolve();
  });
}

function clearAlarm(name) {
  return new Promise((resolve) => {
    chrome.alarms.clear(name, () => resolve());
  });
}

function downloadsDownload(options) {
  return new Promise((resolve, reject) => {
    chrome.downloads.download(options, (downloadId) => {
      const error = chrome.runtime.lastError;
      if (error) {
        reject(new Error(error.message));
        return;
      }
      if (typeof downloadId !== "number") {
        reject(new Error("Download API did not return a download id."));
        return;
      }
      resolve(downloadId);
    });
  });
}

function downloadsCancel(downloadId) {
  return new Promise((resolve) => {
    chrome.downloads.cancel(downloadId, () => resolve());
  });
}

async function getQueue(tabId) {
  const key = getQueueKey(tabId);
  const result = await sessionGet(key);
  return result[key] || null;
}

async function setQueue(tabId, queue) {
  const key = getQueueKey(tabId);
  await sessionSet({ [key]: queue });
}

async function getAllQueues() {
  const allItems = await sessionGet(null);
  return Object.entries(allItems)
    .filter(([key]) => key.startsWith(QUEUE_PREFIX))
    .map(([, value]) => value)
    .filter(Boolean);
}

function sendTabMessage(tabId, payload) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, payload, () => resolve());
  });
}

async function sendQueueUpdate(tabId, queue, phase, extra = {}) {
  await sendTabMessage(tabId, {
    type: "DOWNLOAD_QUEUE_UPDATE",
    payload: {
      phase,
      tabId,
      running: Boolean(queue?.running),
      cancelled: Boolean(queue?.cancelled),
      currentIndex: queue?.currentIndex || 0,
      total: queue?.total || 0,
      successCount: queue?.successCount || 0,
      failedCount: queue?.failedCount || 0,
      activeItem: queue?.activeItem || null,
      errors: queue?.errors || [],
      ...extra,
    },
  });
}

function createInitialQueue(items, kind, delayMs) {
  return {
    running: true,
    cancelled: false,
    status: "queued",
    kind,
    items,
    total: items.length,
    currentIndex: 0,
    successCount: 0,
    failedCount: 0,
    errors: [],
    activeItem: null,
    activeDownloadId: null,
    delayMs: typeof delayMs === "number" ? delayMs : DEFAULT_DELAY_MS,
    updatedAt: Date.now(),
  };
}

async function finalizeQueue(tabId, queue, phase) {
  queue.running = false;
  queue.status = phase;
  queue.activeDownloadId = null;
  queue.activeItem = null;
  queue.updatedAt = Date.now();
  await setQueue(tabId, queue);
  await clearAlarm(getAlarmName(tabId));
  await sendQueueUpdate(tabId, queue, phase);
}

async function scheduleNextDownload(tabId, delayMs) {
  await clearAlarm(getAlarmName(tabId));
  await createAlarm(getAlarmName(tabId), Math.max(0, delayMs));
}

async function startNextDownload(tabId) {
  const queue = await getQueue(tabId);
  if (!queue) return;

  if (queue.cancelled) {
    await finalizeQueue(tabId, queue, "cancelled");
    return;
  }

  if (queue.currentIndex >= queue.total) {
    await finalizeQueue(tabId, queue, "completed");
    return;
  }

  const item = queue.items[queue.currentIndex];
  queue.status = "downloading";
  queue.activeItem = {
    id: item.id,
    filename: item.filename,
    url: item.url,
  };
  queue.updatedAt = Date.now();
  await setQueue(tabId, queue);
  await sendQueueUpdate(tabId, queue, "downloading", {
    message: `Downloading ${queue.currentIndex + 1}/${queue.total}`,
  });

  try {
    const downloadId = await downloadsDownload({
      url: item.url,
      filename: item.filename,
      saveAs: false,
      conflictAction: "uniquify",
    });

    queue.activeDownloadId = downloadId;
    queue.updatedAt = Date.now();
    await setQueue(tabId, queue);
  } catch (error) {
    queue.failedCount += 1;
    queue.errors.push({
      id: item.id,
      filename: item.filename,
      message: error.message,
    });
    queue.currentIndex += 1;
    queue.activeItem = null;
    queue.activeDownloadId = null;
    queue.updatedAt = Date.now();
    await setQueue(tabId, queue);
    await sendQueueUpdate(tabId, queue, "item-failed", {
      message: error.message,
      failedItem: item,
    });
    await scheduleNextDownload(tabId, queue.delayMs);
  }
}

async function startQueue(tabId, payload) {
  const queue = await getQueue(tabId);
  if (queue && queue.running) {
    throw new Error("A download queue is already running in this tab.");
  }

  const items = Array.isArray(payload?.items) ? payload.items.filter((item) => item && item.url && item.filename) : [];
  if (!items.length) {
    throw new Error("No files were provided for download.");
  }

  const nextQueue = createInitialQueue(items, payload.kind || "video", payload.delayMs);
  await setQueue(tabId, nextQueue);
  await sendQueueUpdate(tabId, nextQueue, "queued", {
    message: `Queue created with ${nextQueue.total} items.`,
  });
  await startNextDownload(tabId);
}

async function cancelQueue(tabId) {
  const queue = await getQueue(tabId);
  if (!queue || !queue.running) {
    return { cancelled: false, message: "No active queue." };
  }

  queue.cancelled = true;
  queue.status = "cancelling";
  queue.updatedAt = Date.now();
  await setQueue(tabId, queue);
  await clearAlarm(getAlarmName(tabId));
  await sendQueueUpdate(tabId, queue, "cancelling", {
    message: "Cancelling download queue...",
  });

  if (queue.activeDownloadId) {
    await downloadsCancel(queue.activeDownloadId);
  } else {
    await finalizeQueue(tabId, queue, "cancelled");
  }

  return { cancelled: true };
}

async function exportTextFile(payload) {
  const mimeType = payload?.mimeType || "text/plain;charset=utf-8";
  const content = typeof payload?.content === "string" ? payload.content : "";
  const filename = payload?.filename || `douyin-export-${Date.now()}.txt`;
  const dataUrl = `data:${mimeType},${encodeURIComponent(content)}`;

  await downloadsDownload({
    url: dataUrl,
    filename,
    saveAs: false,
    conflictAction: "uniquify",
  });
}

async function findQueueByDownloadId(downloadId) {
  const queues = await getAllQueues();
  return queues.find((queue) => queue.activeDownloadId === downloadId) || null;
}

async function findTabIdByDownloadId(downloadId) {
  const allItems = await sessionGet(null);
  for (const [key, queue] of Object.entries(allItems)) {
    if (!key.startsWith(QUEUE_PREFIX) || !queue || queue.activeDownloadId !== downloadId) {
      continue;
    }
    return Number(key.slice(QUEUE_PREFIX.length));
  }
  return null;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id;

  if (message?.type === "START_DOWNLOAD_QUEUE") {
    if (typeof tabId !== "number") {
      sendResponse({ ok: false, error: "No active tab context for this download request." });
      return false;
    }
    startQueue(tabId, message.payload)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message?.type === "CANCEL_DOWNLOAD_QUEUE") {
    if (typeof tabId !== "number") {
      sendResponse({ ok: false, error: "No active tab context for this cancel request." });
      return false;
    }
    cancelQueue(tabId)
      .then((result) => sendResponse({ ok: true, result }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message?.type === "GET_QUEUE_STATUS") {
    if (typeof tabId !== "number") {
      sendResponse({ ok: true, queue: null });
      return false;
    }
    getQueue(tabId)
      .then((queue) => sendResponse({ ok: true, queue }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message?.type === "DOWNLOAD_TEXT_FILE") {
    exportTextFile(message.payload)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  return false;
});

chrome.downloads.onChanged.addListener(async (delta) => {
  if (!delta || typeof delta.id !== "number" || !delta.state || !delta.state.current) return;

  const tabId = await findTabIdByDownloadId(delta.id);
  if (typeof tabId !== "number") return;

  const queue = await getQueue(tabId);
  if (!queue || queue.activeDownloadId !== delta.id) return;

  const item = queue.items[queue.currentIndex];
  const state = delta.state.current;

  if (state === "complete") {
    queue.successCount += 1;
    queue.currentIndex += 1;
    queue.activeDownloadId = null;
    queue.activeItem = null;
    queue.updatedAt = Date.now();
    await setQueue(tabId, queue);
    await sendQueueUpdate(tabId, queue, "item-complete", {
      completedItem: item,
    });

    if (queue.cancelled) {
      await finalizeQueue(tabId, queue, "cancelled");
      return;
    }

    await scheduleNextDownload(tabId, queue.delayMs);
    return;
  }

  if (state === "interrupted") {
    queue.failedCount += 1;
    queue.currentIndex += 1;
    queue.activeDownloadId = null;
    queue.activeItem = null;
    queue.errors.push({
      id: item?.id,
      filename: item?.filename,
      message: delta.error?.current || "interrupted",
    });
    queue.updatedAt = Date.now();
    await setQueue(tabId, queue);
    await sendQueueUpdate(tabId, queue, queue.cancelled ? "cancelled" : "item-failed", {
      failedItem: item,
      message: delta.error?.current || "interrupted",
    });

    if (queue.cancelled) {
      await finalizeQueue(tabId, queue, "cancelled");
      return;
    }

    await scheduleNextDownload(tabId, queue.delayMs);
  }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (!alarm?.name || !alarm.name.startsWith(NEXT_ALARM_PREFIX)) return;
  const tabId = Number(alarm.name.slice(NEXT_ALARM_PREFIX.length));
  if (Number.isNaN(tabId)) return;
  await startNextDownload(tabId);
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  await clearAlarm(getAlarmName(tabId));
  await sessionRemove(getQueueKey(tabId));
});
