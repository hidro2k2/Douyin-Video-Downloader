(function initializeDouyinDownloaderCore(globalScope) {
  "use strict";

  const SETTINGS_SCHEMA_VERSION = 2;
  const QUEUE_SCHEMA_VERSION = 2;

  const ERROR_CODES = Object.freeze({
    UNKNOWN: "UNKNOWN",
    STATE_TRANSITION_INVALID: "STATE_TRANSITION_INVALID",
    STORAGE_READ_FAILED: "STORAGE_READ_FAILED",
    STORAGE_WRITE_FAILED: "STORAGE_WRITE_FAILED",
    DOUYIN_SESSION_EXPIRED: "DOUYIN_SESSION_EXPIRED",
    DOUYIN_RATE_LIMITED: "DOUYIN_RATE_LIMITED",
    DOUYIN_REQUEST_FAILED: "DOUYIN_REQUEST_FAILED",
    DOUYIN_SCHEMA_INVALID: "DOUYIN_SCHEMA_INVALID",
    FETCH_ABORTED: "FETCH_ABORTED",
    AI_KEY_INVALID: "AI_KEY_INVALID",
    AI_QUOTA_EXHAUSTED: "AI_QUOTA_EXHAUSTED",
    AI_RATE_LIMITED: "AI_RATE_LIMITED",
    AI_PROVIDER_UNAVAILABLE: "AI_PROVIDER_UNAVAILABLE",
    AI_RESPONSE_INVALID: "AI_RESPONSE_INVALID",
    AI_KEYS_UNAVAILABLE: "AI_KEYS_UNAVAILABLE",
    TRANSLATION_INPUT_EMPTY: "TRANSLATION_INPUT_EMPTY",
    DOWNLOAD_QUEUE_ACTIVE: "DOWNLOAD_QUEUE_ACTIVE",
    DOWNLOAD_QUEUE_EMPTY: "DOWNLOAD_QUEUE_EMPTY",
    DOWNLOAD_API_FAILED: "DOWNLOAD_API_FAILED",
    DOWNLOAD_INTERRUPTED: "DOWNLOAD_INTERRUPTED",
    DOWNLOAD_RECOVERY_SKIPPED: "DOWNLOAD_RECOVERY_SKIPPED"
  });

  class CoreError extends Error {
    constructor(code, message, options = {}) {
      super(message || code || ERROR_CODES.UNKNOWN);
      this.name = "CoreError";
      this.code = code || ERROR_CODES.UNKNOWN;
      this.retryable = Boolean(options.retryable);
      this.status = Number(options.status) || 0;
      this.details = options.details || null;
      if (options.cause) this.cause = options.cause;
    }

    toJSON() {
      return {
        code: this.code,
        message: this.message,
        retryable: this.retryable,
        status: this.status,
        details: this.details
      };
    }
  }

  function asCoreError(error, fallbackCode = ERROR_CODES.UNKNOWN, fallbackMessage = "Unexpected error.") {
    if (error instanceof CoreError) return error;
    return new CoreError(fallbackCode, error?.message || fallbackMessage, {
      retryable: Boolean(error?.retryable),
      status: Number(error?.status) || 0,
      cause: error
    });
  }

  class StateMachine {
    constructor(name, initialState, transitions) {
      this.name = String(name || "state");
      this.state = initialState;
      this.transitions = transitions || {};
      this.updatedAt = Date.now();
      this.metadata = {};
    }

    canTransition(nextState) {
      if (nextState === this.state) return true;
      const allowed = this.transitions[this.state] || [];
      return allowed.includes(nextState) || allowed.includes("*");
    }

    transition(nextState, metadata = {}) {
      if (!this.canTransition(nextState)) {
        throw new CoreError(
          ERROR_CODES.STATE_TRANSITION_INVALID,
          `${this.name} cannot transition from ${this.state} to ${nextState}.`,
          { details: { machine: this.name, from: this.state, to: nextState } }
        );
      }
      this.state = nextState;
      this.metadata = { ...metadata };
      this.updatedAt = Date.now();
      return this.snapshot();
    }

    force(nextState, metadata = {}) {
      this.state = nextState;
      this.metadata = { ...metadata };
      this.updatedAt = Date.now();
      return this.snapshot();
    }

    snapshot() {
      return {
        name: this.name,
        state: this.state,
        metadata: { ...this.metadata },
        updatedAt: this.updatedAt
      };
    }
  }

  function normalizeApiKeys(value) {
    const source = Array.isArray(value) ? value : String(value || "").split(/[\s,;]+/);
    return Array.from(new Set(source.map((key) => String(key || "").trim()).filter(Boolean))).slice(0, 50);
  }

  function normalizeDelay(value, fallback = 700) {
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric >= 0 ? Math.round(numeric) : fallback;
  }

  function migrateSettings(rawSettings = {}) {
    const raw = rawSettings && typeof rawSettings === "object" ? rawSettings : {};
    const filters = raw.filters && typeof raw.filters === "object" ? raw.filters : {};
    return {
      schemaVersion: SETTINGS_SCHEMA_VERSION,
      uiLanguage: ["EN", "VI", "JP", "KR", "CN"].includes(raw.uiLanguage) ? raw.uiLanguage : "EN",
      downloadFolder: String(raw.downloadFolder || "douyin_downloads"),
      queueDelayMs: normalizeDelay(raw.queueDelayMs),
      viewMode: ["list", "grid"].includes(raw.viewMode) ? raw.viewMode : "list",
      sortBy: ["newest", "oldest", "title-asc", "title-desc"].includes(raw.sortBy) ? raw.sortBy : "newest",
      lastDownloadAction: ["video", "audio", "json", "txt", "csv"].includes(raw.lastDownloadAction)
        ? raw.lastDownloadAction
        : "video",
      translationEnabled: Boolean(raw.translationEnabled),
      translationLanguage: ["EN", "VI", "JP", "KR", "CN"].includes(raw.translationLanguage)
        ? raw.translationLanguage
        : "VI",
      translationProvider: ["auto", "gemini", "groq"].includes(raw.translationProvider)
        ? raw.translationProvider
        : "auto",
      geminiModel: ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-2.5-flash"].includes(raw.geminiModel)
        ? raw.geminiModel
        : "gemini-3.6-flash",
      groqModel: ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b", "llama-3.3-70b-versatile"].includes(raw.groqModel)
        ? raw.groqModel
        : "openai/gpt-oss-120b",
      geminiApiKeys: normalizeApiKeys(raw.geminiApiKeys),
      groqApiKeys: normalizeApiKeys(raw.groqApiKeys),
      filters: {
        search: String(filters.search || ""),
        dateFrom: String(filters.dateFrom || ""),
        dateTo: String(filters.dateTo || ""),
        scope: ["all", "selected"].includes(filters.scope) ? filters.scope : "all"
      }
    };
  }

  function toHttps(url) {
    const value = typeof url === "string" ? url : "";
    return value.startsWith("http://") ? value.replace(/^http:\/\//i, "https://") : value;
  }

  function extractVideoMetadata(item) {
    if (!item || typeof item !== "object" || !item.aweme_id) return null;
    const caption = String(item.desc || "");
    const title = String(item.title || caption || "Untitled");
    const videoUrl = toHttps(
      item.video?.play_addr?.url_list?.[0] || item.video?.download_addr?.url_list?.[0] || ""
    );
    if (!videoUrl) return null;
    const timestamp = Number(item.create_time);
    return {
      id: String(item.aweme_id),
      desc: caption,
      caption,
      title,
      createTime: Number.isFinite(timestamp) && timestamp > 0 ? new Date(timestamp * 1000).toISOString() : "",
      videoUrl,
      audioUrl: toHttps(item.music?.play_url?.url_list?.[0] || ""),
      coverUrl: toHttps(item.video?.cover?.url_list?.[0] || item.cover?.url_list?.[0] || ""),
      dynamicCoverUrl: toHttps(
        item.video?.dynamic_cover?.url_list?.[0] || item.dynamic_cover?.url_list?.[0] || ""
      )
    };
  }

  function normalizeDouyinPayload(payload, existingIds = new Set()) {
    if (!payload || typeof payload !== "object") {
      throw new CoreError(ERROR_CODES.DOUYIN_SCHEMA_INVALID, "Douyin returned an invalid response.");
    }
    if (Number(payload.status_code || 0) !== 0) {
      throw new CoreError(
        ERROR_CODES.DOUYIN_REQUEST_FAILED,
        `Douyin API returned status_code ${payload.status_code}.`,
        { details: { statusCode: payload.status_code } }
      );
    }
    if (payload.aweme_list != null && !Array.isArray(payload.aweme_list)) {
      throw new CoreError(ERROR_CODES.DOUYIN_SCHEMA_INVALID, "Douyin changed the expected video-list format.");
    }

    const videos = [];
    for (const item of payload.aweme_list || []) {
      const video = extractVideoMetadata(item);
      if (!video || existingIds.has(video.id)) continue;
      existingIds.add(video.id);
      videos.push(video);
    }
    const cursor = Number(payload.max_cursor || 0);
    return {
      videos,
      hasMore: Boolean(payload.has_more),
      maxCursor: Number.isFinite(cursor) && cursor >= 0 ? cursor : 0
    };
  }

  class DouyinApiClient {
    constructor(secUserId, options = {}) {
      this.secUserId = String(secUserId || "");
      this.signal = options.signal || null;
      this.apiBaseUrl = options.apiBaseUrl;
      this.requestQuery = options.requestQuery || {};
      this.referrer = options.referrer || "https://www.douyin.com/";
    }

    async fetchVideos(maxCursor = 0) {
      const url = new URL(this.apiBaseUrl);
      const query = { ...this.requestQuery, sec_user_id: this.secUserId, max_cursor: String(maxCursor) };
      Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));
      const response = await fetch(url.toString(), {
        method: "GET",
        credentials: "include",
        referrer: this.referrer,
        signal: this.signal,
        headers: { Accept: "application/json, text/plain, */*" }
      });
      if (!response.ok) {
        const status = Number(response.status);
        const code = [401, 403].includes(status)
          ? ERROR_CODES.DOUYIN_SESSION_EXPIRED
          : status === 429
            ? ERROR_CODES.DOUYIN_RATE_LIMITED
            : ERROR_CODES.DOUYIN_REQUEST_FAILED;
        throw new CoreError(code, `HTTP ${status} while fetching videos.`, {
          status,
          retryable: status === 429 || status >= 500
        });
      }
      let payload;
      try {
        payload = await response.json();
      } catch (error) {
        throw new CoreError(ERROR_CODES.DOUYIN_SCHEMA_INVALID, "Douyin returned malformed JSON.", { cause: error });
      }
      if (Number(payload?.status_code || 0) !== 0) {
        throw new CoreError(
          ERROR_CODES.DOUYIN_REQUEST_FAILED,
          `Douyin API returned status_code ${payload.status_code}.`,
          { details: { statusCode: payload.status_code } }
        );
      }
      return payload;
    }
  }

  globalScope.DYEXCore = Object.freeze({
    SETTINGS_SCHEMA_VERSION,
    QUEUE_SCHEMA_VERSION,
    ERROR_CODES,
    CoreError,
    StateMachine,
    asCoreError,
    normalizeApiKeys,
    normalizeDelay,
    migrateSettings,
    extractVideoMetadata,
    normalizeDouyinPayload,
    DouyinApiClient
  });
})(globalThis);
