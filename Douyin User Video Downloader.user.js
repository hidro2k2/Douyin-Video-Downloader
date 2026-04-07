// ==UserScript==
// @name         Douyin User Video Downloader
// @namespace    https://github.com/CaoCuong2404
// @version      2.0.0
// @description  Fetch, preview, and download videos from Douyin user profiles
// @author       Codex
// @match        https://www.douyin.com/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  "use strict";

  // CONFIG
  const CONFIG = {
    API_BASE_URL: "https://www.douyin.com/aweme/v1/web/aweme/post/",
    MODAL_ID: "dyud-modal",
    BACKDROP_ID: "dyud-backdrop",
    TRIGGER_ID: "dyud-trigger",
    STYLE_ID: "dyud-style",
    TABLE_BODY_ID: "dyud-table-body",
    STATUS_ID: "dyud-status",
    SELECT_ALL_ID: "dyud-select-all",
    SELECTED_COUNT_ID: "dyud-selected-count",
    TOTAL_COUNT_ID: "dyud-total-count",
    FETCH_BUTTON_ID: "dyud-fetch-button",
    DOWNLOAD_BUTTON_ID: "dyud-download-button",
    DOWNLOAD_MENU_ID: "dyud-download-menu",
    COUNT: 20,
    MAX_RETRIES: 4,
    RETRY_DELAY_MS: 1600,
    REQUEST_DELAY_MS: 900,
    DOWNLOAD_DELAY_MS: 450,
    WAIT_TIMEOUT_MS: 30000,
    WAIT_INTERVAL_MS: 150,
    ROUTE_CHECK_MS: 1000,
    BUTTON_RETRY_MS: 1200,
    BUTTON_TEXT_CANDIDATES: [/\u4f5c\u54c1/, /\u89c6\u9891/, /Videos?/i, /Posts?/i],
    ANCHOR_SELECTORS: [
      '[data-e2e="user-tab-count"]',
      '[data-e2e*="user-tab"] [data-e2e="user-tab-count"]',
      '[role="tab"]',
    ],
    REQUEST_QUERY: {
      device_platform: "webapp",
      aid: "6383",
      channel: "channel_pc_web",
      count: "20",
      version_code: "170400",
      version_name: "17.4.0",
    },
  };

  // utility functions
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

  function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }

  function timestampForFile() {
    return new Date().toISOString().replace(/[:.]/g, "-");
  }

  function fileDate(dateString) {
    if (!dateString) return "unknown-date";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "unknown-date";
    return date.toISOString().slice(0, 10);
  }

  function downloadBlob(blob, filename) {
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
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

  function findProfileTabAnchor() {
    for (const selector of CONFIG.ANCHOR_SELECTORS) {
      const candidates = Array.from(document.querySelectorAll(selector));
      const matched = candidates.find((element) => {
        const text = (element.textContent || "").replace(/\s+/g, " ").trim();
        return CONFIG.BUTTON_TEXT_CANDIDATES.some((pattern) => pattern.test(text)) || /\d+/.test(text);
      });

      if (matched) {
        return matched;
      }
    }

    const fallbackCandidates = Array.from(document.querySelectorAll("div, span, button, a"));
    return fallbackCandidates.find((element) => {
      const text = (element.textContent || "").replace(/\s+/g, " ").trim();
      if (!text || text.length > 24) return false;
      return CONFIG.BUTTON_TEXT_CANDIDATES.some((pattern) => pattern.test(text)) && /\d+/.test(text);
    }) || null;
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

  // DouyinApiClient
  class DouyinApiClient {
    constructor(secUserId) {
      this.secUserId = secUserId;
    }

    async fetchVideos(maxCursor = 0) {
      const url = new URL(CONFIG.API_BASE_URL);
      const query = {
        ...CONFIG.REQUEST_QUERY,
        sec_user_id: this.secUserId,
        max_cursor: String(maxCursor),
      };

      Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));

      const response = await fetch(url.toString(), {
        method: "GET",
        credentials: "include",
        referrer: window.location.href,
        headers: {
          Accept: "application/json, text/plain, */*",
        },
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

  // VideoDataProcessor
  class VideoDataProcessor {
    static extractVideoMetadata(item) {
      if (!item || !item.aweme_id) return null;

      const title = item.title || item.desc || "Untitled";
      const videoUrl = toHttps(
        item.video?.play_addr?.url_list?.[0] || item.video?.download_addr?.url_list?.[0] || "",
      );
      const audioUrl = toHttps(item.music?.play_url?.url_list?.[0] || "");
      const coverUrl = toHttps(item.video?.cover?.url_list?.[0] || item.cover?.url_list?.[0] || "");
      const dynamicCoverUrl = toHttps(
        item.video?.dynamic_cover?.url_list?.[0] || item.dynamic_cover?.url_list?.[0] || "",
      );
      const createTime = item.create_time ? new Date(item.create_time * 1000).toISOString() : "";

      if (!videoUrl) return null;

      return {
        id: String(item.aweme_id),
        desc: item.desc || "",
        title,
        createTime,
        videoUrl,
        audioUrl,
        coverUrl,
        dynamicCoverUrl,
      };
    }

    static processVideoData(payload, existingIds = new Set()) {
      const sourceList = Array.isArray(payload?.aweme_list) ? payload.aweme_list : [];
      const videos = [];

      for (const item of sourceList) {
        const metadata = this.extractVideoMetadata(item);
        if (!metadata || existingIds.has(metadata.id)) continue;
        existingIds.add(metadata.id);
        videos.push(metadata);
      }

      return {
        videos,
        hasMore: Boolean(payload?.has_more),
        maxCursor: Number(payload?.max_cursor || 0),
      };
    }
  }

  // FileHandler
  class FileHandler {
    static async fetchAsBlob(url) {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} while downloading media`);
      }

      return response.blob();
    }

    static async downloadMedia(video, type) {
      const isVideo = type === "video";
      const url = isVideo ? video.videoUrl : video.audioUrl;
      if (!url) {
        throw new Error(`Missing ${type} URL for ${video.id}`);
      }

      const extension = isVideo ? "mp4" : "mp3";
      const filename = `douyin_${type}_${fileDate(video.createTime)}_${video.id}.${extension}`;
      const blob = await retryWithDelay(() => this.fetchAsBlob(url), 3, 1200);
      downloadBlob(blob, filename);
      return filename;
    }

    static downloadMetadata(videos) {
      const blob = new Blob([JSON.stringify(videos, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      downloadBlob(blob, `douyin-video-data-${timestampForFile()}.json`);
    }

    static downloadLinks(videos) {
      const content = videos.map((video) => video.videoUrl).filter(Boolean).join("\n");
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      downloadBlob(blob, `douyin-video-links-${timestampForFile()}.txt`);
    }
  }

  // UI functions
  function getModalMarkup() {
    return `
      <div id="${CONFIG.BACKDROP_ID}" class="dyud-backdrop" hidden></div>
      <section id="${CONFIG.MODAL_ID}" class="dyud-modal" hidden aria-modal="true" role="dialog" aria-labelledby="dyud-modal-title">
        <div class="dyud-shell">
          <header class="dyud-header">
            <div class="dyud-brand">
              <span class="dyud-brand-icon" aria-hidden="true">
                <svg viewBox="0 0 64 64" fill="none">
                  <rect width="64" height="64" rx="16" fill="#10121B"></rect>
                  <path d="M34.5 11.5v25.3a10.8 10.8 0 1 1-8.3-10.5v7a4.3 4.3 0 1 0 2.9 4.1V16.9c5.6 5 11.7 7.2 18.7 7.2v-7.4c-4.5-.2-8.7-1.6-13.3-5.2Z" fill="#25F4EE"></path>
                  <path d="M37.9 8v25.4a10.8 10.8 0 1 1-8.4-10.5v7a4.3 4.3 0 1 0 3 4.1V13.3c5.5 5 11.7 7.2 18.7 7.2v-7.4c-4.5-.2-8.8-1.6-13.3-5.1Z" fill="#FE2C55"></path>
                  <path d="M36.1 9.7v25.4a10.8 10.8 0 1 1-8.4-10.5v7a4.3 4.3 0 1 0 3 4.1V15c5.5 5 11.6 7.2 18.7 7.2v-7.4c-4.6-.2-8.8-1.6-13.3-5.1Z" fill="#fff"></path>
                </svg>
              </span>
              <div>
                <h2 id="dyud-modal-title">Douyin Downloader</h2>
              </div>
            </div>
            <button type="button" class="dyud-icon-button" data-action="close-modal" aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
              </svg>
            </button>
          </header>

          <div class="dyud-body">
            <div id="${CONFIG.STATUS_ID}" class="dyud-status">Ready.</div>

            <div class="dyud-panel">
              <div class="dyud-toolbar">
                <div class="dyud-toolbar-left">
                  <label class="dyud-select-all">
                    <input id="${CONFIG.SELECT_ALL_ID}" type="checkbox">
                    <span>Select All (<span id="${CONFIG.SELECTED_COUNT_ID}">0</span>/<span id="${CONFIG.TOTAL_COUNT_ID}">0</span>)</span>
                  </label>

                  <div class="dyud-toolbar-divider" aria-hidden="true"></div>

                  <div class="dyud-dropdown">
                    <button id="${CONFIG.DOWNLOAD_BUTTON_ID}" type="button" class="dyud-button dyud-button-primary" disabled>
                      <span>Download</span>
                      <svg viewBox="0 0 20 20" fill="none">
                        <path d="m5 7 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                    </button>
                    <div id="${CONFIG.DOWNLOAD_MENU_ID}" class="dyud-dropdown-menu" hidden>
                      <button type="button" data-download-action="audio">Download Audios (MP3)</button>
                      <button type="button" data-download-action="video">Download Videos (MP4)</button>
                      <button type="button" data-download-action="json">Download Metadata (JSON)</button>
                      <button type="button" data-download-action="txt">Download Links (TXT)</button>
                    </div>
                  </div>
                </div>

                <button id="${CONFIG.FETCH_BUTTON_ID}" type="button" class="dyud-button dyud-button-primary">
                  <span>Fetch Videos</span>
                </button>
              </div>

              <div class="dyud-table-wrap">
                <table class="dyud-table">
                  <thead>
                    <tr>
                      <th class="dyud-col-select">Select</th>
                      <th class="dyud-col-index">No.</th>
                      <th class="dyud-col-cover">Cover</th>
                      <th>Title</th>
                      <th class="dyud-col-date">Date</th>
                      <th class="dyud-col-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody id="${CONFIG.TABLE_BODY_ID}">
                    <tr class="dyud-empty-row">
                      <td colspan="6">No videos loaded yet.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function injectStyles() {
    if (document.getElementById(CONFIG.STYLE_ID)) return;

    const style = createElement("style", { id: CONFIG.STYLE_ID });
    style.textContent = `
      #${CONFIG.BACKDROP_ID} {
        position: fixed;
        inset: 0;
        z-index: 999998;
      }

      .dyud-backdrop {
        background: rgba(10, 10, 18, 0.62);
        backdrop-filter: blur(6px);
        animation: dyud-fade-in 0.18s ease-out;
      }

      #${CONFIG.MODAL_ID} {
        position: fixed;
        inset: 50% auto auto 50%;
        transform: translate(-50%, -50%);
        z-index: 999999;
        width: min(1120px, calc(100vw - 40px));
        max-height: calc(100vh - 48px);
        animation: dyud-modal-in 0.2s ease-out;
      }

      .dyud-shell {
        display: flex;
        flex-direction: column;
        min-height: 620px;
        max-height: calc(100vh - 48px);
        border: 1px solid rgba(219, 223, 232, 0.8);
        border-radius: 18px;
        overflow: hidden;
        background: linear-gradient(180deg, #ffffff 0%, #fbfbfd 100%);
        box-shadow: 0 28px 90px rgba(15, 20, 36, 0.32);
        color: #273042;
        font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
      }

      .dyud-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 22px 28px;
        border-bottom: 1px solid #eaedf3;
        background: rgba(255, 255, 255, 0.96);
      }

      .dyud-brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .dyud-brand-icon {
        width: 34px;
        height: 34px;
        flex: 0 0 34px;
      }

      .dyud-brand-icon svg {
        width: 100%;
        height: 100%;
        display: block;
      }

      .dyud-brand h2 {
        margin: 0;
        font-size: 19px;
        line-height: 1.2;
        font-weight: 700;
        color: #1b2434;
      }

      .dyud-icon-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border: 0;
        border-radius: 12px;
        background: transparent;
        color: #9aa4b2;
        cursor: pointer;
        transition: background-color 0.16s ease, color 0.16s ease;
      }

      .dyud-icon-button:hover {
        background: #f3f6fb;
        color: #495567;
      }

      .dyud-icon-button svg {
        width: 22px;
        height: 22px;
      }

      .dyud-body {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 20px 22px 22px;
        min-height: 0;
      }

      .dyud-status {
        min-height: 28px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        color: #617085;
      }

      .dyud-status[data-kind="error"] {
        color: #d8425c;
      }

      .dyud-status[data-kind="success"] {
        color: #1f8b5b;
      }

      .dyud-status[data-busy="true"]::before {
        content: "";
        width: 15px;
        height: 15px;
        border-radius: 999px;
        border: 2px solid rgba(254, 44, 85, 0.22);
        border-top-color: #fe2c55;
        animation: dyud-spin 0.85s linear infinite;
      }

      .dyud-panel {
        display: flex;
        flex-direction: column;
        min-height: 0;
        border: 1px solid #e6ebf2;
        border-radius: 14px;
        background: #ffffff;
        overflow: hidden;
      }

      .dyud-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 20px;
        border-bottom: 1px solid #edf1f6;
        background: linear-gradient(180deg, #fbfcff 0%, #f6f8fc 100%);
      }

      .dyud-toolbar-left {
        display: flex;
        align-items: center;
        gap: 18px;
        min-width: 0;
      }

      .dyud-select-all {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        color: #344054;
        cursor: pointer;
        user-select: none;
      }

      .dyud-select-all input,
      .dyud-row-check {
        width: 16px;
        height: 16px;
        accent-color: #b455ff;
        cursor: pointer;
      }

      .dyud-toolbar-divider {
        width: 1px;
        height: 18px;
        background: #d9dfeb;
      }

      .dyud-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 42px;
        padding: 0 18px;
        border: 0;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.12s ease, opacity 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease;
      }

      .dyud-button:hover:not(:disabled) {
        transform: translateY(-1px);
      }

      .dyud-button:disabled {
        opacity: 0.58;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      .dyud-button-primary {
        color: #fff;
        background: linear-gradient(135deg, #ff2d66 0%, #ff3c54 100%);
        box-shadow: 0 12px 26px rgba(254, 44, 85, 0.22);
      }

      .dyud-dropdown {
        position: relative;
      }

      .dyud-dropdown-menu {
        position: absolute;
        top: calc(100% + 10px);
        left: 0;
        min-width: 220px;
        padding: 8px;
        border: 1px solid rgba(224, 230, 239, 0.92);
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 18px 38px rgba(28, 40, 61, 0.16);
        backdrop-filter: blur(12px);
      }

      .dyud-dropdown-menu button {
        display: block;
        width: 100%;
        margin: 0;
        padding: 11px 12px;
        border: 0;
        border-radius: 10px;
        background: transparent;
        color: #2f3948;
        font-size: 14px;
        text-align: left;
        cursor: pointer;
      }

      .dyud-dropdown-menu button:hover {
        background: #f5f7fb;
      }

      .dyud-table-wrap {
        min-height: 0;
        overflow: auto;
      }

      .dyud-table {
        width: 100%;
        border-collapse: collapse;
      }

      .dyud-table thead th {
        position: sticky;
        top: 0;
        z-index: 1;
        background: #fafbfe;
        padding: 16px 18px;
        border-bottom: 1px solid #eef2f7;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #7f8a9b;
        text-align: left;
      }

      .dyud-table tbody td {
        padding: 18px;
        border-bottom: 1px solid #eef2f7;
        vertical-align: middle;
        font-size: 14px;
        color: #2d3645;
      }

      .dyud-table tbody tr:hover {
        background: #fcfdff;
      }

      .dyud-col-select {
        width: 76px;
      }

      .dyud-col-index {
        width: 84px;
      }

      .dyud-col-cover {
        width: 110px;
      }

      .dyud-col-date {
        width: 160px;
      }

      .dyud-col-actions {
        width: 170px;
      }

      .dyud-cover {
        width: 62px;
        height: 62px;
        border-radius: 14px;
        overflow: hidden;
        background: linear-gradient(135deg, #eef2f6 0%, #dce3ed 100%);
      }

      .dyud-cover img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
      }

      .dyud-title {
        max-width: 420px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 600;
        color: #253041;
      }

      .dyud-date {
        color: #687588;
      }

      .dyud-actions {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        white-space: nowrap;
      }

      .dyud-actions a {
        color: #ff2d66;
        text-decoration: none;
        font-weight: 600;
      }

      .dyud-actions a:hover {
        text-decoration: underline;
      }

      .dyud-empty-row td {
        padding: 32px 18px;
        text-align: center;
        color: #7b8799;
      }

      #${CONFIG.TRIGGER_ID} {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        margin-left: 8px;
        padding: 0;
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: #fe2c55;
        cursor: pointer;
        transition: transform 0.14s ease, background-color 0.14s ease, color 0.14s ease;
        vertical-align: middle;
      }

      #${CONFIG.TRIGGER_ID}:hover {
        transform: translateY(-1px);
        background: rgba(254, 44, 85, 0.1);
      }

      #${CONFIG.TRIGGER_ID} svg {
        width: 18px;
        height: 18px;
      }

      @keyframes dyud-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes dyud-modal-in {
        from {
          opacity: 0;
          transform: translate(-50%, calc(-50% + 8px)) scale(0.985);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }

      @keyframes dyud-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @media (max-width: 900px) {
        #${CONFIG.MODAL_ID} {
          width: calc(100vw - 20px);
          max-height: calc(100vh - 20px);
        }

        .dyud-shell {
          min-height: auto;
        }

        .dyud-toolbar {
          flex-direction: column;
          align-items: stretch;
        }

        .dyud-toolbar-left {
          flex-wrap: wrap;
        }

        .dyud-title {
          max-width: 220px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // DouyinDownloader
  class DouyinDownloader {
    constructor() {
      this.videos = [];
      this.videoMap = new Map();
      this.selectedVideoIds = new Set();
      this.isFetching = false;
      this.isDownloading = false;
      this.modalOpen = false;
      this.currentSecUserId = getSecUserIdFromUrl();
      this.ui = {};
      this.boundHandleDocumentClick = this.handleDocumentClick.bind(this);
      this.boundHandleKeydown = this.handleKeydown.bind(this);
      this.ensureTriggerButtonDebounced = debounce(() => this.ensureTriggerButton(), 180);
    }

    async init() {
      injectStyles();
      this.mountUI();
      this.cacheUi();
      this.bindUiEvents();

      await waitForElement("body").catch(() => null);
      this.ensureTriggerButton();
      this.startObservers();
    }

    mountUI() {
      if (document.getElementById(CONFIG.MODAL_ID) && document.getElementById(CONFIG.BACKDROP_ID)) return;

      const wrapper = createElement("div", { id: "dyud-root", html: getModalMarkup() });
      document.body.appendChild(wrapper);
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
      this.ui.selectedCount = document.getElementById(CONFIG.SELECTED_COUNT_ID);
      this.ui.totalCount = document.getElementById(CONFIG.TOTAL_COUNT_ID);
    }

    bindUiEvents() {
      if (this.ui.fetchButton.dataset.bound === "true") return;

      this.ui.fetchButton.dataset.bound = "true";
      this.ui.fetchButton.addEventListener("click", () => this.handleFetchVideos());

      this.ui.selectAll.addEventListener("change", (event) => {
        const checked = Boolean(event.target.checked);
        if (checked) {
          this.selectedVideoIds = new Set(this.videos.map((video) => video.id));
        } else {
          this.selectedVideoIds.clear();
        }
        this.renderTable();
        this.updateSelectionUi();
      });

      this.ui.tableBody.addEventListener("change", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) return;
        if (!target.classList.contains("dyud-row-check")) return;

        const videoId = target.dataset.videoId;
        if (!videoId) return;

        if (target.checked) {
          this.selectedVideoIds.add(videoId);
        } else {
          this.selectedVideoIds.delete(videoId);
        }

        this.updateSelectionUi();
      });

      this.ui.modal.addEventListener("click", (event) => {
        const actionTarget = event.target.closest("[data-action='close-modal']");
        if (actionTarget) {
          this.closeModal();
          return;
        }

        const downloadButton = event.target.closest(`#${CONFIG.DOWNLOAD_BUTTON_ID}`);
        if (downloadButton) {
          this.toggleDownloadMenu();
          return;
        }

        const optionButton = event.target.closest("[data-download-action]");
        if (optionButton) {
          const action = optionButton.getAttribute("data-download-action");
          this.handleDownloadAction(action);
        }
      });

      this.ui.backdrop.addEventListener("click", () => this.closeModal());
      document.addEventListener("click", this.boundHandleDocumentClick);
      document.addEventListener("keydown", this.boundHandleKeydown);
    }

    startObservers() {
      if (!document.body) return;

      this.routeTimer = window.setInterval(() => {
        const nextSecUserId = getSecUserIdFromUrl();
        if (nextSecUserId === this.currentSecUserId) return;

        this.currentSecUserId = nextSecUserId;
        this.resetData();
        this.ensureTriggerButton();
      }, CONFIG.ROUTE_CHECK_MS);

      this.mutationObserver = new MutationObserver(() => {
        this.ensureTriggerButtonDebounced();
      });

      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      this.repairTimer = window.setInterval(() => {
        this.ensureTriggerButton();
      }, CONFIG.BUTTON_RETRY_MS);
    }

    handleDocumentClick(event) {
      const trigger = document.getElementById(CONFIG.TRIGGER_ID);
      if (trigger && trigger.contains(event.target)) return;
      if (this.ui.modal.contains(event.target)) return;
      this.closeDownloadMenu();
    }

    handleKeydown(event) {
      if (event.key === "Escape") {
        this.closeDownloadMenu();
        if (this.modalOpen) {
          this.closeModal();
        }
      }
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
        `,
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

      const button = this.createTriggerButton();
      anchor.insertAdjacentElement("afterend", button);
    }

    openModal() {
      this.ui.backdrop.hidden = false;
      this.ui.modal.hidden = false;
      this.modalOpen = true;
      this.ensureTriggerButton();
      this.updateSelectionUi();
    }

    closeModal() {
      this.ui.backdrop.hidden = true;
      this.ui.modal.hidden = true;
      this.modalOpen = false;
      this.closeDownloadMenu();
    }

    setStatus(message, kind = "info", busy = false) {
      this.ui.status.textContent = message;
      this.ui.status.dataset.kind = kind;
      this.ui.status.dataset.busy = String(Boolean(busy));
    }

    closeDownloadMenu() {
      this.ui.downloadMenu.hidden = true;
    }

    toggleDownloadMenu() {
      if (this.ui.downloadButton.disabled) return;
      this.ui.downloadMenu.hidden = !this.ui.downloadMenu.hidden;
    }

    resetData() {
      this.videos = [];
      this.videoMap.clear();
      this.selectedVideoIds.clear();
      this.isFetching = false;
      this.isDownloading = false;
      this.renderTable();
      this.updateSelectionUi();
      this.setStatus("Ready.");
      this.setBusyState(false);
    }

    setBusyState(busy) {
      const disabled = Boolean(busy);
      this.ui.fetchButton.disabled = disabled;
      this.ui.selectAll.disabled = disabled;
      this.ui.downloadButton.disabled = disabled || this.selectedVideoIds.size === 0;
    }

    updateSelectionUi() {
      const total = this.videos.length;
      const selected = this.selectedVideoIds.size;
      this.ui.selectedCount.textContent = String(selected);
      this.ui.totalCount.textContent = String(total);

      this.ui.selectAll.checked = total > 0 && selected === total;
      this.ui.selectAll.indeterminate = selected > 0 && selected < total;
      this.ui.downloadButton.disabled = this.isFetching || this.isDownloading || selected === 0;
    }

    renderTable() {
      if (!this.videos.length) {
        this.ui.tableBody.innerHTML = `
          <tr class="dyud-empty-row">
            <td colspan="6">No videos loaded yet.</td>
          </tr>
        `;
        return;
      }

      const rows = this.videos
        .map((video, index) => {
          const cover = video.dynamicCoverUrl || video.coverUrl;
          const audioLink = video.audioUrl
            ? `<span>|</span><a href="${escapeHtml(video.audioUrl)}" target="_blank" rel="noopener noreferrer">Audio</a>`
            : "";

          return `
            <tr data-row-id="${escapeHtml(video.id)}">
              <td>
                <input class="dyud-row-check" type="checkbox" data-video-id="${escapeHtml(video.id)}" ${
                  this.selectedVideoIds.has(video.id) ? "checked" : ""
                }>
              </td>
              <td>${index + 1}</td>
              <td>
                <div class="dyud-cover">
                  ${
                    cover
                      ? `<img src="${escapeHtml(cover)}" alt="${escapeHtml(video.title)}" loading="lazy">`
                      : ""
                  }
                </div>
              </td>
              <td>
                <div class="dyud-title" title="${escapeHtml(video.title)}">${escapeHtml(video.title)}</div>
              </td>
              <td class="dyud-date">${escapeHtml(formatDate(video.createTime))}</td>
              <td>
                <div class="dyud-actions">
                  <a href="${escapeHtml(video.videoUrl)}" target="_blank" rel="noopener noreferrer">Video</a>
                  ${audioLink}
                </div>
              </td>
            </tr>
          `;
        })
        .join("");

      this.ui.tableBody.innerHTML = rows;
    }

    sortVideos() {
      this.videos.sort((left, right) => {
        const leftTime = new Date(left.createTime).getTime() || 0;
        const rightTime = new Date(right.createTime).getTime() || 0;
        return rightTime - leftTime;
      });
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
      this.resetCollectionBeforeFetch();
      this.setBusyState(true);
      this.setStatus("Fetching videos...", "info", true);

      try {
        const apiClient = new DouyinApiClient(secUserId);
        await this.fetchAllVideos(apiClient);
        this.sortVideos();
        this.renderTable();
        this.updateSelectionUi();
        this.setStatus(`Fetch complete: ${this.videos.length} videos loaded.`, "success");
      } catch (error) {
        console.error("Douyin fetch failed:", error);
        this.setStatus(error.message || "Failed to fetch videos.", "error");
      } finally {
        this.isFetching = false;
        this.setBusyState(false);
        this.updateSelectionUi();
      }
    }

    resetCollectionBeforeFetch() {
      this.videos = [];
      this.videoMap.clear();
      this.selectedVideoIds.clear();
      this.renderTable();
      this.updateSelectionUi();
      this.closeDownloadMenu();
    }

    async fetchAllVideos(apiClient) {
      let maxCursor = 0;
      let hasMore = true;
      const seenIds = new Set();
      const seenCursors = new Set();

      while (hasMore) {
        if (seenCursors.has(maxCursor)) {
          break;
        }
        seenCursors.add(maxCursor);

        const payload = await retryWithDelay(() => apiClient.fetchVideos(maxCursor));
        const { videos, hasMore: nextHasMore, maxCursor: nextCursor } = VideoDataProcessor.processVideoData(payload, seenIds);

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
      return this.videos.filter((video) => this.selectedVideoIds.has(video.id));
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
        FileHandler.downloadMetadata(selectedVideos);
        this.setStatus(`Metadata exported for ${selectedVideos.length} videos.`, "success");
        return;
      }

      if (action === "txt") {
        FileHandler.downloadLinks(selectedVideos);
        this.setStatus(`Video links exported for ${selectedVideos.length} videos.`, "success");
        return;
      }

      await this.downloadSelectedMedia(selectedVideos, action);
    }

    async downloadSelectedMedia(videos, type) {
      this.isDownloading = true;
      this.setBusyState(true);

      let successCount = 0;
      let failedCount = 0;

      try {
        for (let index = 0; index < videos.length; index += 1) {
          const current = videos[index];
          this.setStatus(
            `Downloading ${type === "video" ? "video" : "audio"} ${index + 1}/${videos.length}...`,
            "info",
            true,
          );

          try {
            await FileHandler.downloadMedia(current, type);
            successCount += 1;
          } catch (error) {
            failedCount += 1;
            console.error(`Failed to download ${type} for ${current.id}:`, error);
          }

          await sleep(CONFIG.DOWNLOAD_DELAY_MS);
        }

        this.setStatus(`Complete: ${successCount} succeeded, ${failedCount} failed.`, failedCount ? "error" : "success");
      } finally {
        this.isDownloading = false;
        this.setBusyState(false);
        this.updateSelectionUi();
      }
    }
  }

  async function bootstrap() {
    try {
      const app = new DouyinDownloader();
      await app.init();
      window.douyinDownloader = app;
    } catch (error) {
      console.error("Failed to initialize Douyin User Video Downloader:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
