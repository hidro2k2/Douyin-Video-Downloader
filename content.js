(function () {
  "use strict";

  if (window.__DOUYIN_DOWNLOADER_EXTENSION__) {
    return;
  }
  window.__DOUYIN_DOWNLOADER_EXTENSION__ = true;

  const CONFIG = {
    API_BASE_URL: "https://www.douyin.com/aweme/v1/web/aweme/post/",
    ROOT_ID: "dyex-root",
    MODAL_ID: "dyex-modal",
    BACKDROP_ID: "dyex-backdrop",
    TRIGGER_ID: "dyex-trigger",
    STATUS_ID: "dyex-status",
    TABLE_BODY_ID: "dyex-table-body",
    SELECT_ALL_ID: "dyex-select-all",
    SELECTED_COUNT_ID: "dyex-selected-count",
    TOTAL_COUNT_ID: "dyex-total-count",
    FETCH_BUTTON_ID: "dyex-fetch-button",
    DOWNLOAD_BUTTON_ID: "dyex-download-button",
    DOWNLOAD_MENU_ID: "dyex-download-menu",
    CANCEL_BUTTON_ID: "dyex-cancel-button",
    DONATE_TOGGLE_ID: "dyex-donate-toggle",
    DONATE_POPUP_ID: "dyex-donate-popup",
    SEARCH_INPUT_ID: "dyex-search-input",
    DATE_FROM_ID: "dyex-date-from",
    DATE_TO_ID: "dyex-date-to",
    RESET_FILTERS_ID: "dyex-reset-filters",
    RANGE_START_ID: "dyex-range-start",
    RANGE_END_ID: "dyex-range-end",
    APPLY_RANGE_ID: "dyex-apply-range",
    CLEAR_RANGE_ID: "dyex-clear-range",
    FOLDER_INPUT_ID: "dyex-folder-input",
    DELAY_INPUT_ID: "dyex-delay-input",
    WAIT_TIMEOUT_MS: 30000,
    WAIT_INTERVAL_MS: 150,
    REQUEST_DELAY_MS: 900,
    RETRY_DELAY_MS: 1600,
    MAX_RETRIES: 4,
    QUEUE_DELAY_MS: 700,
    STORAGE_KEY: "douyinDownloaderSettings",
    BUTTON_RETRY_MS: 1200,
    ROUTE_CHECK_MS: 1000,
    BUTTON_TEXT_CANDIDATES: [/\u4f5c\u54c1/, /\u89c6\u9891/, /Videos?/i, /Posts?/i],
    ANCHOR_SELECTORS: [
      '[data-e2e="user-tab-count"]',
      '[data-e2e*="user-tab"] [data-e2e="user-tab-count"]',
      '[role="tab"]'
    ],
    REQUEST_QUERY: {
      device_platform: "webapp",
      aid: "6383",
      channel: "channel_pc_web",
      count: "20",
      version_code: "170400",
      version_name: "17.4.0"
    }
  };

  const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  function debounce(fn, wait) {
    let timeoutId = null;
    return function debounced(...args) {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function toHttps(url) {
    if (!url || typeof url !== "string") return "";
    return url.startsWith("http://") ? url.replace(/^http:\/\//i, "https://") : url;
  }

  function formatDisplayDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  }

  function formatFileDate(dateString) {
    if (!dateString) return "unknown-date";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "unknown-date";
    return date.toISOString().slice(0, 10);
  }

  function timestampForFile() {
    return new Date().toISOString().replace(/[:.]/g, "-");
  }

  function waitForElement(selector, timeout = CONFIG.WAIT_TIMEOUT_MS, interval = CONFIG.WAIT_INTERVAL_MS) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(selector);
      if (existing) {
        resolve(existing);
        return;
      }

      let observer = null;
      const startedAt = Date.now();

      const intervalId = window.setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          if (observer) observer.disconnect();
          window.clearInterval(intervalId);
          resolve(element);
          return;
        }

        if (Date.now() - startedAt >= timeout) {
          if (observer) observer.disconnect();
          window.clearInterval(intervalId);
          reject(new Error(`Timeout waiting for element: ${selector}`));
        }
      }, interval);

      observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (!element) return;
        observer.disconnect();
        window.clearInterval(intervalId);
        resolve(element);
      });

      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });
  }

  async function retryWithDelay(fn, retries = CONFIG.MAX_RETRIES, delayMs = CONFIG.RETRY_DELAY_MS) {
    let lastError = null;
    for (let attempt = 1; attempt <= retries; attempt += 1) {
      try {
        return await fn(attempt);
      } catch (error) {
        lastError = error;
        if (attempt === retries) break;
        await sleep(delayMs);
      }
    }
    throw lastError;
  }

  function getSecUserIdFromUrl() {
    const match = window.location.pathname.match(/\/user\/([^/?#]+)/);
    return match ? match[1] : "";
  }

  function createElement(tagName, options = {}) {
    const element = document.createElement(tagName);
    Object.entries(options).forEach(([key, value]) => {
      if (key === "className") {
        element.className = value;
      } else if (key === "text") {
        element.textContent = value;
      } else if (key === "html") {
        element.innerHTML = value;
      } else {
        element.setAttribute(key, value);
      }
    });
    return element;
  }

  function findProfileTabAnchor() {
    for (const selector of CONFIG.ANCHOR_SELECTORS) {
      const candidates = Array.from(document.querySelectorAll(selector));
      const matched = candidates.find((element) => {
        const text = (element.textContent || "").replace(/\s+/g, " ").trim();
        return CONFIG.BUTTON_TEXT_CANDIDATES.some((pattern) => pattern.test(text)) || /\d+/.test(text);
      });
      if (matched) return matched;
    }

    return Array.from(document.querySelectorAll("div, span, button, a")).find((element) => {
      const text = (element.textContent || "").replace(/\s+/g, " ").trim();
      if (!text || text.length > 24) return false;
      return CONFIG.BUTTON_TEXT_CANDIDATES.some((pattern) => pattern.test(text)) && /\d+/.test(text);
    }) || null;
  }

  function sendRuntimeMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(new Error(error.message));
          return;
        }
        resolve(response);
      });
    });
  }

  function storageGet(keys) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(keys, (result) => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(new Error(error.message));
          return;
        }
        resolve(result || {});
      });
    });
  }

  function storageSet(values) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(values, () => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(new Error(error.message));
          return;
        }
        resolve();
      });
    });
  }

  function sanitizeFolderPath(input) {
    return String(input || "")
      .split(/[\\/]+/)
      .map((segment) => segment.trim().replace(/[<>:"|?*]/g, "").replace(/\.+/g, "."))
      .filter((segment) => segment && segment !== "." && segment !== "..")
      .join("/");
  }

  function sanitizeFileComponent(input, fallback = "file") {
    const value = String(input || "")
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .replace(/\s+/g, "_")
      .replace(/[.]+$/g, "")
      .trim();
    return (value || fallback).slice(0, 80);
  }

  function normalizeDelay(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) {
      return CONFIG.QUEUE_DELAY_MS;
    }
    return Math.round(numeric);
  }

  class DouyinApiClient {
    constructor(secUserId) {
      this.secUserId = secUserId;
    }

    async fetchVideos(maxCursor = 0) {
      const url = new URL(CONFIG.API_BASE_URL);
      const query = {
        ...CONFIG.REQUEST_QUERY,
        sec_user_id: this.secUserId,
        max_cursor: String(maxCursor)
      };

      Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));

      const response = await fetch(url.toString(), {
        method: "GET",
        credentials: "include",
        referrer: window.location.href,
        headers: {
          Accept: "application/json, text/plain, */*"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} while fetching videos`);
      }

      const payload = await response.json();
      if (payload?.status_code && payload.status_code !== 0) {
        throw new Error(`Douyin API returned status_code ${payload.status_code}`);
      }

      return payload;
    }
  }

  class VideoDataProcessor {
    static extractVideoMetadata(item) {
      if (!item || !item.aweme_id) return null;

      const caption = item.desc || "";
      const title = item.title || caption || "Untitled";
      const videoUrl = toHttps(
        item.video?.play_addr?.url_list?.[0] || item.video?.download_addr?.url_list?.[0] || ""
      );
      const audioUrl = toHttps(item.music?.play_url?.url_list?.[0] || "");
      const coverUrl = toHttps(item.video?.cover?.url_list?.[0] || item.cover?.url_list?.[0] || "");
      const dynamicCoverUrl = toHttps(
        item.video?.dynamic_cover?.url_list?.[0] || item.dynamic_cover?.url_list?.[0] || ""
      );
      const createTime = item.create_time ? new Date(item.create_time * 1000).toISOString() : "";

      if (!videoUrl) return null;

      return {
        id: String(item.aweme_id),
        desc: caption,
        caption,
        title,
        createTime,
        videoUrl,
        audioUrl,
        coverUrl,
        dynamicCoverUrl
      };
    }

    static processPayload(payload, existingIds = new Set()) {
      const sourceList = Array.isArray(payload?.aweme_list) ? payload.aweme_list : [];
      const videos = [];

      for (const item of sourceList) {
        const video = this.extractVideoMetadata(item);
        if (!video || existingIds.has(video.id)) continue;
        existingIds.add(video.id);
        videos.push(video);
      }

      return {
        videos,
        hasMore: Boolean(payload?.has_more),
        maxCursor: Number(payload?.max_cursor || 0)
      };
    }
  }

  class DouyinDownloaderExtension {
    constructor() {
      this.videos = [];
      this.videoMap = new Map();
      this.selectedIds = new Set();
      this.filters = {
        search: "",
        dateFrom: "",
        dateTo: ""
      };
      this.range = {
        start: "",
        end: ""
      };
      this.settings = {
        downloadFolder: "douyin_downloads",
        queueDelayMs: CONFIG.QUEUE_DELAY_MS
      };
      this.assets = {
        qrUrl: chrome.runtime.getURL("QR.png")
      };
      this.isFetching = false;
      this.isDownloading = false;
      this.modalOpen = false;
      this.currentSecUserId = getSecUserIdFromUrl();
      this.ui = {};
      this.ensureTriggerButtonDebounced = debounce(() => this.ensureTriggerButton(), 180);
      this.boundOnDocumentClick = this.onDocumentClick.bind(this);
      this.boundOnKeyDown = this.onKeyDown.bind(this);
      this.boundOnRuntimeMessage = this.onRuntimeMessage.bind(this);
    }

    async init() {
      await waitForElement("body").catch(() => null);
      this.mountUi();
      this.cacheUi();
      await this.loadSettings();
      this.bindEvents();
      this.ensureTriggerButton();
      this.startObservers();
      await this.syncQueueStatus();
    }

    mountUi() {
      if (document.getElementById(CONFIG.ROOT_ID)) return;

      const root = createElement("div", {
        id: CONFIG.ROOT_ID,
        html: `
          <div id="${CONFIG.BACKDROP_ID}" class="dyex-backdrop" hidden></div>
          <section id="${CONFIG.MODAL_ID}" class="dyex-modal" hidden aria-modal="true" role="dialog" aria-labelledby="dyex-title">
            <div class="dyex-shell">
              <header class="dyex-header">
                <div class="dyex-brand">
                  <span class="dyex-brand-icon" aria-hidden="true">
                    <svg viewBox="0 0 64 64" fill="none">
                      <rect width="64" height="64" rx="16" fill="#10121B"></rect>
                      <path d="M34.5 11.5v25.3a10.8 10.8 0 1 1-8.3-10.5v7a4.3 4.3 0 1 0 2.9 4.1V16.9c5.6 5 11.7 7.2 18.7 7.2v-7.4c-4.5-.2-8.7-1.6-13.3-5.2Z" fill="#25F4EE"></path>
                      <path d="M37.9 8v25.4a10.8 10.8 0 1 1-8.4-10.5v7a4.3 4.3 0 1 0 3 4.1V13.3c5.5 5 11.7 7.2 18.7 7.2v-7.4c-4.5-.2-8.8-1.6-13.3-5.1Z" fill="#FE2C55"></path>
                      <path d="M36.1 9.7v25.4a10.8 10.8 0 1 1-8.4-10.5v7a4.3 4.3 0 1 0 3 4.1V15c5.5 5 11.6 7.2 18.7 7.2v-7.4c-4.6-.2-8.8-1.6-13.3-5.1Z" fill="#fff"></path>
                    </svg>
                  </span>
                  <div class="dyex-brand-copy">
                    <h2 id="dyex-title">Douyin Downloader</h2>
                    <p class="dyex-brand-subtitle">by Le Thanh Thai Duong</p>
                  </div>
                </div>
                <div class="dyex-header-actions">
                  <div class="dyex-donate-wrap">
                    <button id="${CONFIG.DONATE_TOGGLE_ID}" type="button" class="dyex-donate-button" aria-label="Support the author">
                      <span class="dyex-donate-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M5 9h11a4 4 0 0 1 0 8H8a3 3 0 0 1-3-3V9Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                          <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                          <path d="M8 6c.8.1 1.6.5 2.1 1.1.9 1 .9 2.5.1 3.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                          <path d="M12 5c.9.2 1.7.7 2.3 1.4 1.1 1.2 1.1 3 .1 4.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                        </svg>
                      </span>
                      <span>Buy me a coffee</span>
                    </button>
                    <div id="${CONFIG.DONATE_POPUP_ID}" class="dyex-donate-popup" hidden>
                      <div class="dyex-donate-card">
                        <div class="dyex-donate-top">
                          <div>
                            <h3>Support the author</h3>
                            <p>Le Thanh Thai Duong</p>
                          </div>
                          <a href="https://zalo.me/0342252825" target="_blank" rel="noopener noreferrer" class="dyex-donate-link">Zalo</a>
                        </div>
                        <img src="${this.assets.qrUrl}" alt="Donate QR" class="dyex-donate-qr">
                        <div class="dyex-donate-bank">
                          <div class="dyex-donate-label">Vietcombank</div>
                          <div class="dyex-donate-value">1016581189</div>
                          <div class="dyex-donate-muted">Le Thanh Thai Duong</div>
                        </div>
                        <div class="dyex-donate-links">
                          <a href="https://zalo.me/g/mkvsqm829" target="_blank" rel="noopener noreferrer">Tram AI 4.0</a>
                          <a href="https://zalo.me/0342252825" target="_blank" rel="noopener noreferrer">Author Zalo</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="button" class="dyex-icon-button" data-action="close-modal" aria-label="Close">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                    </svg>
                  </button>
                </div>
              </header>

              <div class="dyex-body">
                <div id="${CONFIG.STATUS_ID}" class="dyex-status">Ready.</div>

                <div class="dyex-panel">
                  <div class="dyex-toolbar">
                    <div class="dyex-toolbar-left">
                      <label class="dyex-select-all">
                        <input id="${CONFIG.SELECT_ALL_ID}" type="checkbox">
                        <span>Select All (<span id="${CONFIG.SELECTED_COUNT_ID}">0</span>/<span id="${CONFIG.TOTAL_COUNT_ID}">0</span>)</span>
                      </label>

                      <div class="dyex-toolbar-divider" aria-hidden="true"></div>

                      <div class="dyex-dropdown">
                        <button id="${CONFIG.DOWNLOAD_BUTTON_ID}" type="button" class="dyex-button dyex-button-primary" disabled>
                          <span>Download</span>
                          <svg viewBox="0 0 20 20" fill="none">
                            <path d="m5 7 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                          </svg>
                        </button>
                        <button id="${CONFIG.CANCEL_BUTTON_ID}" type="button" class="dyex-button dyex-button-secondary" disabled>Stop</button>
                        <div id="${CONFIG.DOWNLOAD_MENU_ID}" class="dyex-dropdown-menu" hidden>
                          <button type="button" data-download-action="video">Download Selected Videos</button>
                          <button type="button" data-download-action="audio">Download Selected Audios</button>
                          <button type="button" data-download-action="json">Export Metadata JSON</button>
                          <button type="button" data-download-action="txt">Export Links TXT</button>
                          <button type="button" data-download-action="csv">Export CSV</button>
                        </div>
                      </div>
                    </div>

                    <div class="dyex-toolbar-right">
                      <button id="${CONFIG.FETCH_BUTTON_ID}" type="button" class="dyex-button dyex-button-primary">Fetch Videos</button>
                    </div>
                  </div>

                  <div class="dyex-subtoolbar">
                    <div class="dyex-filter-group">
                      <input id="${CONFIG.SEARCH_INPUT_ID}" class="dyex-input dyex-search-input" type="search" placeholder="Search by title or caption">
                      <input id="${CONFIG.DATE_FROM_ID}" class="dyex-input dyex-date-input" type="date">
                      <input id="${CONFIG.DATE_TO_ID}" class="dyex-input dyex-date-input" type="date">
                      <button id="${CONFIG.RESET_FILTERS_ID}" type="button" class="dyex-button dyex-button-secondary">Reset Filters</button>
                    </div>
                    <div class="dyex-settings-group">
                      <div class="dyex-range-group">
                        <input id="${CONFIG.RANGE_START_ID}" class="dyex-input dyex-range-input" type="number" min="1" step="1" placeholder="Start #">
                        <input id="${CONFIG.RANGE_END_ID}" class="dyex-input dyex-range-input" type="number" min="1" step="1" placeholder="End #">
                        <button id="${CONFIG.APPLY_RANGE_ID}" type="button" class="dyex-button dyex-button-secondary">Select Range</button>
                        <button id="${CONFIG.CLEAR_RANGE_ID}" type="button" class="dyex-button dyex-button-tertiary">Unselect Range</button>
                      </div>
                      <input id="${CONFIG.FOLDER_INPUT_ID}" class="dyex-input dyex-folder-input" type="text" placeholder="File prefix">
                      <label class="dyex-delay-wrap">
                        <span>Delay (ms)</span>
                        <input id="${CONFIG.DELAY_INPUT_ID}" class="dyex-input dyex-delay-input" type="number" min="0" step="100">
                      </label>
                    </div>
                  </div>

                  <div class="dyex-table-wrap">
                    <table class="dyex-table">
                      <thead>
                        <tr>
                          <th class="dyex-col-select">Select</th>
                          <th class="dyex-col-index">No.</th>
                          <th class="dyex-col-cover">Cover</th>
                          <th>Title / Caption</th>
                          <th class="dyex-col-date">Date</th>
                          <th class="dyex-col-actions">Actions</th>
                        </tr>
                      </thead>
                      <tbody id="${CONFIG.TABLE_BODY_ID}">
                        <tr class="dyex-empty-row">
                          <td colspan="6">No videos loaded yet.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        `
      });

      document.body.appendChild(root);
    }

    cacheUi() {
      this.ui.backdrop = document.getElementById(CONFIG.BACKDROP_ID);
      this.ui.modal = document.getElementById(CONFIG.MODAL_ID);
      this.ui.status = document.getElementById(CONFIG.STATUS_ID);
      this.ui.tableBody = document.getElementById(CONFIG.TABLE_BODY_ID);
      this.ui.selectAll = document.getElementById(CONFIG.SELECT_ALL_ID);
      this.ui.fetchButton = document.getElementById(CONFIG.FETCH_BUTTON_ID);
      this.ui.downloadButton = document.getElementById(CONFIG.DOWNLOAD_BUTTON_ID);
      this.ui.downloadMenu = document.getElementById(CONFIG.DOWNLOAD_MENU_ID);
      this.ui.cancelButton = document.getElementById(CONFIG.CANCEL_BUTTON_ID);
      this.ui.donateToggle = document.getElementById(CONFIG.DONATE_TOGGLE_ID);
      this.ui.donatePopup = document.getElementById(CONFIG.DONATE_POPUP_ID);
      this.ui.selectedCount = document.getElementById(CONFIG.SELECTED_COUNT_ID);
      this.ui.totalCount = document.getElementById(CONFIG.TOTAL_COUNT_ID);
      this.ui.searchInput = document.getElementById(CONFIG.SEARCH_INPUT_ID);
      this.ui.dateFromInput = document.getElementById(CONFIG.DATE_FROM_ID);
      this.ui.dateToInput = document.getElementById(CONFIG.DATE_TO_ID);
      this.ui.resetFiltersButton = document.getElementById(CONFIG.RESET_FILTERS_ID);
      this.ui.rangeStartInput = document.getElementById(CONFIG.RANGE_START_ID);
      this.ui.rangeEndInput = document.getElementById(CONFIG.RANGE_END_ID);
      this.ui.applyRangeButton = document.getElementById(CONFIG.APPLY_RANGE_ID);
      this.ui.clearRangeButton = document.getElementById(CONFIG.CLEAR_RANGE_ID);
      this.ui.folderInput = document.getElementById(CONFIG.FOLDER_INPUT_ID);
      this.ui.delayInput = document.getElementById(CONFIG.DELAY_INPUT_ID);
    }

    bindEvents() {
      if (this.ui.modal.dataset.bound === "true") return;
      this.ui.modal.dataset.bound = "true";

      this.ui.fetchButton.addEventListener("click", () => this.handleFetchVideos());
      this.ui.cancelButton.addEventListener("click", () => this.handleCancelQueue());
      this.ui.searchInput.addEventListener("input", () => this.handleFilterChange());
      this.ui.dateFromInput.addEventListener("change", () => this.handleFilterChange());
      this.ui.dateToInput.addEventListener("change", () => this.handleFilterChange());
      this.ui.resetFiltersButton.addEventListener("click", () => this.resetFilters());
      this.ui.applyRangeButton.addEventListener("click", () => this.applyRangeSelection());
      this.ui.clearRangeButton.addEventListener("click", () => this.clearRangeSelection());
      this.ui.folderInput.addEventListener("change", () => this.handleSettingsChange());
      this.ui.delayInput.addEventListener("change", () => this.handleSettingsChange());

      this.ui.selectAll.addEventListener("change", (event) => {
        const checked = Boolean(event.target.checked);
        const filteredVideos = this.getFilteredVideos();
        if (checked) {
          this.selectedIds = new Set(filteredVideos.map((video) => video.id));
        } else {
          this.selectedIds.clear();
        }
        this.renderTable();
        this.updateSelectionUi();
      });

      this.ui.tableBody.addEventListener("change", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || !target.classList.contains("dyex-row-check")) {
          return;
        }

        const videoId = target.dataset.videoId;
        if (!videoId) return;

        if (target.checked) {
          this.selectedIds.add(videoId);
        } else {
          this.selectedIds.delete(videoId);
        }

        this.updateSelectionUi();
      });

      this.ui.modal.addEventListener("click", (event) => {
        const closeButton = event.target.closest("[data-action='close-modal']");
        if (closeButton) {
          this.closeModal();
          return;
        }

        const downloadButton = event.target.closest(`#${CONFIG.DOWNLOAD_BUTTON_ID}`);
        if (downloadButton) {
          this.closeDonatePopup();
          this.toggleDownloadMenu();
          return;
        }

        const donateButton = event.target.closest(`#${CONFIG.DONATE_TOGGLE_ID}`);
        if (donateButton) {
          this.closeDownloadMenu();
          this.toggleDonatePopup();
          return;
        }

        const optionButton = event.target.closest("[data-download-action]");
        if (optionButton) {
          this.closeDonatePopup();
          this.handleDownloadAction(optionButton.getAttribute("data-download-action"));
          return;
        }

        if (!event.target.closest(`#${CONFIG.DONATE_POPUP_ID}`)) {
          this.closeDonatePopup();
        }
      });

      this.ui.backdrop.addEventListener("click", () => this.closeModal());
      document.addEventListener("click", this.boundOnDocumentClick);
      document.addEventListener("keydown", this.boundOnKeyDown);
      chrome.runtime.onMessage.addListener(this.boundOnRuntimeMessage);
    }

    async loadSettings() {
      try {
        const result = await storageGet(CONFIG.STORAGE_KEY);
        const saved = result[CONFIG.STORAGE_KEY] || {};
        this.settings.downloadFolder = sanitizeFolderPath(saved.downloadFolder || this.settings.downloadFolder);
        this.settings.queueDelayMs = normalizeDelay(saved.queueDelayMs);
      } catch (error) {
        console.error("Failed to load settings:", error);
      }

      this.ui.folderInput.value = this.settings.downloadFolder;
      this.ui.delayInput.value = String(this.settings.queueDelayMs);
    }

    async persistSettings() {
      await storageSet({
        [CONFIG.STORAGE_KEY]: {
          downloadFolder: this.settings.downloadFolder,
          queueDelayMs: this.settings.queueDelayMs
        }
      });
    }

    handleSettingsChange() {
      this.settings.downloadFolder = sanitizeFolderPath(this.ui.folderInput.value) || "douyin_downloads";
      this.settings.queueDelayMs = normalizeDelay(this.ui.delayInput.value);
      this.ui.folderInput.value = this.settings.downloadFolder;
      this.ui.delayInput.value = String(this.settings.queueDelayMs);

      this.persistSettings().catch((error) => {
        console.error("Failed to save settings:", error);
        this.setStatus("Failed to save settings.", "error");
      });
    }

    handleFilterChange() {
      this.filters.search = this.ui.searchInput.value.trim().toLowerCase();
      this.filters.dateFrom = this.ui.dateFromInput.value;
      this.filters.dateTo = this.ui.dateToInput.value;
      this.syncSelectionWithFilters();
      this.renderTable();
      this.updateSelectionUi();
      this.updateControlState();
    }

    resetFilters() {
      this.filters.search = "";
      this.filters.dateFrom = "";
      this.filters.dateTo = "";
      this.ui.searchInput.value = "";
      this.ui.dateFromInput.value = "";
      this.ui.dateToInput.value = "";
      this.syncSelectionWithFilters();
      this.renderTable();
      this.updateSelectionUi();
      this.updateControlState();
    }

    applyRangeSelection() {
      const filteredVideos = this.getFilteredVideos();
      if (!filteredVideos.length) {
        this.setStatus("No videos available for range selection.", "error");
        return;
      }

      const start = Number(this.ui.rangeStartInput.value);
      const end = Number(this.ui.rangeEndInput.value);

      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        this.setStatus("Enter valid start and end numbers.", "error");
        return;
      }

      const normalizedStart = Math.max(1, Math.min(start, end));
      const normalizedEnd = Math.min(filteredVideos.length, Math.max(start, end));

      if (normalizedStart > filteredVideos.length) {
        this.setStatus(`Start must be between 1 and ${filteredVideos.length}.`, "error");
        return;
      }

      this.selectedIds.clear();
      for (let index = normalizedStart - 1; index < normalizedEnd; index += 1) {
        this.selectedIds.add(filteredVideos[index].id);
      }

      this.range.start = String(normalizedStart);
      this.range.end = String(normalizedEnd);
      this.ui.rangeStartInput.value = this.range.start;
      this.ui.rangeEndInput.value = this.range.end;
      this.renderTable();
      this.updateSelectionUi();
      this.updateControlState();
      this.setStatus(`Selected videos ${normalizedStart}-${normalizedEnd}.`, "success");
    }

    clearRangeSelection() {
      const filteredVideos = this.getFilteredVideos();
      if (!filteredVideos.length) {
        this.setStatus("No videos available for range unselect.", "error");
        return;
      }

      const start = Number(this.ui.rangeStartInput.value);
      const end = Number(this.ui.rangeEndInput.value);

      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        this.setStatus("Enter valid start and end numbers.", "error");
        return;
      }

      const normalizedStart = Math.max(1, Math.min(start, end));
      const normalizedEnd = Math.min(filteredVideos.length, Math.max(start, end));

      if (normalizedStart > filteredVideos.length) {
        this.setStatus(`Start must be between 1 and ${filteredVideos.length}.`, "error");
        return;
      }

      for (let index = normalizedStart - 1; index < normalizedEnd; index += 1) {
        this.selectedIds.delete(filteredVideos[index].id);
      }

      this.range.start = String(normalizedStart);
      this.range.end = String(normalizedEnd);
      this.ui.rangeStartInput.value = this.range.start;
      this.ui.rangeEndInput.value = this.range.end;
      this.renderTable();
      this.updateSelectionUi();
      this.updateControlState();
      this.setStatus(`Unselected videos ${normalizedStart}-${normalizedEnd}.`, "success");
    }

    startObservers() {
      this.routeTimer = window.setInterval(() => {
        const nextSecUserId = getSecUserIdFromUrl();
        if (nextSecUserId === this.currentSecUserId) return;
        this.currentSecUserId = nextSecUserId;
        this.resetState();
        this.ensureTriggerButton();
        this.syncQueueStatus();
      }, CONFIG.ROUTE_CHECK_MS);

      this.domObserver = new MutationObserver(() => {
        this.ensureTriggerButtonDebounced();
      });

      if (document.body) {
        this.domObserver.observe(document.body, {
          childList: true,
          subtree: true
        });
      }

      this.repairTimer = window.setInterval(() => {
        this.ensureTriggerButton();
      }, CONFIG.BUTTON_RETRY_MS);
    }

    onDocumentClick(event) {
      const trigger = document.getElementById(CONFIG.TRIGGER_ID);
      if (trigger && trigger.contains(event.target)) return;
      if (this.ui.modal.contains(event.target)) return;
      this.closeDownloadMenu();
      this.closeDonatePopup();
    }

    onKeyDown(event) {
      if (event.key === "Escape") {
        this.closeDownloadMenu();
        this.closeDonatePopup();
        if (this.modalOpen) {
          this.closeModal();
        }
      }
    }

    onRuntimeMessage(message) {
      if (message?.type !== "DOWNLOAD_QUEUE_UPDATE") return;
      this.applyQueueStatus(message.payload || {});
    }

    applyQueueStatus(payload) {
      const phase = payload.phase || "idle";
      const isRunning = Boolean(payload.running) && !["completed", "cancelled"].includes(phase);
      this.isDownloading = isRunning;

      if (phase === "queued") {
        this.setStatus(payload.message || `Queue ready: ${payload.total} items.`, "info", true);
      } else if (phase === "downloading") {
        this.setStatus(payload.message || `Downloading ${payload.currentIndex + 1}/${payload.total}...`, "info", true);
      } else if (phase === "item-complete") {
        this.setStatus(
          `Downloaded ${payload.successCount}/${payload.total}. Failed: ${payload.failedCount}.`,
          "success",
          true
        );
      } else if (phase === "item-failed") {
        this.setStatus(
          `Download failed on ${payload.currentIndex}/${payload.total}. Failed: ${payload.failedCount}.`,
          "error",
          true
        );
      } else if (phase === "cancelling") {
        this.setStatus(payload.message || "Cancelling download queue...", "info", true);
      } else if (phase === "cancelled") {
        this.setStatus(
          `Queue cancelled. Success: ${payload.successCount}, failed: ${payload.failedCount}.`,
          payload.failedCount ? "error" : "info"
        );
      } else if (phase === "completed") {
        this.setStatus(
          `Queue complete. Success: ${payload.successCount}, failed: ${payload.failedCount}.`,
          payload.failedCount ? "error" : "success"
        );
      }

      this.updateControlState();
    }

    createTriggerButton() {
      const button = createElement("button", {
        id: CONFIG.TRIGGER_ID,
        type: "button",
        title: "Open Douyin Downloader",
        "aria-label": "Open Douyin Downloader",
        html: `
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 4v11" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            <path d="m7 11 5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M5 19h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
          </svg>
        `
      });

      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.openModal();
      });

      return button;
    }

    ensureTriggerButton() {
      if (!/\/user\/[^/?#]+/.test(window.location.pathname)) return;

      const anchor = findProfileTabAnchor();
      if (!anchor || !anchor.parentElement || !anchor.isConnected) return;

      const existing = document.getElementById(CONFIG.TRIGGER_ID);
      if (existing && existing.parentElement === anchor.parentElement && existing.previousElementSibling === anchor) {
        return;
      }

      if (existing) existing.remove();
      anchor.insertAdjacentElement("afterend", this.createTriggerButton());
    }

    openModal() {
      this.ui.backdrop.hidden = false;
      this.ui.modal.hidden = false;
      this.modalOpen = true;
      this.updateControlState();
    }

    closeModal() {
      this.ui.backdrop.hidden = true;
      this.ui.modal.hidden = true;
      this.modalOpen = false;
      this.closeDownloadMenu();
      this.closeDonatePopup();
    }

    closeDownloadMenu() {
      this.ui.downloadMenu.hidden = true;
    }

    toggleDownloadMenu() {
      if (this.ui.downloadButton.disabled) return;
      this.ui.downloadMenu.hidden = !this.ui.downloadMenu.hidden;
    }

    closeDonatePopup() {
      this.ui.donatePopup.hidden = true;
    }

    toggleDonatePopup() {
      this.ui.donatePopup.hidden = !this.ui.donatePopup.hidden;
    }

    setStatus(message, kind = "info", busy = false) {
      this.ui.status.textContent = message;
      this.ui.status.dataset.kind = kind;
      this.ui.status.dataset.busy = String(Boolean(busy));
    }

    getFilteredVideos() {
      const search = this.filters.search;
      const fromTime = this.filters.dateFrom ? new Date(`${this.filters.dateFrom}T00:00:00`).getTime() : null;
      const toTime = this.filters.dateTo ? new Date(`${this.filters.dateTo}T23:59:59`).getTime() : null;

      return this.videos.filter((video) => {
        const haystack = `${video.title} ${video.caption || ""} ${video.desc}`.toLowerCase();
        if (search && !haystack.includes(search)) {
          return false;
        }

        if (fromTime !== null || toTime !== null) {
          const time = new Date(video.createTime).getTime();
          if (Number.isNaN(time)) return false;
          if (fromTime !== null && time < fromTime) return false;
          if (toTime !== null && time > toTime) return false;
        }

        return true;
      });
    }

    syncSelectionWithFilters() {
      const visibleIds = new Set(this.getFilteredVideos().map((video) => video.id));
      this.selectedIds = new Set(Array.from(this.selectedIds).filter((id) => visibleIds.has(id)));
    }

    updateSelectionUi() {
      const filteredVideos = this.getFilteredVideos();
      const filteredIds = new Set(filteredVideos.map((video) => video.id));
      const total = filteredVideos.length;
      const selected = this.selectedIds.size;
      const selectedVisibleCount = Array.from(this.selectedIds).filter((id) => filteredIds.has(id)).length;
      this.ui.selectedCount.textContent = String(selected);
      this.ui.totalCount.textContent = String(total);
      this.ui.selectAll.checked = total > 0 && selectedVisibleCount === total;
      this.ui.selectAll.indeterminate = selectedVisibleCount > 0 && selectedVisibleCount < total;
    }

    updateControlState() {
      const hasSelection = this.selectedIds.size > 0;
      this.ui.fetchButton.disabled = this.isFetching || this.isDownloading;
      this.ui.selectAll.disabled = this.isFetching || this.isDownloading;
      this.ui.downloadButton.disabled = this.isFetching || this.isDownloading || !hasSelection;
      this.ui.cancelButton.disabled = !this.isDownloading;
      this.ui.searchInput.disabled = this.isFetching || this.isDownloading;
      this.ui.dateFromInput.disabled = this.isFetching || this.isDownloading;
      this.ui.dateToInput.disabled = this.isFetching || this.isDownloading;
      this.ui.resetFiltersButton.disabled = this.isFetching || this.isDownloading;
      this.ui.rangeStartInput.disabled = this.isFetching || this.isDownloading;
      this.ui.rangeEndInput.disabled = this.isFetching || this.isDownloading;
      this.ui.applyRangeButton.disabled = this.isFetching || this.isDownloading;
      this.ui.clearRangeButton.disabled = this.isFetching || this.isDownloading;
      this.ui.folderInput.disabled = this.isDownloading;
      this.ui.delayInput.disabled = this.isDownloading;
    }

    renderTable() {
      const filteredVideos = this.getFilteredVideos();

      if (!this.videos.length) {
        this.ui.tableBody.innerHTML = `
          <tr class="dyex-empty-row">
            <td colspan="6">No videos loaded yet.</td>
          </tr>
        `;
        return;
      }

      if (!filteredVideos.length) {
        this.ui.tableBody.innerHTML = `
          <tr class="dyex-empty-row">
            <td colspan="6">No videos match the current filters.</td>
          </tr>
        `;
        return;
      }

      const html = filteredVideos
        .map((video, index) => {
          const cover = video.dynamicCoverUrl || video.coverUrl;
          const caption = video.caption || video.desc || "";
          const hasSeparateCaption = caption && caption !== video.title;
          const audioLink = video.audioUrl
            ? `<span>|</span><a href="${escapeHtml(video.audioUrl)}" target="_blank" rel="noopener noreferrer">Audio</a>`
            : "";

          return `
            <tr>
              <td>
                <input class="dyex-row-check" type="checkbox" data-video-id="${escapeHtml(video.id)}" ${
                  this.selectedIds.has(video.id) ? "checked" : ""
                }>
              </td>
              <td>${index + 1}</td>
              <td>
                <div class="dyex-cover">
                  ${cover ? `<img src="${escapeHtml(cover)}" alt="${escapeHtml(video.title)}" loading="lazy">` : ""}
                </div>
              </td>
              <td>
                <div class="dyex-title-wrap">
                  <div class="dyex-title" title="${escapeHtml(video.title)}">${escapeHtml(video.title)}</div>
                  ${
                    hasSeparateCaption
                      ? `<div class="dyex-caption" title="${escapeHtml(caption)}">${escapeHtml(caption)}</div>`
                      : ""
                  }
                </div>
              </td>
              <td class="dyex-date">${escapeHtml(formatDisplayDate(video.createTime))}</td>
              <td>
                <div class="dyex-actions">
                  <a href="${escapeHtml(video.videoUrl)}" target="_blank" rel="noopener noreferrer">Video</a>
                  ${audioLink}
                </div>
              </td>
            </tr>
          `;
        })
        .join("");

      this.ui.tableBody.innerHTML = html;
    }

    sortVideos() {
      this.videos.sort((left, right) => {
        const leftTime = new Date(left.createTime).getTime() || 0;
        const rightTime = new Date(right.createTime).getTime() || 0;
        return rightTime - leftTime;
      });
    }

    resetState() {
      this.videos = [];
      this.videoMap.clear();
      this.selectedIds.clear();
      this.filters.search = "";
      this.filters.dateFrom = "";
      this.filters.dateTo = "";
      this.range.start = "";
      this.range.end = "";
      this.isFetching = false;
      this.isDownloading = false;
      this.ui.searchInput.value = "";
      this.ui.dateFromInput.value = "";
      this.ui.dateToInput.value = "";
      this.ui.rangeStartInput.value = "";
      this.ui.rangeEndInput.value = "";
      this.renderTable();
      this.updateSelectionUi();
      this.updateControlState();
      this.closeDownloadMenu();
      this.setStatus("Ready.");
    }

    async syncQueueStatus() {
      try {
        const response = await sendRuntimeMessage({ type: "GET_QUEUE_STATUS" });
        if (!response?.ok || !response.queue) {
          this.isDownloading = false;
          this.updateControlState();
          return;
        }

        this.applyQueueStatus({
          phase: response.queue.status,
          running: response.queue.running,
          currentIndex: response.queue.currentIndex,
          total: response.queue.total,
          successCount: response.queue.successCount,
          failedCount: response.queue.failedCount,
          errors: response.queue.errors
        });
      } catch (error) {
        console.error("Failed to sync queue status:", error);
      }
    }

    async handleFetchVideos() {
      if (this.isFetching || this.isDownloading) return;

      const secUserId = getSecUserIdFromUrl();
      if (!secUserId) {
        this.setStatus("Could not find sec_user_id in the current URL.", "error");
        return;
      }

      this.currentSecUserId = secUserId;
      this.isFetching = true;
      this.videos = [];
      this.videoMap.clear();
      this.selectedIds.clear();
      this.renderTable();
      this.updateSelectionUi();
      this.updateControlState();
      this.closeDownloadMenu();
      this.setStatus("Fetching videos...", "info", true);

      try {
        const apiClient = new DouyinApiClient(secUserId);
        await this.fetchAllVideos(apiClient);
        this.sortVideos();
        this.renderTable();
        this.updateSelectionUi();
        this.setStatus(`Fetch complete: ${this.videos.length} videos loaded.`, "success");
      } catch (error) {
        console.error("Fetch failed:", error);
        this.setStatus(error.message || "Failed to fetch videos.", "error");
      } finally {
        this.isFetching = false;
        this.updateControlState();
      }
    }

    async fetchAllVideos(apiClient) {
      let maxCursor = 0;
      let hasMore = true;
      const seenIds = new Set();
      const seenCursors = new Set();

      while (hasMore) {
        if (seenCursors.has(maxCursor)) break;
        seenCursors.add(maxCursor);

        const payload = await retryWithDelay(() => apiClient.fetchVideos(maxCursor));
        const { videos, hasMore: nextHasMore, maxCursor: nextCursor } = VideoDataProcessor.processPayload(payload, seenIds);

        for (const video of videos) {
          if (this.videoMap.has(video.id)) continue;
          this.videoMap.set(video.id, video);
          this.videos.push(video);
        }

        this.sortVideos();
        this.renderTable();
        this.updateSelectionUi();
        this.setStatus(`Fetching... ${this.videos.length} videos loaded`, "info", true);

        hasMore = nextHasMore;
        maxCursor = nextCursor;

        if (hasMore) {
          await sleep(CONFIG.REQUEST_DELAY_MS);
        }
      }
    }

    getSelectedVideos() {
      return this.videos.filter((video) => this.selectedIds.has(video.id));
    }

    getDownloadFilename(video, kind) {
      const date = formatFileDate(video.createTime);
      const baseFolder = sanitizeFolderPath(this.settings.downloadFolder);
      const typeFolder = kind === "video" ? "videos" : "audios";
      const prefix = baseFolder ? `${baseFolder}/${typeFolder}` : typeFolder;
      const filePrefix = sanitizeFileComponent((baseFolder || "douyin_downloads").replace(/\//g, "_"), "douyin_downloads");
      const titleSource = video.caption || video.title || video.desc || video.id;
      const titlePart = sanitizeFileComponent(titleSource, `video_${video.id}`);
      if (kind === "video") {
        return `${prefix}/${filePrefix}_${titlePart}_${date}_${video.id}.mp4`;
      }
      return `${prefix}/${filePrefix}_${titlePart}_${date}_${video.id}.mp3`;
    }

    buildCsvContent(videos) {
      const header = ["id", "title", "caption", "desc", "createTime", "videoUrl", "audioUrl", "coverUrl", "dynamicCoverUrl"];
      const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
      const rows = videos.map((video) =>
        [
          video.id,
          video.title,
          video.caption || "",
          video.desc,
          video.createTime,
          video.videoUrl,
          video.audioUrl,
          video.coverUrl,
          video.dynamicCoverUrl
        ]
          .map(escapeCsv)
          .join(",")
      );

      return [header.join(","), ...rows].join("\n");
    }

    async handleDownloadAction(action) {
      if (!action || this.isFetching || this.isDownloading) return;

      const selectedVideos = this.getSelectedVideos();
      if (!selectedVideos.length) {
        this.closeDownloadMenu();
        return;
      }

      this.closeDownloadMenu();

      if (action === "json") {
        await this.exportMetadata(selectedVideos);
        return;
      }

      if (action === "txt") {
        await this.exportLinks(selectedVideos);
        return;
      }

      if (action === "csv") {
        await this.exportCsv(selectedVideos);
        return;
      }

      await this.startMediaQueue(selectedVideos, action);
    }

    async startMediaQueue(selectedVideos, kind) {
      const items = selectedVideos
        .map((video) => {
          const url = kind === "video" ? video.videoUrl : video.audioUrl;
          if (!url) return null;
          return {
            id: video.id,
            url,
            filename: this.getDownloadFilename(video, kind)
          };
        })
        .filter(Boolean);

      if (!items.length) {
        this.setStatus(`No ${kind} URLs available for the selected videos.`, "error");
        return;
      }

      this.isDownloading = true;
      this.updateControlState();
      this.setStatus(`Preparing ${kind} queue...`, "info", true);

      try {
        const response = await sendRuntimeMessage({
          type: "START_DOWNLOAD_QUEUE",
          payload: {
            kind,
            delayMs: this.settings.queueDelayMs,
            items
          }
        });

        if (!response?.ok) {
          throw new Error(response?.error || "Failed to start download queue.");
        }
      } catch (error) {
        this.isDownloading = false;
        this.updateControlState();
        this.setStatus(error.message || "Failed to start download queue.", "error");
      }
    }

    async exportMetadata(selectedVideos) {
      const exportPrefix = sanitizeFileComponent((sanitizeFolderPath(this.settings.downloadFolder) || "douyin_downloads").replace(/\//g, "_"), "douyin_downloads");
      try {
        const response = await sendRuntimeMessage({
          type: "DOWNLOAD_TEXT_FILE",
          payload: {
            filename: `${exportPrefix}-video-data-${timestampForFile()}.json`,
            mimeType: "application/json;charset=utf-8",
            content: JSON.stringify(selectedVideos, null, 2)
          }
        });

        if (!response?.ok) {
          throw new Error(response?.error || "Metadata export failed.");
        }

        this.setStatus(`Metadata exported for ${selectedVideos.length} videos.`, "success");
      } catch (error) {
        this.setStatus(error.message || "Metadata export failed.", "error");
      }
    }

    async exportLinks(selectedVideos) {
      const links = selectedVideos.map((video) => video.videoUrl).filter(Boolean).join("\n");
      const exportPrefix = sanitizeFileComponent((sanitizeFolderPath(this.settings.downloadFolder) || "douyin_downloads").replace(/\//g, "_"), "douyin_downloads");

      try {
        const response = await sendRuntimeMessage({
          type: "DOWNLOAD_TEXT_FILE",
          payload: {
            filename: `${exportPrefix}-video-links-${timestampForFile()}.txt`,
            mimeType: "text/plain;charset=utf-8",
            content: links
          }
        });

        if (!response?.ok) {
          throw new Error(response?.error || "Link export failed.");
        }

        this.setStatus(`Video links exported for ${selectedVideos.length} videos.`, "success");
      } catch (error) {
        this.setStatus(error.message || "Link export failed.", "error");
      }
    }

    async exportCsv(selectedVideos) {
      const exportPrefix = sanitizeFileComponent((sanitizeFolderPath(this.settings.downloadFolder) || "douyin_downloads").replace(/\//g, "_"), "douyin_downloads");
      try {
        const response = await sendRuntimeMessage({
          type: "DOWNLOAD_TEXT_FILE",
          payload: {
            filename: `${exportPrefix}-video-data-${timestampForFile()}.csv`,
            mimeType: "text/csv;charset=utf-8",
            content: this.buildCsvContent(selectedVideos)
          }
        });

        if (!response?.ok) {
          throw new Error(response?.error || "CSV export failed.");
        }

        this.setStatus(`CSV exported for ${selectedVideos.length} videos.`, "success");
      } catch (error) {
        this.setStatus(error.message || "CSV export failed.", "error");
      }
    }

    async handleCancelQueue() {
      if (!this.isDownloading) return;

      try {
        const response = await sendRuntimeMessage({ type: "CANCEL_DOWNLOAD_QUEUE" });
        if (!response?.ok) {
          throw new Error(response?.error || "Failed to cancel queue.");
        }
      } catch (error) {
        this.setStatus(error.message || "Failed to cancel queue.", "error");
      }
    }
  }

  async function bootstrap() {
    try {
      const app = new DouyinDownloaderExtension();
      await app.init();
      window.douyinDownloaderExtension = app;
    } catch (error) {
      console.error("Douyin downloader extension failed to initialize:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
