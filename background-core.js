(function initializeDouyinBackgroundCore(globalScope) {
  "use strict";

  const Core = globalScope.DYEXCore;
  if (!Core) throw new Error("DYEXCore must be loaded before background-core.js.");

  const TRANSLATION_CACHE_KEY = "douyinTranslationCacheV1";
  const KEY_HEALTH_STORAGE_KEY = "douyinApiKeyHealthV1";
  const CACHE_TTL_MS = 90 * 24 * 60 * 60 * 1000;
  const CACHE_MAX_ENTRIES = 2000;

  function localGet(keys) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(keys, (result) => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(new Core.CoreError(Core.ERROR_CODES.STORAGE_READ_FAILED, error.message));
          return;
        }
        resolve(result || {});
      });
    });
  }

  function localSet(values) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(values, () => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(new Core.CoreError(Core.ERROR_CODES.STORAGE_WRITE_FAILED, error.message));
          return;
        }
        resolve();
      });
    });
  }

  async function sha256(value) {
    const bytes = new TextEncoder().encode(String(value || ""));
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async function createTranslationCacheKey(item, context) {
    return sha256(JSON.stringify({
      id: String(item.id || ""),
      title: String(item.title || ""),
      caption: String(item.caption || ""),
      desc: String(item.desc || ""),
      language: context.languageCode,
      providerMode: context.providerMode,
      geminiModel: context.selectedModels.gemini,
      groqModel: context.selectedModels.groq
    }));
  }

  class TranslationCache {
    constructor(entries = {}) {
      this.entries = entries && typeof entries === "object" ? entries : {};
      this.dirty = false;
    }

    static async load() {
      const result = await localGet(TRANSLATION_CACHE_KEY);
      return new TranslationCache(result[TRANSLATION_CACHE_KEY]);
    }

    get(key) {
      const entry = this.entries[key];
      if (!entry || typeof entry.title !== "string") return "";
      if (Date.now() - Number(entry.createdAt || 0) > CACHE_TTL_MS) {
        delete this.entries[key];
        this.dirty = true;
        return "";
      }
      entry.lastUsedAt = Date.now();
      this.dirty = true;
      return entry.title;
    }

    set(key, title) {
      const cleanTitle = String(title || "").trim().slice(0, 140);
      if (!key || !cleanTitle) return;
      const previous = this.entries[key];
      this.entries[key] = {
        title: cleanTitle,
        createdAt: Number(previous?.createdAt) || Date.now(),
        lastUsedAt: Date.now()
      };
      this.dirty = true;
    }

    prune() {
      const now = Date.now();
      const rows = Object.entries(this.entries)
        .filter(([, entry]) => entry && now - Number(entry.createdAt || 0) <= CACHE_TTL_MS)
        .sort((left, right) => Number(right[1].lastUsedAt || 0) - Number(left[1].lastUsedAt || 0))
        .slice(0, CACHE_MAX_ENTRIES);
      this.entries = Object.fromEntries(rows);
    }

    async save() {
      if (!this.dirty) return;
      this.prune();
      await localSet({ [TRANSLATION_CACHE_KEY]: this.entries });
      this.dirty = false;
    }
  }

  function classifyProviderFailure(error) {
    const status = Number(error?.status) || 0;
    const detail = String(error?.message || "").toLowerCase();
    const retryAfterMs = Math.max(0, Number(error?.retryAfterMs) || 0);
    if (status === 403 && /model|does not have access|permission.*model/.test(detail)) {
      return { code: Core.ERROR_CODES.AI_PROVIDER_UNAVAILABLE, reason: "model-access", cooldownMs: 10 * 60 * 1000, retryable: false };
    }
    if ([401, 403].includes(status) || /invalid api key|api key not valid|authentication|unauthorized/.test(detail)) {
      return { code: Core.ERROR_CODES.AI_KEY_INVALID, reason: "invalid", cooldownMs: 30 * 24 * 60 * 60 * 1000, retryable: false };
    }
    if (status === 429 && /quota|resource_exhausted|insufficient_quota|billing/.test(detail)) {
      return { code: Core.ERROR_CODES.AI_QUOTA_EXHAUSTED, reason: "quota", cooldownMs: Math.max(retryAfterMs, 6 * 60 * 60 * 1000), retryable: true };
    }
    if (status === 429) {
      return { code: Core.ERROR_CODES.AI_RATE_LIMITED, reason: "rate-limit", cooldownMs: Math.max(retryAfterMs, 60 * 1000), retryable: true };
    }
    if (status >= 500 || !status) {
      return { code: Core.ERROR_CODES.AI_PROVIDER_UNAVAILABLE, reason: "provider", cooldownMs: Math.max(retryAfterMs, 30 * 1000), retryable: true };
    }
    return { code: Core.ERROR_CODES.AI_PROVIDER_UNAVAILABLE, reason: "request", cooldownMs: 0, retryable: false };
  }

  class KeyHealthRegistry {
    constructor(records = {}) {
      this.records = records && typeof records === "object" ? records : {};
      this.dirty = false;
    }

    static async load() {
      const result = await localGet(KEY_HEALTH_STORAGE_KEY);
      return new KeyHealthRegistry(result[KEY_HEALTH_STORAGE_KEY]);
    }

    async identify(provider, key) {
      return `${provider}:${(await sha256(key)).slice(0, 16)}`;
    }

    async describe(provider, keys) {
      const entries = [];
      for (let index = 0; index < keys.length; index += 1) {
        const id = await this.identify(provider, keys[index]);
        const health = this.records[id] || {};
        entries.push({ index, key: keys[index], id, health });
      }
      return entries;
    }

    isBlocked(entry, now = Date.now()) {
      return Number(entry?.health?.cooldownUntil || 0) > now;
    }

    markSuccess(entry) {
      if (!entry?.id) return;
      this.records[entry.id] = {
        provider: entry.id.split(":")[0],
        state: "healthy",
        failureCount: 0,
        cooldownUntil: 0,
        lastStatus: 200,
        lastSuccessAt: Date.now()
      };
      entry.health = this.records[entry.id];
      this.dirty = true;
    }

    markFailure(entry, error) {
      const classification = classifyProviderFailure(error);
      const previous = this.records[entry.id] || {};
      const failureCount = Number(previous.failureCount || 0) + 1;
      const multiplier = classification.reason === "rate-limit" ? Math.min(8, 2 ** Math.max(0, failureCount - 1)) : 1;
      const cooldownMs = Math.min(24 * 60 * 60 * 1000, classification.cooldownMs * multiplier);
      this.records[entry.id] = {
        provider: entry.id.split(":")[0],
        state: classification.reason,
        failureCount,
        cooldownUntil: cooldownMs ? Date.now() + cooldownMs : 0,
        lastStatus: Number(error?.status) || 0,
        lastErrorAt: Date.now()
      };
      entry.health = this.records[entry.id];
      this.dirty = true;
      return new Core.CoreError(classification.code, error?.message || "AI provider request failed.", {
        status: Number(error?.status) || 0,
        retryable: classification.retryable,
        cause: error,
        details: { provider: this.records[entry.id].provider, cooldownUntil: this.records[entry.id].cooldownUntil }
      });
    }

    async save() {
      if (!this.dirty) return;
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
      this.records = Object.fromEntries(Object.entries(this.records).filter(([, record]) => {
        return Number(record.lastSuccessAt || record.lastErrorAt || 0) >= cutoff || Number(record.cooldownUntil || 0) > Date.now();
      }));
      await localSet({ [KEY_HEALTH_STORAGE_KEY]: this.records });
      this.dirty = false;
    }
  }

  function createQueue(items, kind, delayMs) {
    const now = Date.now();
    return {
      schemaVersion: Core.QUEUE_SCHEMA_VERSION,
      queueId: `${now}-${Math.random().toString(36).slice(2, 10)}`,
      running: true,
      cancelled: false,
      status: "queued",
      kind: kind || "video",
      items: Array.isArray(items) ? items : [],
      total: Array.isArray(items) ? items.length : 0,
      currentIndex: 0,
      successCount: 0,
      failedCount: 0,
      completedItemIds: [],
      errors: [],
      activeItem: null,
      activeDownloadId: null,
      activeStartedAt: null,
      delayMs: Core.normalizeDelay(delayMs),
      startedAt: now,
      updatedAt: now
    };
  }

  function normalizeQueue(rawQueue) {
    if (!rawQueue || typeof rawQueue !== "object") return null;
    const items = Array.isArray(rawQueue.items)
      ? rawQueue.items.filter((item) => item && item.url && item.filename)
      : [];
    const total = items.length;
    const currentIndex = Math.min(total, Math.max(0, Number(rawQueue.currentIndex) || 0));
    return {
      ...rawQueue,
      schemaVersion: Core.QUEUE_SCHEMA_VERSION,
      queueId: String(rawQueue.queueId || `${rawQueue.startedAt || Date.now()}-legacy`),
      items,
      total,
      currentIndex,
      successCount: Math.max(0, Number(rawQueue.successCount) || 0),
      failedCount: Math.max(0, Number(rawQueue.failedCount) || 0),
      completedItemIds: Array.isArray(rawQueue.completedItemIds) ? rawQueue.completedItemIds.map(String) : [],
      errors: Array.isArray(rawQueue.errors) ? rawQueue.errors.slice(-100) : [],
      activeDownloadId: Number.isInteger(rawQueue.activeDownloadId) ? rawQueue.activeDownloadId : null,
      delayMs: Core.normalizeDelay(rawQueue.delayMs),
      updatedAt: Number(rawQueue.updatedAt) || Date.now()
    };
  }

  function serializeError(error, fallbackCode = Core.ERROR_CODES.UNKNOWN) {
    return Core.asCoreError(error, fallbackCode).toJSON();
  }

  globalScope.DYEXBackgroundCore = Object.freeze({
    TRANSLATION_CACHE_KEY,
    KEY_HEALTH_STORAGE_KEY,
    localGet,
    localSet,
    sha256,
    createTranslationCacheKey,
    TranslationCache,
    KeyHealthRegistry,
    classifyProviderFailure,
    createQueue,
    normalizeQueue,
    serializeError
  });
})(globalThis);
