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
    FILTER_SCOPE_ID: "dyex-filter-scope",
    SORT_SELECT_ID: "dyex-sort-select",
    VIEW_TOGGLE_ID: "dyex-view-toggle",
    GRID_ID: "dyex-grid",
    TABLE_WRAP_ID: "dyex-table-wrap",
    DOWNLOAD_PROGRESS_ID: "dyex-download-progress",
    DOWNLOAD_PROGRESS_BAR_ID: "dyex-download-progress-bar",
    DOWNLOAD_PROGRESS_TITLE_ID: "dyex-download-progress-title",
    DOWNLOAD_PROGRESS_DETAIL_ID: "dyex-download-progress-detail",
    DOWNLOAD_PROGRESS_STATS_ID: "dyex-download-progress-stats",
    RESET_FILTERS_ID: "dyex-reset-filters",
    RANGE_START_ID: "dyex-range-start",
    RANGE_END_ID: "dyex-range-end",
    APPLY_RANGE_ID: "dyex-apply-range",
    CLEAR_RANGE_ID: "dyex-clear-range",
    FOLDER_INPUT_ID: "dyex-folder-input",
    DELAY_INPUT_ID: "dyex-delay-input",
    SETTINGS_TOGGLE_ID: "dyex-settings-toggle",
    SETTINGS_DRAWER_ID: "dyex-settings-drawer",
    SETTINGS_OVERLAY_ID: "dyex-settings-overlay",
    SETTINGS_SAVE_ID: "dyex-settings-save",
    SETTINGS_STATUS_ID: "dyex-settings-status",
    UI_LANGUAGE_SELECT_ID: "dyex-ui-language-select",
    TRANSLATION_TOGGLE_ID: "dyex-translation-toggle",
    LANGUAGE_SELECT_ID: "dyex-language-select",
    PROVIDER_SELECT_ID: "dyex-provider-select",
    GEMINI_MODEL_SELECT_ID: "dyex-gemini-model-select",
    GROQ_MODEL_SELECT_ID: "dyex-groq-model-select",
    GEMINI_KEYS_ID: "dyex-gemini-keys",
    GROQ_KEYS_ID: "dyex-groq-keys",
    SHOW_KEYS_ID: "dyex-show-keys",
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

  const UI_LOCALES = {
    EN: "en-US",
    VI: "vi-VN",
    JP: "ja-JP",
    KR: "ko-KR",
    CN: "zh-CN"
  };

  const UI_TRANSLATIONS = {
    VI: {
      "Ready.": "Sẵn sàng.",
      "Preparing download...": "Đang chuẩn bị tải xuống...",
      "Select All (": "Chọn tất cả (",
      "Download": "Tải xuống",
      "Stop": "Dừng",
      "Download Selected Videos": "Tải video đã chọn",
      "Download Selected Audios": "Tải audio đã chọn",
      "Export Metadata JSON": "Xuất metadata JSON",
      "Export Links TXT": "Xuất liên kết TXT",
      "Export CSV": "Xuất CSV",
      "Video layout": "Kiểu hiển thị video",
      "List view": "Dạng danh sách",
      "Grid view": "Dạng lưới",
      "Refresh": "Làm mới",
      "Refreshing...": "Đang làm mới...",
      "Search": "Tìm kiếm",
      "Title or caption": "Tiêu đề hoặc caption",
      "Date posted": "Ngày đăng",
      "Start": "Bắt đầu",
      "to": "đến",
      "End": "Kết thúc",
      "Post date start": "Ngày đăng bắt đầu",
      "Post date end": "Ngày đăng kết thúc",
      "Show": "Hiển thị",
      "All videos": "Tất cả video",
      "Selected only": "Chỉ video đã chọn",
      "Sort": "Sắp xếp",
      "Newest first": "Mới nhất trước",
      "Oldest first": "Cũ nhất trước",
      "Title A-Z": "Tiêu đề A-Z",
      "Title Z-A": "Tiêu đề Z-A",
      "Reset Filters": "Đặt lại bộ lọc",
      "Selection range": "Khoảng lựa chọn",
      "Start #": "Từ số",
      "End #": "Đến số",
      "Selection range start": "Số bắt đầu lựa chọn",
      "Selection range end": "Số kết thúc lựa chọn",
      "Select Range": "Chọn khoảng",
      "Unselect Range": "Bỏ chọn khoảng",
      "Select": "Chọn",
      "No.": "STT",
      "Cover": "Ảnh bìa",
      "Title / Caption": "Tiêu đề / Caption",
      "Date": "Ngày",
      "Actions": "Thao tác",
      "Preparing video list...": "Đang chuẩn bị danh sách video...",
      "Open settings": "Mở cài đặt",
      "Support the author": "Ủng hộ tác giả",
      "Close": "Đóng",
      "Buy me a coffee": "Mời tôi một ly cà phê",
      "Author Zalo": "Zalo tác giả",
      "Preferences": "Tùy chọn",
      "Settings": "Cài đặt",
      "Interface": "Giao diện",
      "Choose the language used throughout the downloader.": "Chọn ngôn ngữ hiển thị cho toàn bộ downloader.",
      "Interface language": "Ngôn ngữ giao diện",
      "Download settings": "Thiết lập tải xuống",
      "Folder prefix and pacing for the download queue.": "Tiền tố thư mục và khoảng nghỉ của hàng đợi tải xuống.",
      "File prefix": "Tiền tố file",
      "Download delay": "Độ trễ tải xuống",
      "AI filename translation": "Dịch tên file bằng AI",
      "Only downloaded filenames change. Video titles in the list stay original.": "Chỉ tên file tải xuống thay đổi. Tiêu đề video trong danh sách vẫn giữ nguyên.",
      "Translate": "Dịch",
      "Target language": "Ngôn ngữ đích",
      "Filename output": "Ngôn ngữ tên file",
      "AI provider": "Nhà cung cấp AI",
      "Translation engine": "Công cụ dịch",
      "Auto — Gemini → Groq": "Tự động — Gemini → Groq",
      "Gemini only": "Chỉ Gemini",
      "Groq only": "Chỉ Groq",
      "Gemini model": "Model Gemini",
      "Groq model": "Model Groq",
      "Available": "Đang hoạt động",
      "Retired — unavailable": "Đã ngừng — không khả dụng",
      "Gemini 3.6 Flash · Recommended": "Gemini 3.6 Flash · Khuyên dùng",
      "Gemini 3.5 Flash-Lite · Fast": "Gemini 3.5 Flash-Lite · Nhanh",
      "Gemini 2.5 Flash · Until Oct 2026": "Gemini 2.5 Flash · Đến 10/2026",
      "Gemini 2.0 Flash · Retired": "Gemini 2.0 Flash · Đã ngừng",
      "Gemini 2.0 Flash-Lite · Retired": "Gemini 2.0 Flash-Lite · Đã ngừng",
      "Gemini 1.5 Flash · Retired": "Gemini 1.5 Flash · Đã ngừng",
      "GPT-OSS 120B · Recommended": "GPT-OSS 120B · Khuyên dùng",
      "GPT-OSS 20B · Fast": "GPT-OSS 20B · Nhanh",
      "Qwen 3.6 27B · Preview": "Qwen 3.6 27B · Thử nghiệm",
      "Llama 3.3 70B · Enterprise legacy": "Llama 3.3 70B · Enterprise cũ",
      "Mixtral 8x7B · Retired": "Mixtral 8x7B · Đã ngừng",
      "Gemma2 9B · Retired": "Gemma2 9B · Đã ngừng",
      "API keys": "Khóa API",
      "Stored locally. Use Show keys to temporarily reveal saved keys; one key per line.": "Chỉ lưu cục bộ. Dùng Hiện khóa để tạm xem khóa đã lưu; mỗi dòng một khóa.",
      "Show keys": "Hiện khóa",
      "Gemini API keys": "Khóa API Gemini",
      "Groq API keys": "Khóa API Groq",
      "Clear saved Gemini keys": "Xóa khóa Gemini đã lưu",
      "Clear saved Groq keys": "Xóa khóa Groq đã lưu",
      "Vietnamese mode": "Chế độ tiếng Việt",
      "Creates concise, natural and engaging Vietnamese titles for Chinese reuploads across review, film, animation, tech, entertainment, education and other content styles—without inventing facts.": "Tạo tiêu đề tiếng Việt ngắn gọn, tự nhiên và cuốn hút cho nội dung reup Trung Quốc thuộc review, phim, hoạt hình, công nghệ, giải trí, giáo dục và nhiều thể loại khác mà không bịa dữ kiện.",
      "API keys are stored only in this browser's local extension storage and sent directly to the selected AI provider.": "Khóa API chỉ được lưu trong bộ nhớ cục bộ của extension trên trình duyệt này và gửi trực tiếp tới nhà cung cấp AI đã chọn.",
      "Save settings": "Lưu cài đặt",
      "Try again": "Thử lại",
      "Audio": "Âm thanh",
      "Video": "Video",
      "Open video": "Mở video",
      "No videos available for range selection.": "Không có video để chọn theo khoảng.",
      "No videos available for range unselect.": "Không có video để bỏ chọn theo khoảng.",
      "Enter valid start and end numbers.": "Hãy nhập số bắt đầu và kết thúc hợp lệ.",
      "Start must be between 1 and {count}.": "Số bắt đầu phải từ 1 đến {count}.",
      "Selected videos {start}-{end}.": "Đã chọn video {start}-{end}.",
      "Unselected videos {start}-{end}.": "Đã bỏ chọn video {start}-{end}.",
      "Queue ready: {total} items.": "Hàng đợi đã sẵn sàng: {total} mục.",
      "Downloading {current}/{total}...": "Đang tải {current}/{total}...",
      "Downloaded {success}/{total}. Failed: {failed}.": "Đã tải {success}/{total}. Lỗi: {failed}.",
      "Download failed on {current}/{total}. Failed: {failed}.": "Tải lỗi tại {current}/{total}. Tổng lỗi: {failed}.",
      "Cancelling download queue...": "Đang hủy hàng đợi tải xuống...",
      "Queue cancelled. Success: {success}, failed: {failed}.": "Đã hủy hàng đợi. Thành công: {success}, lỗi: {failed}.",
      "Queue complete. Success: {success}, failed: {failed}.": "Hàng đợi hoàn tất. Thành công: {success}, lỗi: {failed}.",
      "Preparing {total} {kind} files": "Đang chuẩn bị {total} file {kind}",
      "Downloading {current} of {total}": "Đang tải {current}/{total}",
      "Downloaded {completed} of {total}": "Đã tải {completed}/{total}",
      "Continuing after a failed file": "Đang tiếp tục sau một file lỗi",
      "Stopping download queue...": "Đang dừng hàng đợi tải xuống...",
      "Download queue stopped": "Hàng đợi tải xuống đã dừng",
      "Download queue complete": "Hàng đợi tải xuống hoàn tất",
      "Download progress": "Tiến trình tải xuống",
      "Waiting for the next file...": "Đang chờ file tiếp theo...",
      "{percentage}% / {success} successful / {failed} failed": "{percentage}% / {success} thành công / {failed} lỗi",
      "{completed} of {total} files complete": "Đã hoàn tất {completed}/{total} file",
      "video": "video",
      "audio": "audio",
      "Loading Douyin videos...": "Đang tải video Douyin...",
      "Open Douyin Downloader": "Mở Douyin Downloader",
      "Videos could not be loaded": "Không thể tải video",
      "Preparing your video list": "Đang chuẩn bị danh sách video",
      "Fetching starts automatically when a Douyin profile opens.": "Dữ liệu được tự động tải khi mở profile Douyin.",
      "No selected videos to show": "Không có video đã chọn để hiển thị",
      "No videos match these filters": "Không có video phù hợp bộ lọc",
      "Adjust or reset the filters to see more results.": "Hãy điều chỉnh hoặc đặt lại bộ lọc để xem thêm kết quả.",
      "No videos found": "Không tìm thấy video",
      "This profile does not have any downloadable videos yet.": "Profile này chưa có video có thể tải xuống.",
      "Preparing profile videos...": "Đang chuẩn bị video của profile...",
      "Could not find sec_user_id in the current URL.": "Không tìm thấy sec_user_id trong URL hiện tại.",
      "Refreshing videos in the background...": "Đang làm mới video trong nền...",
      "Loading videos...": "Đang tải video...",
      "Refreshing... {count} videos found": "Đang làm mới... tìm thấy {count} video",
      "Loading... {count} videos found": "Đang tải... tìm thấy {count} video",
      "{count} videos loaded / Updated {time}": "Đã tải {count} video / Cập nhật {time}",
      "Failed to fetch videos.": "Không thể lấy video.",
      "Failed to refresh videos.": "Không thể làm mới video.",
      "Preparing {kind} files...": "Đang chuẩn bị file {kind}...",
      "English": "Tiếng Anh",
      "Vietnamese": "Tiếng Việt",
      "Japanese": "Tiếng Nhật",
      "Korean": "Tiếng Hàn",
      "Chinese": "Tiếng Trung",
      "Translating {count} filenames to {language}...": "Đang dịch {count} tên file sang {language}...",
      "Filename translation failed.": "Dịch tên file thất bại.",
      "Translated {translated}/{total} filenames with {provider}.": "Đã dịch {translated}/{total} tên file bằng {provider}.",
      "No {kind} URLs available for the selected videos.": "Không có URL {kind} cho các video đã chọn.",
      "Starting {kind} queue...": "Đang khởi động hàng đợi {kind}...",
      "Failed to start download queue.": "Không thể khởi động hàng đợi tải xuống.",
      "Metadata exported for {count} videos.": "Đã xuất metadata cho {count} video.",
      "Metadata export failed.": "Xuất metadata thất bại.",
      "Video links exported for {count} videos.": "Đã xuất liên kết của {count} video.",
      "Link export failed.": "Xuất liên kết thất bại.",
      "CSV exported for {count} videos.": "Đã xuất CSV cho {count} video.",
      "CSV export failed.": "Xuất CSV thất bại.",
      "Failed to cancel queue.": "Không thể hủy hàng đợi.",
      "Add at least one API key for the selected provider.": "Hãy thêm ít nhất một khóa API cho nhà cung cấp đã chọn.",
      "Settings saved locally.": "Đã lưu cài đặt cục bộ.",
      "Failed to save settings.": "Không thể lưu cài đặt.",
      "{count} saved key(s) — leave blank to keep": "Đã lưu {count} khóa — để trống để giữ nguyên",
      "{provider} keys will be removed when you save": "Khóa {provider} sẽ bị xóa khi lưu",
      "{provider} keys marked for removal. Click Save settings to confirm.": "Đã đánh dấu xóa khóa {provider}. Bấm Lưu cài đặt để xác nhận."
    },
    JP: {
      "Ready.": "準備完了。",
      "Preparing download...": "ダウンロードを準備中...",
      "Select All (": "すべて選択 (",
      "Download": "ダウンロード",
      "Stop": "停止",
      "Download Selected Videos": "選択した動画をダウンロード",
      "Download Selected Audios": "選択した音声をダウンロード",
      "Export Metadata JSON": "メタデータをJSONで出力",
      "Export Links TXT": "リンクをTXTで出力",
      "Export CSV": "CSVを出力",
      "Video layout": "動画レイアウト",
      "List view": "リスト表示",
      "Grid view": "グリッド表示",
      "Refresh": "更新",
      "Refreshing...": "更新中...",
      "Search": "検索",
      "Title or caption": "タイトルまたはキャプション",
      "Date posted": "投稿日",
      "Start": "開始",
      "to": "から",
      "End": "終了",
      "Post date start": "投稿日（開始）",
      "Post date end": "投稿日（終了）",
      "Show": "表示",
      "All videos": "すべての動画",
      "Selected only": "選択済みのみ",
      "Sort": "並べ替え",
      "Newest first": "新しい順",
      "Oldest first": "古い順",
      "Title A-Z": "タイトル A-Z",
      "Title Z-A": "タイトル Z-A",
      "Reset Filters": "フィルターをリセット",
      "Selection range": "選択範囲",
      "Start #": "開始番号",
      "End #": "終了番号",
      "Selection range start": "選択範囲の開始",
      "Selection range end": "選択範囲の終了",
      "Select Range": "範囲を選択",
      "Unselect Range": "範囲を解除",
      "Select": "選択",
      "No.": "番号",
      "Cover": "カバー",
      "Title / Caption": "タイトル / キャプション",
      "Date": "日付",
      "Actions": "操作",
      "Preparing video list...": "動画リストを準備中...",
      "Open settings": "設定を開く",
      "Support the author": "作者を支援",
      "Close": "閉じる",
      "Buy me a coffee": "コーヒーを贈る",
      "Author Zalo": "作者のZalo",
      "Preferences": "環境設定",
      "Settings": "設定",
      "Interface": "インターフェース",
      "Choose the language used throughout the downloader.": "ダウンローダー全体で使用する言語を選択します。",
      "Interface language": "表示言語",
      "Download settings": "ダウンロード設定",
      "Folder prefix and pacing for the download queue.": "保存先プレフィックスとダウンロード間隔を設定します。",
      "File prefix": "ファイルプレフィックス",
      "Download delay": "ダウンロード間隔",
      "AI filename translation": "AIファイル名翻訳",
      "Only downloaded filenames change. Video titles in the list stay original.": "変更されるのは保存ファイル名のみです。リストの動画タイトルは原文のままです。",
      "Translate": "翻訳",
      "Target language": "翻訳先言語",
      "Filename output": "ファイル名の言語",
      "AI provider": "AIプロバイダー",
      "Translation engine": "翻訳エンジン",
      "Auto — Gemini → Groq": "自動 — Gemini → Groq",
      "Gemini only": "Geminiのみ",
      "Groq only": "Groqのみ",
      "Gemini model": "Geminiモデル",
      "Groq model": "Groqモデル",
      "Available": "利用可能",
      "Retired — unavailable": "提供終了 — 利用不可",
      "Gemini 3.6 Flash · Recommended": "Gemini 3.6 Flash · 推奨",
      "Gemini 3.5 Flash-Lite · Fast": "Gemini 3.5 Flash-Lite · 高速",
      "Gemini 2.5 Flash · Until Oct 2026": "Gemini 2.5 Flash · 2026年10月まで",
      "Gemini 2.0 Flash · Retired": "Gemini 2.0 Flash · 提供終了",
      "Gemini 2.0 Flash-Lite · Retired": "Gemini 2.0 Flash-Lite · 提供終了",
      "Gemini 1.5 Flash · Retired": "Gemini 1.5 Flash · 提供終了",
      "GPT-OSS 120B · Recommended": "GPT-OSS 120B · 推奨",
      "GPT-OSS 20B · Fast": "GPT-OSS 20B · 高速",
      "Qwen 3.6 27B · Preview": "Qwen 3.6 27B · プレビュー",
      "Llama 3.3 70B · Enterprise legacy": "Llama 3.3 70B · Enterpriseレガシー",
      "Mixtral 8x7B · Retired": "Mixtral 8x7B · 提供終了",
      "Gemma2 9B · Retired": "Gemma2 9B · 提供終了",
      "API keys": "APIキー",
      "Stored locally. Use Show keys to temporarily reveal saved keys; one key per line.": "ローカル保存です。「キーを表示」で一時表示できます。1行に1キー入力してください。",
      "Show keys": "キーを表示",
      "Gemini API keys": "Gemini APIキー",
      "Groq API keys": "Groq APIキー",
      "Clear saved Gemini keys": "保存済みGeminiキーを削除",
      "Clear saved Groq keys": "保存済みGroqキーを削除",
      "Vietnamese mode": "ベトナム語モード",
      "Creates concise, natural and engaging Vietnamese titles for Chinese reuploads across review, film, animation, tech, entertainment, education and other content styles—without inventing facts.": "中国発のレビュー、映画、アニメ、テクノロジー、娯楽、教育などに対し、事実を追加せず自然で魅力的なベトナム語タイトルを作成します。",
      "API keys are stored only in this browser's local extension storage and sent directly to the selected AI provider.": "APIキーはこのブラウザの拡張機能ローカルストレージにのみ保存され、選択したAIプロバイダーへ直接送信されます。",
      "Save settings": "設定を保存",
      "Try again": "再試行",
      "Audio": "音声",
      "Video": "動画",
      "Open video": "動画を開く",
      "No videos available for range selection.": "範囲選択できる動画がありません。",
      "No videos available for range unselect.": "範囲解除できる動画がありません。",
      "Enter valid start and end numbers.": "有効な開始番号と終了番号を入力してください。",
      "Start must be between 1 and {count}.": "開始番号は1から{count}の間で指定してください。",
      "Selected videos {start}-{end}.": "動画{start}～{end}を選択しました。",
      "Unselected videos {start}-{end}.": "動画{start}～{end}の選択を解除しました。",
      "Queue ready: {total} items.": "キューの準備完了：{total}件。",
      "Downloading {current}/{total}...": "ダウンロード中 {current}/{total}...",
      "Downloaded {success}/{total}. Failed: {failed}.": "{success}/{total}件完了。失敗：{failed}件。",
      "Download failed on {current}/{total}. Failed: {failed}.": "{current}/{total}件目で失敗。失敗数：{failed}件。",
      "Cancelling download queue...": "ダウンロードキューをキャンセル中...",
      "Queue cancelled. Success: {success}, failed: {failed}.": "キューをキャンセルしました。成功：{success}、失敗：{failed}。",
      "Queue complete. Success: {success}, failed: {failed}.": "キュー完了。成功：{success}、失敗：{failed}。",
      "Preparing {total} {kind} files": "{total}件の{kind}ファイルを準備中",
      "Downloading {current} of {total}": "ダウンロード中 {current}/{total}",
      "Downloaded {completed} of {total}": "{completed}/{total}件ダウンロード済み",
      "Continuing after a failed file": "失敗したファイルの次へ進みます",
      "Stopping download queue...": "ダウンロードキューを停止中...",
      "Download queue stopped": "ダウンロードキューを停止しました",
      "Download queue complete": "ダウンロードキューが完了しました",
      "Download progress": "ダウンロード進捗",
      "Waiting for the next file...": "次のファイルを待機中...",
      "{percentage}% / {success} successful / {failed} failed": "{percentage}% / 成功 {success} / 失敗 {failed}",
      "{completed} of {total} files complete": "{completed}/{total}ファイル完了",
      "video": "動画",
      "audio": "音声",
      "Loading Douyin videos...": "Douyin動画を読み込み中...",
      "Open Douyin Downloader": "Douyin Downloaderを開く",
      "Videos could not be loaded": "動画を読み込めませんでした",
      "Preparing your video list": "動画リストを準備中",
      "Fetching starts automatically when a Douyin profile opens.": "Douyinプロフィールを開くと自動取得が開始されます。",
      "No selected videos to show": "表示できる選択済み動画がありません",
      "No videos match these filters": "フィルターに一致する動画がありません",
      "Adjust or reset the filters to see more results.": "フィルターを変更またはリセットしてください。",
      "No videos found": "動画が見つかりません",
      "This profile does not have any downloadable videos yet.": "このプロフィールにはダウンロード可能な動画がまだありません。",
      "Preparing profile videos...": "プロフィール動画を準備中...",
      "Could not find sec_user_id in the current URL.": "現在のURLからsec_user_idを取得できません。",
      "Refreshing videos in the background...": "バックグラウンドで動画を更新中...",
      "Loading videos...": "動画を読み込み中...",
      "Refreshing... {count} videos found": "更新中... {count}件の動画を検出",
      "Loading... {count} videos found": "読み込み中... {count}件の動画を検出",
      "{count} videos loaded / Updated {time}": "{count}件の動画を読み込みました / 更新 {time}",
      "Failed to fetch videos.": "動画の取得に失敗しました。",
      "Failed to refresh videos.": "動画の更新に失敗しました。",
      "Preparing {kind} files...": "{kind}ファイルを準備中...",
      "English": "英語",
      "Vietnamese": "ベトナム語",
      "Japanese": "日本語",
      "Korean": "韓国語",
      "Chinese": "中国語",
      "Translating {count} filenames to {language}...": "{count}件のファイル名を{language}へ翻訳中...",
      "Filename translation failed.": "ファイル名の翻訳に失敗しました。",
      "Translated {translated}/{total} filenames with {provider}.": "{provider}で{translated}/{total}件のファイル名を翻訳しました。",
      "No {kind} URLs available for the selected videos.": "選択した動画に利用可能な{kind} URLがありません。",
      "Starting {kind} queue...": "{kind}キューを開始中...",
      "Failed to start download queue.": "ダウンロードキューを開始できませんでした。",
      "Metadata exported for {count} videos.": "{count}件の動画メタデータを出力しました。",
      "Metadata export failed.": "メタデータの出力に失敗しました。",
      "Video links exported for {count} videos.": "{count}件の動画リンクを出力しました。",
      "Link export failed.": "リンクの出力に失敗しました。",
      "CSV exported for {count} videos.": "{count}件の動画をCSVで出力しました。",
      "CSV export failed.": "CSVの出力に失敗しました。",
      "Failed to cancel queue.": "キューをキャンセルできませんでした。",
      "Add at least one API key for the selected provider.": "選択したプロバイダーのAPIキーを1つ以上追加してください。",
      "Settings saved locally.": "設定をローカルに保存しました。",
      "Failed to save settings.": "設定を保存できませんでした。",
      "{count} saved key(s) — leave blank to keep": "{count}個のキーを保存済み — 維持する場合は空欄",
      "{provider} keys will be removed when you save": "保存時に{provider}キーを削除します",
      "{provider} keys marked for removal. Click Save settings to confirm.": "{provider}キーを削除対象にしました。「設定を保存」で確定してください。"
    },
    KR: {
      "Ready.": "준비됨.",
      "Preparing download...": "다운로드 준비 중...",
      "Select All (": "모두 선택 (",
      "Download": "다운로드",
      "Stop": "중지",
      "Download Selected Videos": "선택한 동영상 다운로드",
      "Download Selected Audios": "선택한 오디오 다운로드",
      "Export Metadata JSON": "메타데이터 JSON 내보내기",
      "Export Links TXT": "링크 TXT 내보내기",
      "Export CSV": "CSV 내보내기",
      "Video layout": "동영상 레이아웃",
      "List view": "목록 보기",
      "Grid view": "그리드 보기",
      "Refresh": "새로고침",
      "Refreshing...": "새로고침 중...",
      "Search": "검색",
      "Title or caption": "제목 또는 캡션",
      "Date posted": "게시일",
      "Start": "시작",
      "to": "부터",
      "End": "종료",
      "Post date start": "게시 시작일",
      "Post date end": "게시 종료일",
      "Show": "표시",
      "All videos": "모든 동영상",
      "Selected only": "선택 항목만",
      "Sort": "정렬",
      "Newest first": "최신순",
      "Oldest first": "오래된순",
      "Title A-Z": "제목 A-Z",
      "Title Z-A": "제목 Z-A",
      "Reset Filters": "필터 초기화",
      "Selection range": "선택 범위",
      "Start #": "시작 번호",
      "End #": "종료 번호",
      "Selection range start": "선택 범위 시작",
      "Selection range end": "선택 범위 종료",
      "Select Range": "범위 선택",
      "Unselect Range": "범위 선택 해제",
      "Select": "선택",
      "No.": "번호",
      "Cover": "커버",
      "Title / Caption": "제목 / 캡션",
      "Date": "날짜",
      "Actions": "작업",
      "Preparing video list...": "동영상 목록 준비 중...",
      "Open settings": "설정 열기",
      "Support the author": "제작자 후원",
      "Close": "닫기",
      "Buy me a coffee": "커피 한 잔 후원",
      "Author Zalo": "제작자 Zalo",
      "Preferences": "환경설정",
      "Settings": "설정",
      "Interface": "인터페이스",
      "Choose the language used throughout the downloader.": "다운로더 전체에서 사용할 언어를 선택하세요.",
      "Interface language": "인터페이스 언어",
      "Download settings": "다운로드 설정",
      "Folder prefix and pacing for the download queue.": "다운로드 폴더 접두사와 대기 시간을 설정합니다.",
      "File prefix": "파일 접두사",
      "Download delay": "다운로드 지연",
      "AI filename translation": "AI 파일명 번역",
      "Only downloaded filenames change. Video titles in the list stay original.": "다운로드 파일명만 변경되며 목록의 동영상 제목은 원문으로 유지됩니다.",
      "Translate": "번역",
      "Target language": "대상 언어",
      "Filename output": "파일명 출력 언어",
      "AI provider": "AI 제공업체",
      "Translation engine": "번역 엔진",
      "Auto — Gemini → Groq": "자동 — Gemini → Groq",
      "Gemini only": "Gemini만",
      "Groq only": "Groq만",
      "Gemini model": "Gemini 모델",
      "Groq model": "Groq 모델",
      "Available": "사용 가능",
      "Retired — unavailable": "지원 종료 — 사용 불가",
      "Gemini 3.6 Flash · Recommended": "Gemini 3.6 Flash · 권장",
      "Gemini 3.5 Flash-Lite · Fast": "Gemini 3.5 Flash-Lite · 빠름",
      "Gemini 2.5 Flash · Until Oct 2026": "Gemini 2.5 Flash · 2026년 10월까지",
      "Gemini 2.0 Flash · Retired": "Gemini 2.0 Flash · 지원 종료",
      "Gemini 2.0 Flash-Lite · Retired": "Gemini 2.0 Flash-Lite · 지원 종료",
      "Gemini 1.5 Flash · Retired": "Gemini 1.5 Flash · 지원 종료",
      "GPT-OSS 120B · Recommended": "GPT-OSS 120B · 권장",
      "GPT-OSS 20B · Fast": "GPT-OSS 20B · 빠름",
      "Qwen 3.6 27B · Preview": "Qwen 3.6 27B · 미리보기",
      "Llama 3.3 70B · Enterprise legacy": "Llama 3.3 70B · Enterprise 레거시",
      "Mixtral 8x7B · Retired": "Mixtral 8x7B · 지원 종료",
      "Gemma2 9B · Retired": "Gemma2 9B · 지원 종료",
      "API keys": "API 키",
      "Stored locally. Use Show keys to temporarily reveal saved keys; one key per line.": "로컬에만 저장됩니다. 키 표시로 잠시 확인할 수 있으며 한 줄에 하나씩 입력하세요.",
      "Show keys": "키 표시",
      "Gemini API keys": "Gemini API 키",
      "Groq API keys": "Groq API 키",
      "Clear saved Gemini keys": "저장된 Gemini 키 삭제",
      "Clear saved Groq keys": "저장된 Groq 키 삭제",
      "Vietnamese mode": "베트남어 모드",
      "Creates concise, natural and engaging Vietnamese titles for Chinese reuploads across review, film, animation, tech, entertainment, education and other content styles—without inventing facts.": "중국 리업로드의 리뷰, 영화, 애니메이션, 기술, 엔터테인먼트, 교육 등 다양한 콘텐츠에 사실을 추가하지 않고 자연스럽고 매력적인 베트남어 제목을 만듭니다.",
      "API keys are stored only in this browser's local extension storage and sent directly to the selected AI provider.": "API 키는 이 브라우저의 확장 프로그램 로컬 저장소에만 저장되고 선택한 AI 제공업체로 직접 전송됩니다.",
      "Save settings": "설정 저장",
      "Try again": "다시 시도",
      "Audio": "오디오",
      "Video": "동영상",
      "Open video": "동영상 열기",
      "No videos available for range selection.": "범위 선택할 동영상이 없습니다.",
      "No videos available for range unselect.": "범위 선택을 해제할 동영상이 없습니다.",
      "Enter valid start and end numbers.": "유효한 시작 번호와 종료 번호를 입력하세요.",
      "Start must be between 1 and {count}.": "시작 번호는 1에서 {count} 사이여야 합니다.",
      "Selected videos {start}-{end}.": "동영상 {start}-{end}을(를) 선택했습니다.",
      "Unselected videos {start}-{end}.": "동영상 {start}-{end}의 선택을 해제했습니다.",
      "Queue ready: {total} items.": "대기열 준비 완료: {total}개.",
      "Downloading {current}/{total}...": "다운로드 중 {current}/{total}...",
      "Downloaded {success}/{total}. Failed: {failed}.": "{success}/{total} 다운로드 완료. 실패: {failed}.",
      "Download failed on {current}/{total}. Failed: {failed}.": "{current}/{total}에서 실패. 총 실패: {failed}.",
      "Cancelling download queue...": "다운로드 대기열 취소 중...",
      "Queue cancelled. Success: {success}, failed: {failed}.": "대기열 취소됨. 성공: {success}, 실패: {failed}.",
      "Queue complete. Success: {success}, failed: {failed}.": "대기열 완료. 성공: {success}, 실패: {failed}.",
      "Preparing {total} {kind} files": "{total}개의 {kind} 파일 준비 중",
      "Downloading {current} of {total}": "다운로드 중 {current}/{total}",
      "Downloaded {completed} of {total}": "{completed}/{total} 다운로드 완료",
      "Continuing after a failed file": "실패한 파일 다음으로 계속합니다",
      "Stopping download queue...": "다운로드 대기열 중지 중...",
      "Download queue stopped": "다운로드 대기열 중지됨",
      "Download queue complete": "다운로드 대기열 완료",
      "Download progress": "다운로드 진행률",
      "Waiting for the next file...": "다음 파일 대기 중...",
      "{percentage}% / {success} successful / {failed} failed": "{percentage}% / 성공 {success} / 실패 {failed}",
      "{completed} of {total} files complete": "{completed}/{total}개 파일 완료",
      "video": "동영상",
      "audio": "오디오",
      "Loading Douyin videos...": "Douyin 동영상 로딩 중...",
      "Open Douyin Downloader": "Douyin Downloader 열기",
      "Videos could not be loaded": "동영상을 불러올 수 없습니다",
      "Preparing your video list": "동영상 목록 준비 중",
      "Fetching starts automatically when a Douyin profile opens.": "Douyin 프로필을 열면 자동으로 가져옵니다.",
      "No selected videos to show": "표시할 선택 동영상이 없습니다",
      "No videos match these filters": "필터와 일치하는 동영상이 없습니다",
      "Adjust or reset the filters to see more results.": "필터를 조정하거나 초기화하세요.",
      "No videos found": "동영상을 찾을 수 없습니다",
      "This profile does not have any downloadable videos yet.": "이 프로필에는 아직 다운로드 가능한 동영상이 없습니다.",
      "Preparing profile videos...": "프로필 동영상 준비 중...",
      "Could not find sec_user_id in the current URL.": "현재 URL에서 sec_user_id를 찾을 수 없습니다.",
      "Refreshing videos in the background...": "백그라운드에서 동영상 새로고침 중...",
      "Loading videos...": "동영상 로딩 중...",
      "Refreshing... {count} videos found": "새로고침 중... 동영상 {count}개 발견",
      "Loading... {count} videos found": "로딩 중... 동영상 {count}개 발견",
      "{count} videos loaded / Updated {time}": "동영상 {count}개 로드됨 / 업데이트 {time}",
      "Failed to fetch videos.": "동영상을 가져오지 못했습니다.",
      "Failed to refresh videos.": "동영상을 새로고침하지 못했습니다.",
      "Preparing {kind} files...": "{kind} 파일 준비 중...",
      "English": "영어",
      "Vietnamese": "베트남어",
      "Japanese": "일본어",
      "Korean": "한국어",
      "Chinese": "중국어",
      "Translating {count} filenames to {language}...": "파일명 {count}개를 {language}(으)로 번역 중...",
      "Filename translation failed.": "파일명 번역에 실패했습니다.",
      "Translated {translated}/{total} filenames with {provider}.": "{provider}로 파일명 {translated}/{total}개를 번역했습니다.",
      "No {kind} URLs available for the selected videos.": "선택한 동영상에 사용 가능한 {kind} URL이 없습니다.",
      "Starting {kind} queue...": "{kind} 대기열 시작 중...",
      "Failed to start download queue.": "다운로드 대기열을 시작하지 못했습니다.",
      "Metadata exported for {count} videos.": "동영상 {count}개의 메타데이터를 내보냈습니다.",
      "Metadata export failed.": "메타데이터 내보내기에 실패했습니다.",
      "Video links exported for {count} videos.": "동영상 링크 {count}개를 내보냈습니다.",
      "Link export failed.": "링크 내보내기에 실패했습니다.",
      "CSV exported for {count} videos.": "동영상 {count}개를 CSV로 내보냈습니다.",
      "CSV export failed.": "CSV 내보내기에 실패했습니다.",
      "Failed to cancel queue.": "대기열을 취소하지 못했습니다.",
      "Add at least one API key for the selected provider.": "선택한 제공업체의 API 키를 하나 이상 추가하세요.",
      "Settings saved locally.": "설정을 로컬에 저장했습니다.",
      "Failed to save settings.": "설정을 저장하지 못했습니다.",
      "{count} saved key(s) — leave blank to keep": "저장된 키 {count}개 — 유지하려면 비워 두세요",
      "{provider} keys will be removed when you save": "저장 시 {provider} 키가 삭제됩니다",
      "{provider} keys marked for removal. Click Save settings to confirm.": "{provider} 키를 삭제 대상으로 표시했습니다. 설정 저장을 눌러 확인하세요."
    },
    CN: {
      "Ready.": "就绪。",
      "Preparing download...": "正在准备下载...",
      "Select All (": "全选 (",
      "Download": "下载",
      "Stop": "停止",
      "Download Selected Videos": "下载所选视频",
      "Download Selected Audios": "下载所选音频",
      "Export Metadata JSON": "导出元数据 JSON",
      "Export Links TXT": "导出链接 TXT",
      "Export CSV": "导出 CSV",
      "Video layout": "视频布局",
      "List view": "列表视图",
      "Grid view": "网格视图",
      "Refresh": "刷新",
      "Refreshing...": "正在刷新...",
      "Search": "搜索",
      "Title or caption": "标题或文案",
      "Date posted": "发布日期",
      "Start": "开始",
      "to": "至",
      "End": "结束",
      "Post date start": "发布日期开始",
      "Post date end": "发布日期结束",
      "Show": "显示",
      "All videos": "全部视频",
      "Selected only": "仅已选择",
      "Sort": "排序",
      "Newest first": "最新优先",
      "Oldest first": "最早优先",
      "Title A-Z": "标题 A-Z",
      "Title Z-A": "标题 Z-A",
      "Reset Filters": "重置筛选",
      "Selection range": "选择范围",
      "Start #": "起始编号",
      "End #": "结束编号",
      "Selection range start": "选择范围起点",
      "Selection range end": "选择范围终点",
      "Select Range": "选择范围",
      "Unselect Range": "取消范围选择",
      "Select": "选择",
      "No.": "序号",
      "Cover": "封面",
      "Title / Caption": "标题 / 文案",
      "Date": "日期",
      "Actions": "操作",
      "Preparing video list...": "正在准备视频列表...",
      "Open settings": "打开设置",
      "Support the author": "支持作者",
      "Close": "关闭",
      "Buy me a coffee": "请我喝杯咖啡",
      "Author Zalo": "作者 Zalo",
      "Preferences": "偏好设置",
      "Settings": "设置",
      "Interface": "界面",
      "Choose the language used throughout the downloader.": "选择下载器全局使用的界面语言。",
      "Interface language": "界面语言",
      "Download settings": "下载设置",
      "Folder prefix and pacing for the download queue.": "设置下载目录前缀和队列间隔。",
      "File prefix": "文件前缀",
      "Download delay": "下载间隔",
      "AI filename translation": "AI 文件名翻译",
      "Only downloaded filenames change. Video titles in the list stay original.": "仅更改下载文件名，列表中的视频标题保持原文。",
      "Translate": "翻译",
      "Target language": "目标语言",
      "Filename output": "文件名语言",
      "AI provider": "AI 提供商",
      "Translation engine": "翻译引擎",
      "Auto — Gemini → Groq": "自动 — Gemini → Groq",
      "Gemini only": "仅 Gemini",
      "Groq only": "仅 Groq",
      "Gemini model": "Gemini 模型",
      "Groq model": "Groq 模型",
      "Available": "可用",
      "Retired — unavailable": "已停用 — 不可用",
      "Gemini 3.6 Flash · Recommended": "Gemini 3.6 Flash · 推荐",
      "Gemini 3.5 Flash-Lite · Fast": "Gemini 3.5 Flash-Lite · 快速",
      "Gemini 2.5 Flash · Until Oct 2026": "Gemini 2.5 Flash · 至 2026年10月",
      "Gemini 2.0 Flash · Retired": "Gemini 2.0 Flash · 已停用",
      "Gemini 2.0 Flash-Lite · Retired": "Gemini 2.0 Flash-Lite · 已停用",
      "Gemini 1.5 Flash · Retired": "Gemini 1.5 Flash · 已停用",
      "GPT-OSS 120B · Recommended": "GPT-OSS 120B · 推荐",
      "GPT-OSS 20B · Fast": "GPT-OSS 20B · 快速",
      "Qwen 3.6 27B · Preview": "Qwen 3.6 27B · 预览",
      "Llama 3.3 70B · Enterprise legacy": "Llama 3.3 70B · Enterprise 旧版",
      "Mixtral 8x7B · Retired": "Mixtral 8x7B · 已停用",
      "Gemma2 9B · Retired": "Gemma2 9B · 已停用",
      "API keys": "API 密钥",
      "Stored locally. Use Show keys to temporarily reveal saved keys; one key per line.": "仅保存在本地。使用“显示密钥”可临时查看；每行输入一个密钥。",
      "Show keys": "显示密钥",
      "Gemini API keys": "Gemini API 密钥",
      "Groq API keys": "Groq API 密钥",
      "Clear saved Gemini keys": "清除已保存的 Gemini 密钥",
      "Clear saved Groq keys": "清除已保存的 Groq 密钥",
      "Vietnamese mode": "越南语模式",
      "Creates concise, natural and engaging Vietnamese titles for Chinese reuploads across review, film, animation, tech, entertainment, education and other content styles—without inventing facts.": "为中国转载的评测、影视、动画、科技、娱乐、教育等内容生成简洁、自然且吸引人的越南语标题，同时不虚构事实。",
      "API keys are stored only in this browser's local extension storage and sent directly to the selected AI provider.": "API 密钥仅保存在此浏览器的扩展本地存储中，并直接发送给所选 AI 提供商。",
      "Save settings": "保存设置",
      "Try again": "重试",
      "Audio": "音频",
      "Video": "视频",
      "Open video": "打开视频",
      "No videos available for range selection.": "没有可供范围选择的视频。",
      "No videos available for range unselect.": "没有可取消范围选择的视频。",
      "Enter valid start and end numbers.": "请输入有效的起始和结束编号。",
      "Start must be between 1 and {count}.": "起始编号必须在 1 到 {count} 之间。",
      "Selected videos {start}-{end}.": "已选择视频 {start}-{end}。",
      "Unselected videos {start}-{end}.": "已取消选择视频 {start}-{end}。",
      "Queue ready: {total} items.": "队列已就绪：{total} 项。",
      "Downloading {current}/{total}...": "正在下载 {current}/{total}...",
      "Downloaded {success}/{total}. Failed: {failed}.": "已下载 {success}/{total}。失败：{failed}。",
      "Download failed on {current}/{total}. Failed: {failed}.": "在 {current}/{total} 下载失败。失败总数：{failed}。",
      "Cancelling download queue...": "正在取消下载队列...",
      "Queue cancelled. Success: {success}, failed: {failed}.": "队列已取消。成功：{success}，失败：{failed}。",
      "Queue complete. Success: {success}, failed: {failed}.": "队列已完成。成功：{success}，失败：{failed}。",
      "Preparing {total} {kind} files": "正在准备 {total} 个{kind}文件",
      "Downloading {current} of {total}": "正在下载 {current}/{total}",
      "Downloaded {completed} of {total}": "已下载 {completed}/{total}",
      "Continuing after a failed file": "文件失败，继续处理下一项",
      "Stopping download queue...": "正在停止下载队列...",
      "Download queue stopped": "下载队列已停止",
      "Download queue complete": "下载队列已完成",
      "Download progress": "下载进度",
      "Waiting for the next file...": "正在等待下一个文件...",
      "{percentage}% / {success} successful / {failed} failed": "{percentage}% / 成功 {success} / 失败 {failed}",
      "{completed} of {total} files complete": "已完成 {completed}/{total} 个文件",
      "video": "视频",
      "audio": "音频",
      "Loading Douyin videos...": "正在加载抖音视频...",
      "Open Douyin Downloader": "打开 Douyin Downloader",
      "Videos could not be loaded": "无法加载视频",
      "Preparing your video list": "正在准备视频列表",
      "Fetching starts automatically when a Douyin profile opens.": "打开抖音主页后会自动开始获取。",
      "No selected videos to show": "没有已选择的视频可显示",
      "No videos match these filters": "没有视频符合筛选条件",
      "Adjust or reset the filters to see more results.": "请调整或重置筛选条件。",
      "No videos found": "未找到视频",
      "This profile does not have any downloadable videos yet.": "此主页暂时没有可下载的视频。",
      "Preparing profile videos...": "正在准备主页视频...",
      "Could not find sec_user_id in the current URL.": "无法在当前 URL 中找到 sec_user_id。",
      "Refreshing videos in the background...": "正在后台刷新视频...",
      "Loading videos...": "正在加载视频...",
      "Refreshing... {count} videos found": "正在刷新... 已找到 {count} 个视频",
      "Loading... {count} videos found": "正在加载... 已找到 {count} 个视频",
      "{count} videos loaded / Updated {time}": "已加载 {count} 个视频 / 更新于 {time}",
      "Failed to fetch videos.": "获取视频失败。",
      "Failed to refresh videos.": "刷新视频失败。",
      "Preparing {kind} files...": "正在准备{kind}文件...",
      "English": "英语",
      "Vietnamese": "越南语",
      "Japanese": "日语",
      "Korean": "韩语",
      "Chinese": "中文",
      "Translating {count} filenames to {language}...": "正在将 {count} 个文件名翻译为{language}...",
      "Filename translation failed.": "文件名翻译失败。",
      "Translated {translated}/{total} filenames with {provider}.": "已使用 {provider} 翻译 {translated}/{total} 个文件名。",
      "No {kind} URLs available for the selected videos.": "所选视频没有可用的{kind} URL。",
      "Starting {kind} queue...": "正在启动{kind}队列...",
      "Failed to start download queue.": "无法启动下载队列。",
      "Metadata exported for {count} videos.": "已导出 {count} 个视频的元数据。",
      "Metadata export failed.": "元数据导出失败。",
      "Video links exported for {count} videos.": "已导出 {count} 个视频链接。",
      "Link export failed.": "链接导出失败。",
      "CSV exported for {count} videos.": "已导出 {count} 个视频的 CSV。",
      "CSV export failed.": "CSV 导出失败。",
      "Failed to cancel queue.": "无法取消队列。",
      "Add at least one API key for the selected provider.": "请为所选提供商添加至少一个 API 密钥。",
      "Settings saved locally.": "设置已保存到本地。",
      "Failed to save settings.": "无法保存设置。",
      "{count} saved key(s) — leave blank to keep": "已保存 {count} 个密钥 — 留空以保留",
      "{provider} keys will be removed when you save": "保存时将删除 {provider} 密钥",
      "{provider} keys marked for removal. Click Save settings to confirm.": "已标记删除 {provider} 密钥。点击“保存设置”确认。"
    }
  };

  Object.assign(UI_TRANSLATIONS.VI, {
    "Version": "Phiên bản",
    "Close settings": "Đóng cài đặt",
    "Select video {index}": "Chọn video {index}"
  });
  Object.assign(UI_TRANSLATIONS.JP, {
    "Version": "バージョン",
    "Close settings": "設定を閉じる",
    "Select video {index}": "動画 {index} を選択"
  });
  Object.assign(UI_TRANSLATIONS.KR, {
    "Version": "버전",
    "Close settings": "설정 닫기",
    "Select video {index}": "동영상 {index} 선택"
  });
  Object.assign(UI_TRANSLATIONS.CN, {
    "Version": "版本",
    "Close settings": "关闭设置",
    "Select video {index}": "选择视频 {index}"
  });

  const UI_TRANSLATION_KEYS = new Set(
    Object.values(UI_TRANSLATIONS).flatMap((dictionary) => Object.keys(dictionary))
  );

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

  function formatDisplayDate(dateString, locale = UI_LOCALES.EN) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat(locale, {
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
        if (error?.name === "AbortError") {
          throw error;
        }
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

  function normalizeApiKeys(value) {
    const source = Array.isArray(value) ? value : String(value || "").split(/[\s,;]+/);
    return Array.from(new Set(source.map((key) => String(key || "").trim()).filter(Boolean))).slice(0, 50);
  }

  class DouyinApiClient {
    constructor(secUserId, signal = null) {
      this.secUserId = secUserId;
      this.signal = signal;
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
        signal: this.signal,
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
        dateTo: "",
        scope: "all"
      };
      this.range = {
        start: "",
        end: ""
      };
      this.settings = {
        uiLanguage: "EN",
        downloadFolder: "douyin_downloads",
        queueDelayMs: CONFIG.QUEUE_DELAY_MS,
        viewMode: "list",
        sortBy: "newest",
        lastDownloadAction: "video",
        translationEnabled: false,
        translationLanguage: "VI",
        translationProvider: "auto",
        geminiModel: "gemini-3.6-flash",
        groqModel: "openai/gpt-oss-120b",
        geminiApiKeys: [],
        groqApiKeys: []
      };
      this.assets = {
        qrUrl: chrome.runtime.getURL("QR.png"),
        version: chrome.runtime.getManifest().version
      };
      this.isFetching = false;
      this.isDownloading = false;
      this.isPreparingDownload = false;
      this.hasFetched = false;
      this.fetchError = "";
      this.lastUpdatedAt = null;
      this.modalOpen = false;
      this.currentSecUserId = getSecUserIdFromUrl();
      this.activeUiLanguage = "EN";
      this.i18nTextNodes = new Map();
      this.i18nAttributes = new Map();
      this.currentStatusState = null;
      this.currentSettingsStatusState = null;
      this.lastProgressState = null;
      this.fetchRequestId = 0;
      this.fetchAbortController = null;
      this.ui = {};
      this.ensureTriggerButtonDebounced = debounce(() => this.ensureTriggerButton(), 180);
      this.persistUiPreferencesDebounced = debounce(() => {
        this.persistSettings().catch((error) => console.error("Failed to save UI preferences:", error));
      }, 250);
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
      this.autoFetchCurrentProfile();
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
                    <div class="dyex-brand-title-row">
                      <h2 id="dyex-title">Douyin Downloader</h2>
                      <span class="dyex-version" aria-label="Version ${escapeHtml(this.assets.version)}">v${escapeHtml(this.assets.version)}</span>
                    </div>
                    <p class="dyex-brand-subtitle">by Le Thanh Thai Duong</p>
                  </div>
                </div>
                <div class="dyex-header-actions">
                  <button id="${CONFIG.SETTINGS_TOGGLE_ID}" type="button" class="dyex-icon-button dyex-settings-toggle" aria-label="Open settings" aria-controls="${CONFIG.SETTINGS_DRAWER_ID}" aria-expanded="false">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 7h7M15 7h5M4 12h2M10 12h10M4 17h9M17 17h3" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"></path>
                      <circle cx="13" cy="7" r="2" stroke="currentColor" stroke-width="1.8"></circle>
                      <circle cx="8" cy="12" r="2" stroke="currentColor" stroke-width="1.8"></circle>
                      <circle cx="15" cy="17" r="2" stroke="currentColor" stroke-width="1.8"></circle>
                    </svg>
                  </button>
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

                <div id="${CONFIG.DOWNLOAD_PROGRESS_ID}" class="dyex-progress-card" role="status" aria-live="polite" hidden>
                  <div class="dyex-progress-copy">
                    <div>
                      <strong id="${CONFIG.DOWNLOAD_PROGRESS_TITLE_ID}">Preparing download...</strong>
                      <span id="${CONFIG.DOWNLOAD_PROGRESS_DETAIL_ID}"></span>
                    </div>
                    <span id="${CONFIG.DOWNLOAD_PROGRESS_STATS_ID}" class="dyex-progress-stats"></span>
                  </div>
                  <div class="dyex-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                    <span id="${CONFIG.DOWNLOAD_PROGRESS_BAR_ID}"></span>
                  </div>
                </div>

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
                      <div id="${CONFIG.VIEW_TOGGLE_ID}" class="dyex-view-toggle" role="group" aria-label="Video layout">
                        <button type="button" data-view-mode="list" aria-label="List view" aria-pressed="true">
                          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path d="M4 5h12M4 10h12M4 15h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                          </svg>
                        </button>
                        <button type="button" data-view-mode="grid" aria-label="Grid view" aria-pressed="false">
                          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <rect x="3.5" y="3.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"></rect>
                            <rect x="11.5" y="3.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"></rect>
                            <rect x="3.5" y="11.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"></rect>
                            <rect x="11.5" y="11.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"></rect>
                          </svg>
                        </button>
                      </div>
                      <button id="${CONFIG.FETCH_BUTTON_ID}" type="button" class="dyex-button dyex-button-primary dyex-refresh-button">
                        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <path d="M16.5 10a6.5 6.5 0 1 1-1.9-4.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                          <path d="M16.5 3.5v5h-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <span>Refresh</span>
                      </button>
                    </div>
                  </div>

                  <div class="dyex-subtoolbar">
                    <div class="dyex-filter-group">
                      <label class="dyex-field dyex-search-field">
                        <span>Search</span>
                        <input id="${CONFIG.SEARCH_INPUT_ID}" class="dyex-input dyex-search-input" type="search" placeholder="Title or caption">
                      </label>
                      <div class="dyex-field dyex-date-range-field">
                        <span>Date posted</span>
                        <div class="dyex-date-range-controls">
                          <label class="dyex-date-control">
                            <span>Start</span>
                            <input id="${CONFIG.DATE_FROM_ID}" class="dyex-input dyex-date-input" type="date" aria-label="Post date start">
                          </label>
                          <span class="dyex-date-range-separator" aria-hidden="true">to</span>
                          <label class="dyex-date-control">
                            <span>End</span>
                            <input id="${CONFIG.DATE_TO_ID}" class="dyex-input dyex-date-input" type="date" aria-label="Post date end">
                          </label>
                        </div>
                      </div>
                      <label class="dyex-field dyex-scope-field">
                        <span>Show</span>
                        <select id="${CONFIG.FILTER_SCOPE_ID}" class="dyex-input dyex-select-input">
                          <option value="all">All videos</option>
                          <option value="selected">Selected only</option>
                        </select>
                      </label>
                      <label class="dyex-field dyex-sort-field">
                        <span>Sort</span>
                        <select id="${CONFIG.SORT_SELECT_ID}" class="dyex-input dyex-select-input">
                          <option value="newest">Newest first</option>
                          <option value="oldest">Oldest first</option>
                          <option value="title-asc">Title A-Z</option>
                          <option value="title-desc">Title Z-A</option>
                        </select>
                      </label>
                      <button id="${CONFIG.RESET_FILTERS_ID}" type="button" class="dyex-button dyex-button-secondary">Reset Filters</button>
                    </div>
                    <div class="dyex-settings-group dyex-selection-group">
                      <div class="dyex-field dyex-selection-range-field">
                        <span>Selection range</span>
                        <div class="dyex-range-group">
                          <input id="${CONFIG.RANGE_START_ID}" class="dyex-input dyex-range-input" type="number" min="1" step="1" placeholder="Start #" aria-label="Selection range start">
                          <input id="${CONFIG.RANGE_END_ID}" class="dyex-input dyex-range-input" type="number" min="1" step="1" placeholder="End #" aria-label="Selection range end">
                          <button id="${CONFIG.APPLY_RANGE_ID}" type="button" class="dyex-button dyex-button-secondary">Select Range</button>
                          <button id="${CONFIG.CLEAR_RANGE_ID}" type="button" class="dyex-button dyex-button-tertiary">Unselect Range</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="${CONFIG.TABLE_WRAP_ID}" class="dyex-table-wrap">
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
                      <tbody id="${CONFIG.TABLE_BODY_ID}" data-i18n-ignore>
                        <tr class="dyex-empty-row">
                          <td colspan="6">Preparing video list...</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div id="${CONFIG.GRID_ID}" class="dyex-grid" data-i18n-ignore hidden></div>
                </div>
              </div>

              <div id="${CONFIG.SETTINGS_OVERLAY_ID}" class="dyex-settings-overlay" data-action="close-settings"></div>
              <aside id="${CONFIG.SETTINGS_DRAWER_ID}" class="dyex-settings-drawer" aria-labelledby="dyex-settings-title" aria-hidden="true">
                <div class="dyex-settings-header">
                  <div>
                    <p class="dyex-settings-eyebrow">Preferences</p>
                    <h3 id="dyex-settings-title">Settings</h3>
                  </div>
                  <button type="button" class="dyex-icon-button" data-action="close-settings" aria-label="Close settings">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                    </svg>
                  </button>
                </div>

                <div class="dyex-settings-content">
                  <section class="dyex-settings-section">
                    <div class="dyex-settings-section-heading">
                      <h4>Interface</h4>
                      <p>Choose the language used throughout the downloader.</p>
                    </div>
                    <label class="dyex-field">
                      <span>Interface language</span>
                      <select id="${CONFIG.UI_LANGUAGE_SELECT_ID}" class="dyex-input dyex-select-input" data-i18n-ignore>
                        <option value="EN">English</option>
                        <option value="VI">Tiếng Việt</option>
                        <option value="JP">日本語</option>
                        <option value="KR">한국어</option>
                        <option value="CN">简体中文</option>
                      </select>
                    </label>
                  </section>

                  <section class="dyex-settings-section">
                    <div class="dyex-settings-section-heading">
                      <h4>Download settings</h4>
                      <p>Folder prefix and pacing for the download queue.</p>
                    </div>
                    <div class="dyex-settings-grid">
                      <label class="dyex-field dyex-folder-field">
                        <span>File prefix</span>
                        <input id="${CONFIG.FOLDER_INPUT_ID}" class="dyex-input dyex-folder-input" type="text" placeholder="douyin_downloads">
                      </label>
                      <label class="dyex-field dyex-delay-field">
                        <span>Download delay</span>
                        <span class="dyex-delay-control">
                          <input id="${CONFIG.DELAY_INPUT_ID}" class="dyex-input dyex-delay-input" type="number" min="0" step="100">
                          <span>ms</span>
                        </span>
                      </label>
                    </div>
                  </section>

                  <section class="dyex-settings-section">
                    <div class="dyex-settings-section-heading dyex-settings-toggle-row">
                      <div>
                        <h4>AI filename translation</h4>
                        <p>Only downloaded filenames change. Video titles in the list stay original.</p>
                      </div>
                      <label class="dyex-switch">
                        <input id="${CONFIG.TRANSLATION_TOGGLE_ID}" type="checkbox">
                        <span aria-hidden="true"></span>
                        <em>Translate</em>
                      </label>
                    </div>

                    <div class="dyex-ai-primary-grid">
                      <label class="dyex-ai-select-card">
                        <span class="dyex-ai-select-heading">
                          <span class="dyex-ai-select-icon" aria-hidden="true">
                            <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"></circle><path d="M3.5 10h13M10 3c1.8 2 2.7 4.3 2.7 7S11.8 15 10 17c-1.8-2-2.7-4.3-2.7-7S8.2 5 10 3Z" stroke="currentColor" stroke-width="1.3"></path></svg>
                          </span>
                          <span class="dyex-ai-select-copy"><strong>Target language</strong><small>Filename output</small></span>
                        </span>
                        <span class="dyex-select-shell">
                          <select id="${CONFIG.LANGUAGE_SELECT_ID}" class="dyex-input dyex-select-input">
                            <option value="VI">VI — Tiếng Việt</option>
                            <option value="EN">EN — English</option>
                            <option value="JP">JP — 日本語</option>
                            <option value="KR">KR — 한국어</option>
                            <option value="CN">CN — 中文</option>
                          </select>
                        </span>
                      </label>
                      <label class="dyex-ai-select-card dyex-ai-provider-card">
                        <span class="dyex-ai-select-heading">
                          <span class="dyex-ai-select-icon" aria-hidden="true">
                            <svg viewBox="0 0 20 20" fill="none"><path d="m10 2 1.25 4.05a4 4 0 0 0 2.7 2.7L18 10l-4.05 1.25a4 4 0 0 0-2.7 2.7L10 18l-1.25-4.05a4 4 0 0 0-2.7-2.7L2 10l4.05-1.25a4 4 0 0 0 2.7-2.7L10 2Z" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"></path></svg>
                          </span>
                          <span class="dyex-ai-select-copy"><strong>AI provider</strong><small>Translation engine</small></span>
                        </span>
                        <span class="dyex-select-shell">
                          <select id="${CONFIG.PROVIDER_SELECT_ID}" class="dyex-input dyex-select-input">
                            <option value="auto">Auto — Gemini → Groq</option>
                            <option value="gemini">Gemini only</option>
                            <option value="groq">Groq only</option>
                          </select>
                        </span>
                      </label>
                    </div>
                    <div class="dyex-settings-grid dyex-ai-model-grid">
                      <label class="dyex-field">
                        <span>Gemini model</span>
                        <select id="${CONFIG.GEMINI_MODEL_SELECT_ID}" class="dyex-input dyex-select-input">
                          <optgroup label="Available">
                            <option value="gemini-3.6-flash">Gemini 3.6 Flash · Recommended</option>
                            <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
                            <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash-Lite · Fast</option>
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash · Until Oct 2026</option>
                          </optgroup>
                          <optgroup label="Retired — unavailable">
                            <option value="gemini-2.0-flash" disabled>Gemini 2.0 Flash · Retired</option>
                            <option value="gemini-2.0-flash-lite" disabled>Gemini 2.0 Flash-Lite · Retired</option>
                            <option value="gemini-1.5-flash" disabled>Gemini 1.5 Flash · Retired</option>
                          </optgroup>
                        </select>
                      </label>
                      <label class="dyex-field">
                        <span>Groq model</span>
                        <select id="${CONFIG.GROQ_MODEL_SELECT_ID}" class="dyex-input dyex-select-input">
                          <optgroup label="Available">
                            <option value="openai/gpt-oss-120b">GPT-OSS 120B · Recommended</option>
                            <option value="openai/gpt-oss-20b">GPT-OSS 20B · Fast</option>
                            <option value="qwen/qwen3.6-27b">Qwen 3.6 27B · Preview</option>
                            <option value="llama-3.3-70b-versatile">Llama 3.3 70B · Enterprise legacy</option>
                          </optgroup>
                          <optgroup label="Retired — unavailable">
                            <option value="mixtral-8x7b-32768" disabled>Mixtral 8x7B · Retired</option>
                            <option value="gemma2-9b-it" disabled>Gemma2 9B · Retired</option>
                          </optgroup>
                        </select>
                      </label>
                    </div>

                    <div class="dyex-api-heading">
                      <div>
                        <strong>API keys</strong>
                        <span>Stored locally. Use Show keys to temporarily reveal saved keys; one key per line.</span>
                      </div>
                      <label class="dyex-show-keys">
                        <input id="${CONFIG.SHOW_KEYS_ID}" type="checkbox">
                        <span>Show keys</span>
                      </label>
                    </div>

                    <label class="dyex-field dyex-api-field">
                      <span>Gemini API keys</span>
                      <textarea id="${CONFIG.GEMINI_KEYS_ID}" class="dyex-input dyex-api-keys is-masked" rows="4" spellcheck="false" autocomplete="off" placeholder="AIza...&#10;AIza..."></textarea>
                    </label>
                    <button type="button" class="dyex-clear-keys" data-action="clear-api-keys" data-provider="gemini">Clear saved Gemini keys</button>
                    <label class="dyex-field dyex-api-field">
                      <span>Groq API keys</span>
                      <textarea id="${CONFIG.GROQ_KEYS_ID}" class="dyex-input dyex-api-keys is-masked" rows="4" spellcheck="false" autocomplete="off" placeholder="gsk_...&#10;gsk_..."></textarea>
                    </label>
                    <button type="button" class="dyex-clear-keys" data-action="clear-api-keys" data-provider="groq">Clear saved Groq keys</button>

                    <div class="dyex-settings-note">
                      <strong>Vietnamese mode</strong>
                      <span>Creates concise, natural and engaging Vietnamese titles for Chinese reuploads across review, film, animation, tech, entertainment, education and other content styles—without inventing facts.</span>
                    </div>
                    <p class="dyex-settings-privacy">API keys are stored only in this browser's local extension storage and sent directly to the selected AI provider.</p>
                  </section>
                </div>

                <div class="dyex-settings-footer">
                  <span id="${CONFIG.SETTINGS_STATUS_ID}" class="dyex-settings-status" role="status" aria-live="polite"></span>
                  <button id="${CONFIG.SETTINGS_SAVE_ID}" type="button" class="dyex-button dyex-button-primary">Save settings</button>
                </div>
              </aside>
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
      this.ui.settingsToggle = document.getElementById(CONFIG.SETTINGS_TOGGLE_ID);
      this.ui.settingsDrawer = document.getElementById(CONFIG.SETTINGS_DRAWER_ID);
      this.ui.settingsOverlay = document.getElementById(CONFIG.SETTINGS_OVERLAY_ID);
      this.ui.settingsSaveButton = document.getElementById(CONFIG.SETTINGS_SAVE_ID);
      this.ui.settingsStatus = document.getElementById(CONFIG.SETTINGS_STATUS_ID);
      this.ui.uiLanguageSelect = document.getElementById(CONFIG.UI_LANGUAGE_SELECT_ID);
      this.ui.selectedCount = document.getElementById(CONFIG.SELECTED_COUNT_ID);
      this.ui.totalCount = document.getElementById(CONFIG.TOTAL_COUNT_ID);
      this.ui.searchInput = document.getElementById(CONFIG.SEARCH_INPUT_ID);
      this.ui.dateFromInput = document.getElementById(CONFIG.DATE_FROM_ID);
      this.ui.dateToInput = document.getElementById(CONFIG.DATE_TO_ID);
      this.ui.filterScope = document.getElementById(CONFIG.FILTER_SCOPE_ID);
      this.ui.sortSelect = document.getElementById(CONFIG.SORT_SELECT_ID);
      this.ui.viewToggle = document.getElementById(CONFIG.VIEW_TOGGLE_ID);
      this.ui.grid = document.getElementById(CONFIG.GRID_ID);
      this.ui.tableWrap = document.getElementById(CONFIG.TABLE_WRAP_ID);
      this.ui.resetFiltersButton = document.getElementById(CONFIG.RESET_FILTERS_ID);
      this.ui.rangeStartInput = document.getElementById(CONFIG.RANGE_START_ID);
      this.ui.rangeEndInput = document.getElementById(CONFIG.RANGE_END_ID);
      this.ui.applyRangeButton = document.getElementById(CONFIG.APPLY_RANGE_ID);
      this.ui.clearRangeButton = document.getElementById(CONFIG.CLEAR_RANGE_ID);
      this.ui.folderInput = document.getElementById(CONFIG.FOLDER_INPUT_ID);
      this.ui.delayInput = document.getElementById(CONFIG.DELAY_INPUT_ID);
      this.ui.translationToggle = document.getElementById(CONFIG.TRANSLATION_TOGGLE_ID);
      this.ui.languageSelect = document.getElementById(CONFIG.LANGUAGE_SELECT_ID);
      this.ui.providerSelect = document.getElementById(CONFIG.PROVIDER_SELECT_ID);
      this.ui.geminiModelSelect = document.getElementById(CONFIG.GEMINI_MODEL_SELECT_ID);
      this.ui.groqModelSelect = document.getElementById(CONFIG.GROQ_MODEL_SELECT_ID);
      this.ui.geminiKeysInput = document.getElementById(CONFIG.GEMINI_KEYS_ID);
      this.ui.groqKeysInput = document.getElementById(CONFIG.GROQ_KEYS_ID);
      this.ui.showKeysInput = document.getElementById(CONFIG.SHOW_KEYS_ID);
      this.ui.downloadProgress = document.getElementById(CONFIG.DOWNLOAD_PROGRESS_ID);
      this.ui.downloadProgressBar = document.getElementById(CONFIG.DOWNLOAD_PROGRESS_BAR_ID);
      this.ui.downloadProgressTitle = document.getElementById(CONFIG.DOWNLOAD_PROGRESS_TITLE_ID);
      this.ui.downloadProgressDetail = document.getElementById(CONFIG.DOWNLOAD_PROGRESS_DETAIL_ID);
      this.ui.downloadProgressStats = document.getElementById(CONFIG.DOWNLOAD_PROGRESS_STATS_ID);
    }

    bindEvents() {
      if (this.ui.modal.dataset.bound === "true") return;
      this.ui.modal.dataset.bound = "true";

      this.ui.fetchButton.addEventListener("click", () => this.handleFetchVideos());
      this.ui.cancelButton.addEventListener("click", () => this.handleCancelQueue());
      this.ui.searchInput.addEventListener("input", () => this.handleFilterChange());
      this.ui.dateFromInput.addEventListener("change", () => this.handleFilterChange());
      this.ui.dateToInput.addEventListener("change", () => this.handleFilterChange());
      this.ui.filterScope.addEventListener("change", () => this.handleFilterChange());
      this.ui.sortSelect.addEventListener("change", () => this.handleSortChange());
      this.ui.viewToggle.addEventListener("click", (event) => {
        const button = event.target.closest("[data-view-mode]");
        if (button) this.setViewMode(button.dataset.viewMode);
      });
      this.ui.resetFiltersButton.addEventListener("click", () => this.resetFilters());
      this.ui.applyRangeButton.addEventListener("click", () => this.applyRangeSelection());
      this.ui.clearRangeButton.addEventListener("click", () => this.clearRangeSelection());
      this.ui.settingsToggle.addEventListener("click", () => this.openSettings());
      this.ui.settingsSaveButton.addEventListener("click", () => this.handleSettingsChange());
      this.ui.uiLanguageSelect.addEventListener("change", () => this.applyUiLanguage(this.ui.uiLanguageSelect.value));
      this.ui.translationToggle.addEventListener("change", () => this.syncTranslationSettingsState());
      this.ui.providerSelect.addEventListener("change", () => this.syncTranslationSettingsState());
      this.ui.showKeysInput.addEventListener("change", () => this.syncApiKeyVisibility());
      [this.ui.geminiKeysInput, this.ui.groqKeysInput].forEach((input) => {
        input.addEventListener("input", () => {
          input.dataset.loadedSavedKeys = "false";
        });
      });

      this.ui.selectAll.addEventListener("change", (event) => {
        const checked = Boolean(event.target.checked);
        const filteredVideos = this.getFilteredVideos();
        if (checked) {
          filteredVideos.forEach((video) => this.selectedIds.add(video.id));
        } else {
          filteredVideos.forEach((video) => this.selectedIds.delete(video.id));
        }
        this.renderVideos();
        this.updateSelectionUi();
        this.updateControlState();
      });

      const handleSelectionChange = (event) => {
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

        this.renderVideos();
        this.updateSelectionUi();
        this.updateControlState();
      };

      this.ui.tableBody.addEventListener("change", handleSelectionChange);
      this.ui.grid.addEventListener("change", handleSelectionChange);

      this.ui.modal.addEventListener("click", (event) => {
        const retryButton = event.target.closest("[data-action='retry-fetch']");
        if (retryButton) {
          this.handleFetchVideos();
          return;
        }

        const closeButton = event.target.closest("[data-action='close-modal']");
        if (closeButton) {
          this.closeModal();
          return;
        }

        const closeSettingsButton = event.target.closest("[data-action='close-settings']");
        if (closeSettingsButton) {
          this.closeSettings();
          return;
        }

        const clearKeysButton = event.target.closest("[data-action='clear-api-keys']");
        if (clearKeysButton) {
          this.markApiKeysForRemoval(clearKeysButton.dataset.provider);
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
        this.settings.uiLanguage = Object.hasOwn(UI_LOCALES, saved.uiLanguage) ? saved.uiLanguage : "EN";
        this.settings.downloadFolder = sanitizeFolderPath(saved.downloadFolder || this.settings.downloadFolder);
        this.settings.queueDelayMs = normalizeDelay(saved.queueDelayMs);
        this.settings.viewMode = ["list", "grid"].includes(saved.viewMode) ? saved.viewMode : "list";
        this.settings.sortBy = ["newest", "oldest", "title-asc", "title-desc"].includes(saved.sortBy)
          ? saved.sortBy
          : "newest";
        this.settings.lastDownloadAction = ["video", "audio", "json", "txt", "csv"].includes(saved.lastDownloadAction)
          ? saved.lastDownloadAction
          : "video";
        this.settings.translationEnabled = Boolean(saved.translationEnabled);
        this.settings.translationLanguage = ["EN", "VI", "JP", "KR", "CN"].includes(saved.translationLanguage)
          ? saved.translationLanguage
          : "VI";
        this.settings.translationProvider = ["auto", "gemini", "groq"].includes(saved.translationProvider)
          ? saved.translationProvider
          : "auto";
        this.settings.geminiModel = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-2.5-flash"].includes(saved.geminiModel)
          ? saved.geminiModel
          : "gemini-3.6-flash";
        this.settings.groqModel = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b", "llama-3.3-70b-versatile"].includes(saved.groqModel)
          ? saved.groqModel
          : "openai/gpt-oss-120b";
        this.settings.geminiApiKeys = normalizeApiKeys(saved.geminiApiKeys);
        this.settings.groqApiKeys = normalizeApiKeys(saved.groqApiKeys);
        this.filters.search = String(saved.filters?.search || "");
        this.filters.dateFrom = String(saved.filters?.dateFrom || "");
        this.filters.dateTo = String(saved.filters?.dateTo || "");
        this.filters.scope = "all";
      } catch (error) {
        console.error("Failed to load settings:", error);
      }

      this.syncSettingsInputs();
      this.ui.searchInput.value = this.filters.search;
      this.ui.dateFromInput.value = this.filters.dateFrom;
      this.ui.dateToInput.value = this.filters.dateTo;
      this.ui.filterScope.value = this.filters.scope;
      this.ui.sortSelect.value = this.settings.sortBy;
      this.syncViewModeUi();
      this.syncDownloadPreferenceUi();
    }

    async persistSettings() {
      await storageSet({
        [CONFIG.STORAGE_KEY]: {
          downloadFolder: this.settings.downloadFolder,
          uiLanguage: this.settings.uiLanguage,
          queueDelayMs: this.settings.queueDelayMs,
          viewMode: this.settings.viewMode,
          sortBy: this.settings.sortBy,
          lastDownloadAction: this.settings.lastDownloadAction,
          translationEnabled: this.settings.translationEnabled,
          translationLanguage: this.settings.translationLanguage,
          translationProvider: this.settings.translationProvider,
          geminiModel: this.settings.geminiModel,
          groqModel: this.settings.groqModel,
          geminiApiKeys: [...this.settings.geminiApiKeys],
          groqApiKeys: [...this.settings.groqApiKeys],
          filters: { ...this.filters }
        }
      });
    }

    async handleSettingsChange() {
      const enteredGeminiKeys = normalizeApiKeys(this.ui.geminiKeysInput.value);
      const enteredGroqKeys = normalizeApiKeys(this.ui.groqKeysInput.value);
      const nextSettings = {
        uiLanguage: Object.hasOwn(UI_LOCALES, this.ui.uiLanguageSelect.value) ? this.ui.uiLanguageSelect.value : "EN",
        downloadFolder: sanitizeFolderPath(this.ui.folderInput.value) || "douyin_downloads",
        queueDelayMs: normalizeDelay(this.ui.delayInput.value),
        translationEnabled: Boolean(this.ui.translationToggle.checked),
        translationLanguage: this.ui.languageSelect.value,
        translationProvider: this.ui.providerSelect.value,
        geminiModel: this.ui.geminiModelSelect.value,
        groqModel: this.ui.groqModelSelect.value,
        geminiApiKeys: this.ui.geminiKeysInput.dataset.clearRequested === "true"
          ? []
          : enteredGeminiKeys.length
            ? enteredGeminiKeys
            : this.settings.geminiApiKeys,
        groqApiKeys: this.ui.groqKeysInput.dataset.clearRequested === "true"
          ? []
          : enteredGroqKeys.length
            ? enteredGroqKeys
            : this.settings.groqApiKeys
      };

      const hasGeminiKeys = nextSettings.geminiApiKeys.length > 0;
      const hasGroqKeys = nextSettings.groqApiKeys.length > 0;
      if (nextSettings.translationEnabled) {
        const provider = nextSettings.translationProvider;
        const valid = provider === "auto"
          ? hasGeminiKeys || hasGroqKeys
          : provider === "gemini"
            ? hasGeminiKeys
            : hasGroqKeys;
        if (!valid) {
          this.setSettingsStatusKey("Add at least one API key for the selected provider.", {}, "error");
          return;
        }
      }

      Object.assign(this.settings, nextSettings);
      this.syncSettingsInputs();
      try {
        await this.persistSettings();
        this.setSettingsStatusKey("Settings saved locally.", {}, "success");
      } catch (error) {
        console.error("Failed to save settings:", error);
        this.setSettingsStatusKey("Failed to save settings.", {}, "error");
      }
    }

    syncSettingsInputs() {
      this.ui.uiLanguageSelect.value = this.settings.uiLanguage;
      this.applyUiLanguage(this.settings.uiLanguage);
      this.ui.folderInput.value = this.settings.downloadFolder;
      this.ui.delayInput.value = String(this.settings.queueDelayMs);
      this.ui.translationToggle.checked = this.settings.translationEnabled;
      this.ui.languageSelect.value = this.settings.translationLanguage;
      this.ui.providerSelect.value = this.settings.translationProvider;
      this.ui.geminiModelSelect.value = this.settings.geminiModel;
      this.ui.groqModelSelect.value = this.settings.groqModel;
      this.ui.geminiKeysInput.value = "";
      this.ui.groqKeysInput.value = "";
      this.ui.geminiKeysInput.dataset.clearRequested = "false";
      this.ui.groqKeysInput.dataset.clearRequested = "false";
      this.ui.geminiKeysInput.dataset.loadedSavedKeys = "false";
      this.ui.groqKeysInput.dataset.loadedSavedKeys = "false";
      this.ui.showKeysInput.checked = false;
      this.ui.geminiKeysInput.placeholder = this.settings.geminiApiKeys.length
        ? this.t("{count} saved key(s) — leave blank to keep", { count: this.settings.geminiApiKeys.length })
        : "AIza...\nAIza...";
      this.ui.groqKeysInput.placeholder = this.settings.groqApiKeys.length
        ? this.t("{count} saved key(s) — leave blank to keep", { count: this.settings.groqApiKeys.length })
        : "gsk_...\ngsk_...";
      this.syncTranslationSettingsState();
      this.syncApiKeyVisibility();
    }

    syncTranslationSettingsState() {
      const enabled = Boolean(this.ui.translationToggle.checked);
      const provider = this.ui.providerSelect.value;
      this.ui.settingsDrawer.dataset.translationEnabled = String(enabled);
      this.ui.geminiModelSelect.disabled = !enabled || provider === "groq";
      this.ui.groqModelSelect.disabled = !enabled || provider === "gemini";
    }

    syncApiKeyVisibility() {
      const showKeys = Boolean(this.ui.showKeysInput.checked);
      const keyInputs = [
        [this.ui.geminiKeysInput, this.settings.geminiApiKeys],
        [this.ui.groqKeysInput, this.settings.groqApiKeys]
      ];

      keyInputs.forEach(([input, savedKeys]) => {
        if (
          showKeys &&
          !input.value &&
          input.dataset.clearRequested !== "true" &&
          savedKeys.length
        ) {
          input.value = savedKeys.join("\n");
          input.dataset.loadedSavedKeys = "true";
        } else if (!showKeys && input.dataset.loadedSavedKeys === "true") {
          input.value = "";
          input.dataset.loadedSavedKeys = "false";
        }
        input.classList.toggle("is-masked", !showKeys);
      });
    }

    setSettingsStatus(message, kind = "info") {
      this.currentSettingsStatusState = null;
      this.ui.settingsStatus.textContent = message;
      this.ui.settingsStatus.dataset.kind = kind;
    }

    setSettingsStatusKey(key, variables = {}, kind = "info") {
      this.currentSettingsStatusState = { key, variables: { ...variables }, kind };
      this.ui.settingsStatus.textContent = this.t(key, variables);
      this.ui.settingsStatus.dataset.kind = kind;
    }

    markApiKeysForRemoval(provider) {
      const input = provider === "gemini" ? this.ui.geminiKeysInput : this.ui.groqKeysInput;
      const label = provider === "gemini" ? "Gemini" : "Groq";
      input.value = "";
      input.dataset.clearRequested = "true";
      input.dataset.loadedSavedKeys = "false";
      input.placeholder = this.t("{provider} keys will be removed when you save", { provider: label });
      this.setSettingsStatusKey(
        "{provider} keys marked for removal. Click Save settings to confirm.",
        { provider: label },
        "info"
      );
    }

    openSettings() {
      if (this.ui.settingsDrawer.classList.contains("is-open")) return;
      this.closeDownloadMenu();
      this.closeDonatePopup();
      this.syncSettingsInputs();
      this.setSettingsStatus("");
      this.ui.settingsDrawer.setAttribute("aria-hidden", "false");
      this.ui.settingsToggle.setAttribute("aria-expanded", "true");
      this.ui.settingsOverlay.classList.add("is-open");
      this.ui.settingsDrawer.classList.add("is-open");
      window.setTimeout(() => {
        if (this.ui.settingsDrawer.classList.contains("is-open")) {
          this.ui.folderInput.focus({ preventScroll: true });
        }
      }, 340);
    }

    closeSettings() {
      if (!this.ui.settingsDrawer?.classList.contains("is-open")) return;
      this.syncSettingsInputs();
      this.ui.settingsOverlay.classList.remove("is-open");
      this.ui.settingsDrawer.classList.remove("is-open");
      this.ui.settingsDrawer.setAttribute("aria-hidden", "true");
      this.ui.settingsToggle.setAttribute("aria-expanded", "false");
    }

    handleFilterChange() {
      this.filters.search = this.ui.searchInput.value.trim();
      this.filters.dateFrom = this.ui.dateFromInput.value;
      this.filters.dateTo = this.ui.dateToInput.value;
      this.filters.scope = this.ui.filterScope.value;
      this.renderVideos();
      this.updateSelectionUi();
      this.updateControlState();
      this.persistUiPreferencesDebounced();
    }

    handleSortChange() {
      this.settings.sortBy = this.ui.sortSelect.value;
      this.renderVideos();
      this.updateSelectionUi();
      this.persistUiPreferencesDebounced();
    }

    setViewMode(viewMode) {
      if (!["list", "grid"].includes(viewMode) || viewMode === this.settings.viewMode) return;
      this.settings.viewMode = viewMode;
      this.syncViewModeUi();
      this.renderVideos();
      this.persistUiPreferencesDebounced();
    }

    syncViewModeUi() {
      const viewMode = this.settings.viewMode;
      this.ui.tableWrap.hidden = viewMode !== "list";
      this.ui.grid.hidden = viewMode !== "grid";
      this.ui.viewToggle.querySelectorAll("[data-view-mode]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.viewMode === viewMode));
      });
    }

    syncDownloadPreferenceUi() {
      this.ui.downloadMenu.querySelectorAll("[data-download-action]").forEach((button) => {
        button.dataset.preferred = String(button.dataset.downloadAction === this.settings.lastDownloadAction);
      });
    }

    resetFilters() {
      this.filters.search = "";
      this.filters.dateFrom = "";
      this.filters.dateTo = "";
      this.filters.scope = "all";
      this.ui.searchInput.value = "";
      this.ui.dateFromInput.value = "";
      this.ui.dateToInput.value = "";
      this.ui.filterScope.value = "all";
      this.renderVideos();
      this.updateSelectionUi();
      this.updateControlState();
      this.persistUiPreferencesDebounced();
    }

    applyRangeSelection() {
      const filteredVideos = this.getFilteredVideos();
      if (!filteredVideos.length) {
        this.setStatusKey("No videos available for range selection.", {}, "error");
        return;
      }

      const start = Number(this.ui.rangeStartInput.value);
      const end = Number(this.ui.rangeEndInput.value);

      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        this.setStatusKey("Enter valid start and end numbers.", {}, "error");
        return;
      }

      const normalizedStart = Math.max(1, Math.min(start, end));
      const normalizedEnd = Math.min(filteredVideos.length, Math.max(start, end));

      if (normalizedStart > filteredVideos.length) {
        this.setStatusKey("Start must be between 1 and {count}.", { count: filteredVideos.length }, "error");
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
      this.renderVideos();
      this.updateSelectionUi();
      this.updateControlState();
      this.setStatusKey(
        "Selected videos {start}-{end}.",
        { start: normalizedStart, end: normalizedEnd },
        "success"
      );
    }

    clearRangeSelection() {
      const filteredVideos = this.getFilteredVideos();
      if (!filteredVideos.length) {
        this.setStatusKey("No videos available for range unselect.", {}, "error");
        return;
      }

      const start = Number(this.ui.rangeStartInput.value);
      const end = Number(this.ui.rangeEndInput.value);

      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        this.setStatusKey("Enter valid start and end numbers.", {}, "error");
        return;
      }

      const normalizedStart = Math.max(1, Math.min(start, end));
      const normalizedEnd = Math.min(filteredVideos.length, Math.max(start, end));

      if (normalizedStart > filteredVideos.length) {
        this.setStatusKey("Start must be between 1 and {count}.", { count: filteredVideos.length }, "error");
        return;
      }

      for (let index = normalizedStart - 1; index < normalizedEnd; index += 1) {
        this.selectedIds.delete(filteredVideos[index].id);
      }

      this.range.start = String(normalizedStart);
      this.range.end = String(normalizedEnd);
      this.ui.rangeStartInput.value = this.range.start;
      this.ui.rangeEndInput.value = this.range.end;
      this.renderVideos();
      this.updateSelectionUi();
      this.updateControlState();
      this.setStatusKey(
        "Unselected videos {start}-{end}.",
        { start: normalizedStart, end: normalizedEnd },
        "success"
      );
    }

    startObservers() {
      this.routeTimer = window.setInterval(() => {
        const nextSecUserId = getSecUserIdFromUrl();
        if (nextSecUserId === this.currentSecUserId) return;
        this.currentSecUserId = nextSecUserId;
        this.resetState();
        this.ensureTriggerButton();
        this.syncQueueStatus().finally(() => {
          if (nextSecUserId === this.currentSecUserId) {
            this.autoFetchCurrentProfile();
          }
        });
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
        if (this.ui.settingsDrawer.classList.contains("is-open")) {
          this.closeSettings();
          return;
        }
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
      this.isPreparingDownload = false;
      this.updateDownloadProgress(payload, phase);

      if (phase === "queued") {
        this.setStatusKey("Queue ready: {total} items.", { total: payload.total }, "info", true);
      } else if (phase === "downloading") {
        this.setStatusKey(
          "Downloading {current}/{total}...",
          { current: Number(payload.currentIndex || 0) + 1, total: payload.total },
          "info",
          true
        );
      } else if (phase === "item-complete") {
        this.setStatusKey(
          "Downloaded {success}/{total}. Failed: {failed}.",
          { success: payload.successCount, total: payload.total, failed: payload.failedCount },
          "success",
          true
        );
      } else if (phase === "item-failed") {
        this.setStatusKey(
          "Download failed on {current}/{total}. Failed: {failed}.",
          { current: payload.currentIndex, total: payload.total, failed: payload.failedCount },
          "error",
          true
        );
      } else if (phase === "cancelling") {
        this.setStatusKey("Cancelling download queue...", {}, "info", true);
      } else if (phase === "cancelled") {
        this.setStatusKey(
          "Queue cancelled. Success: {success}, failed: {failed}.",
          { success: payload.successCount, failed: payload.failedCount },
          payload.failedCount ? "error" : "info"
        );
      } else if (phase === "completed") {
        this.setStatusKey(
          "Queue complete. Success: {success}, failed: {failed}.",
          { success: payload.successCount, failed: payload.failedCount },
          payload.failedCount ? "error" : "success"
        );
      }

      this.updateControlState();
    }

    updateDownloadProgress(payload, phase) {
      this.lastProgressState = { payload: { ...payload }, phase };
      const total = Math.max(0, Number(payload.total) || 0);
      if (!total) {
        this.ui.downloadProgress.hidden = true;
        return;
      }

      const successCount = Math.max(0, Number(payload.successCount) || 0);
      const failedCount = Math.max(0, Number(payload.failedCount) || 0);
      const completedCount = Math.min(total, successCount + failedCount);
      const isFinished = ["completed", "cancelled"].includes(phase);
      const percentage = isFinished && phase === "completed"
        ? 100
        : Math.round((completedCount / total) * 100);
      const kindLabel = this.t(payload.kind === "audio" ? "audio" : "video");
      const titleByPhase = {
        queued: this.t("Preparing {total} {kind} files", { total, kind: kindLabel }),
        downloading: this.t("Downloading {current} of {total}", { current: Math.min(total, completedCount + 1), total }),
        "item-complete": this.t("Downloaded {completed} of {total}", { completed: completedCount, total }),
        "item-failed": this.t("Continuing after a failed file"),
        cancelling: this.t("Stopping download queue..."),
        cancelled: this.t("Download queue stopped"),
        completed: this.t("Download queue complete")
      };
      const activeFilename = String(payload.activeItem?.filename || "").split(/[\\/]/).pop();

      this.ui.downloadProgress.hidden = false;
      this.ui.downloadProgress.dataset.phase = phase;
      this.ui.downloadProgressTitle.textContent = titleByPhase[phase] || this.t("Download progress");
      this.ui.downloadProgressDetail.textContent = activeFilename || (isFinished ? "" : this.t("Waiting for the next file..."));
      this.ui.downloadProgressStats.textContent = this.t(
        "{percentage}% / {success} successful / {failed} failed",
        { percentage, success: successCount, failed: failedCount }
      );
      this.ui.downloadProgressBar.style.width = `${percentage}%`;
      const track = this.ui.downloadProgressBar.parentElement;
      track.setAttribute("aria-valuenow", String(percentage));
      track.setAttribute("aria-valuetext", this.t(
        "{completed} of {total} files complete",
        { completed: completedCount, total }
      ));
    }

    createTriggerButton() {
      const button = createElement("button", {
        id: CONFIG.TRIGGER_ID,
        type: "button",
        title: this.t("Open Douyin Downloader"),
        "aria-label": this.t("Open Douyin Downloader"),
        html: `
          <svg class="dyex-trigger-download-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 4v11" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            <path d="m7 11 5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M5 19h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
          </svg>
          <svg class="dyex-trigger-loading-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 12a8 8 0 1 1-2.34-5.66" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            <path d="M20 4v6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        `
      });

      this.syncTriggerState(button);

      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.openModal();
      });

      return button;
    }

    ensureTriggerButton() {
      const existing = document.getElementById(CONFIG.TRIGGER_ID);
      if (!/\/user\/[^/?#]+/.test(window.location.pathname)) {
        if (existing) existing.remove();
        return;
      }

      const anchor = findProfileTabAnchor();
      if (!anchor || !anchor.parentElement || !anchor.isConnected) return;

      if (existing && existing.parentElement === anchor.parentElement && existing.previousElementSibling === anchor) {
        this.syncTriggerState(existing);
        return;
      }

      if (existing) existing.remove();
      anchor.insertAdjacentElement("afterend", this.createTriggerButton());
    }

    syncTriggerState(trigger = document.getElementById(CONFIG.TRIGGER_ID)) {
      if (!trigger) return;
      const isBusy = Boolean(this.isFetching);
      trigger.dataset.busy = String(isBusy);
      trigger.setAttribute("aria-busy", String(isBusy));
      trigger.title = this.t(isBusy ? "Loading Douyin videos..." : "Open Douyin Downloader");
      trigger.setAttribute("aria-label", trigger.title);
    }

    autoFetchCurrentProfile() {
      if (!this.currentSecUserId || this.isFetching || this.isDownloading) return;
      this.handleFetchVideos({ secUserId: this.currentSecUserId });
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
      this.closeSettings();
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

    t(key, variables = {}) {
      const template = UI_TRANSLATIONS[this.activeUiLanguage]?.[key] || key;
      return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, name) => {
        if (!Object.hasOwn(variables, name)) return match;
        const value = variables[name];
        return typeof value === "string" && UI_TRANSLATION_KEYS.has(value)
          ? UI_TRANSLATIONS[this.activeUiLanguage]?.[value] || value
          : String(value);
      });
    }

    translateUiTree(root) {
      if (!root) return;
      const shouldIgnore = (element) => Boolean(element?.closest?.("[data-i18n-ignore]"));
      const translateTextNode = (node) => {
        if (!node?.parentElement || shouldIgnore(node.parentElement)) return;
        let record = this.i18nTextNodes.get(node);
        if (!record) {
          const source = node.textContent || "";
          const key = source.trim();
          if (!key || !UI_TRANSLATION_KEYS.has(key)) return;
          const start = source.indexOf(key);
          record = {
            key,
            prefix: source.slice(0, start),
            suffix: source.slice(start + key.length)
          };
          this.i18nTextNodes.set(node, record);
        }
        node.textContent = `${record.prefix}${this.t(record.key)}${record.suffix}`;
      };

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let textNode = walker.nextNode();
      while (textNode) {
        translateTextNode(textNode);
        textNode = walker.nextNode();
      }

      const elements = [root, ...(root.querySelectorAll ? root.querySelectorAll("*") : [])];
      elements.forEach((element) => {
        if (!(element instanceof Element) || shouldIgnore(element)) return;
        let attributeRecords = this.i18nAttributes.get(element);
        if (!attributeRecords) {
          attributeRecords = new Map();
          this.i18nAttributes.set(element, attributeRecords);
        }
        ["placeholder", "aria-label", "title", "label"].forEach((attribute) => {
          let key = attributeRecords.get(attribute);
          if (!key) {
            const source = element.getAttribute(attribute);
            if (!source || !UI_TRANSLATION_KEYS.has(source)) return;
            key = source;
            attributeRecords.set(attribute, key);
          }
          element.setAttribute(attribute, this.t(key));
        });
      });
    }

    applyUiLanguage(language) {
      this.activeUiLanguage = Object.hasOwn(UI_LOCALES, language) ? language : "EN";
      if (this.ui.uiLanguageSelect) this.ui.uiLanguageSelect.value = this.activeUiLanguage;
      if (this.ui.modal) {
        this.ui.modal.lang = UI_LOCALES[this.activeUiLanguage];
        this.translateUiTree(this.ui.modal);
        const version = this.ui.modal.querySelector(".dyex-version");
        if (version) version.setAttribute("aria-label", `${this.t("Version")} ${this.assets.version}`);
      }
      const trigger = document.getElementById(CONFIG.TRIGGER_ID);
      if (trigger) {
        trigger.title = this.t("Open Douyin Downloader");
        trigger.setAttribute("aria-label", this.t("Open Douyin Downloader"));
      }
      if (this.currentStatusState) {
        const variables = { ...this.currentStatusState.variables };
        if (this.currentStatusState.key === "{count} videos loaded / Updated {time}" && this.lastUpdatedAt) {
          variables.time = new Intl.DateTimeFormat(UI_LOCALES[this.activeUiLanguage], {
            hour: "2-digit",
            minute: "2-digit"
          }).format(this.lastUpdatedAt);
        }
        this.setStatusKey(
          this.currentStatusState.key,
          variables,
          this.currentStatusState.kind,
          this.currentStatusState.busy
        );
      }
      if (this.currentSettingsStatusState) {
        this.setSettingsStatusKey(
          this.currentSettingsStatusState.key,
          this.currentSettingsStatusState.variables,
          this.currentSettingsStatusState.kind
        );
      }
      if (this.lastProgressState) {
        this.updateDownloadProgress(this.lastProgressState.payload, this.lastProgressState.phase);
      }
      if (this.ui.geminiKeysInput && this.ui.groqKeysInput) {
        const syncPlaceholder = (input, provider, savedKeys, fallback) => {
          if (input.dataset.clearRequested === "true") {
            input.placeholder = this.t("{provider} keys will be removed when you save", { provider });
          } else {
            input.placeholder = savedKeys.length
              ? this.t("{count} saved key(s) — leave blank to keep", { count: savedKeys.length })
              : fallback;
          }
        };
        syncPlaceholder(this.ui.geminiKeysInput, "Gemini", this.settings.geminiApiKeys, "AIza...\nAIza...");
        syncPlaceholder(this.ui.groqKeysInput, "Groq", this.settings.groqApiKeys, "gsk_...\ngsk_...");
      }
      if (this.ui.tableBody && this.ui.grid) this.renderVideos();
      if (this.ui.fetchButton) this.updateControlState();
    }

    setStatus(message, kind = "info", busy = false) {
      this.currentStatusState = null;
      this.ui.status.textContent = message;
      this.ui.status.dataset.kind = kind;
      this.ui.status.dataset.busy = String(Boolean(busy));
    }

    setStatusKey(key, variables = {}, kind = "info", busy = false) {
      this.currentStatusState = { key, variables: { ...variables }, kind, busy };
      this.ui.status.textContent = this.t(key, variables);
      this.ui.status.dataset.kind = kind;
      this.ui.status.dataset.busy = String(Boolean(busy));
    }

    setErrorStatus(error, fallbackKey) {
      const message = String(error?.message || "").trim();
      if (message && UI_TRANSLATION_KEYS.has(message)) {
        this.setStatusKey(message, {}, "error");
        return;
      }
      if (message) {
        this.setStatus(message, "error");
        return;
      }
      this.setStatusKey(fallbackKey, {}, "error");
    }

    getFilteredVideos() {
      const search = this.filters.search.toLowerCase();
      const fromTime = this.filters.dateFrom ? new Date(`${this.filters.dateFrom}T00:00:00`).getTime() : null;
      const toTime = this.filters.dateTo ? new Date(`${this.filters.dateTo}T23:59:59`).getTime() : null;

      const filteredVideos = this.videos.filter((video) => {
        if (this.filters.scope === "selected" && !this.selectedIds.has(video.id)) {
          return false;
        }

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

      return filteredVideos.sort((left, right) => {
        if (this.settings.sortBy === "oldest") {
          return (new Date(left.createTime).getTime() || 0) - (new Date(right.createTime).getTime() || 0);
        }
        if (this.settings.sortBy === "title-asc") {
          return left.title.localeCompare(right.title, undefined, { sensitivity: "base" });
        }
        if (this.settings.sortBy === "title-desc") {
          return right.title.localeCompare(left.title, undefined, { sensitivity: "base" });
        }
        return (new Date(right.createTime).getTime() || 0) - (new Date(left.createTime).getTime() || 0);
      });
    }

    updateSelectionUi() {
      const filteredVideos = this.getFilteredVideos();
      const filteredIds = new Set(filteredVideos.map((video) => video.id));
      const total = this.videos.length;
      const selected = this.selectedIds.size;
      const selectedVisibleCount = Array.from(this.selectedIds).filter((id) => filteredIds.has(id)).length;
      this.ui.selectedCount.textContent = String(selected);
      this.ui.totalCount.textContent = String(total);
      this.ui.selectAll.checked = filteredVideos.length > 0 && selectedVisibleCount === filteredVideos.length;
      this.ui.selectAll.indeterminate = selectedVisibleCount > 0 && selectedVisibleCount < filteredVideos.length;
    }

    updateControlState() {
      const hasSelection = this.selectedIds.size > 0;
      this.ui.fetchButton.disabled = this.isFetching || this.isDownloading;
      this.ui.fetchButton.dataset.busy = String(this.isFetching);
      const refreshLabel = this.ui.fetchButton.querySelector("span");
      if (refreshLabel) refreshLabel.textContent = this.t(this.isFetching ? "Refreshing..." : "Refresh");
      this.ui.selectAll.disabled = this.isDownloading || !this.videos.length;
      this.ui.downloadButton.disabled = this.isDownloading || !hasSelection;
      this.ui.cancelButton.disabled = !this.isDownloading || this.isPreparingDownload;
      this.ui.rangeStartInput.disabled = this.isDownloading;
      this.ui.rangeEndInput.disabled = this.isDownloading;
      this.ui.applyRangeButton.disabled = this.isDownloading;
      this.ui.clearRangeButton.disabled = this.isDownloading;
      this.ui.folderInput.disabled = this.isDownloading;
      this.ui.delayInput.disabled = this.isDownloading;
      this.ui.settingsSaveButton.disabled = this.isDownloading;
      this.syncTriggerState();
    }

    getEmptyState() {
      if (this.fetchError) {
        return {
          title: this.t("Videos could not be loaded"),
          detail: UI_TRANSLATION_KEYS.has(this.fetchError) ? this.t(this.fetchError) : this.fetchError,
          action: `<button type="button" class="dyex-button dyex-button-primary" data-action="retry-fetch">${escapeHtml(this.t("Try again"))}</button>`
        };
      }
      if (!this.hasFetched) {
        return {
          title: this.t("Preparing your video list"),
          detail: this.t("Fetching starts automatically when a Douyin profile opens."),
          action: ""
        };
      }
      if (this.videos.length) {
        return {
          title: this.t(this.filters.scope === "selected" ? "No selected videos to show" : "No videos match these filters"),
          detail: this.t("Adjust or reset the filters to see more results."),
          action: ""
        };
      }
      return {
        title: this.t("No videos found"),
        detail: this.t("This profile does not have any downloadable videos yet."),
        action: ""
      };
    }

    renderSkeletons() {
      const rows = Array.from({ length: 5 }, () => `
        <tr class="dyex-skeleton-row" aria-hidden="true">
          <td><span class="dyex-skeleton dyex-skeleton-check"></span></td>
          <td><span class="dyex-skeleton dyex-skeleton-short"></span></td>
          <td><span class="dyex-skeleton dyex-skeleton-cover"></span></td>
          <td><span class="dyex-skeleton dyex-skeleton-line"></span><span class="dyex-skeleton dyex-skeleton-line dyex-skeleton-line-short"></span></td>
          <td><span class="dyex-skeleton dyex-skeleton-medium"></span></td>
          <td><span class="dyex-skeleton dyex-skeleton-medium"></span></td>
        </tr>
      `).join("");
      const cards = Array.from({ length: 6 }, () => `
        <div class="dyex-video-card dyex-skeleton-card" aria-hidden="true">
          <span class="dyex-skeleton dyex-skeleton-card-cover"></span>
          <span class="dyex-skeleton dyex-skeleton-line"></span>
          <span class="dyex-skeleton dyex-skeleton-line dyex-skeleton-line-short"></span>
        </div>
      `).join("");
      this.ui.tableBody.innerHTML = rows;
      this.ui.grid.innerHTML = cards;
    }

    renderEmptyState() {
      const state = this.getEmptyState();
      const content = `
        <div class="dyex-empty-state">
          <span class="dyex-empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M5 7.5h14v11H5zM8 4.5h8M9 11h6M9 14.5h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </span>
          <strong>${escapeHtml(state.title)}</strong>
          <span>${escapeHtml(state.detail)}</span>
          ${state.action}
        </div>
      `;
      this.ui.tableBody.innerHTML = `<tr class="dyex-empty-row"><td colspan="6">${content}</td></tr>`;
      this.ui.grid.innerHTML = content;
    }

    renderVideos() {
      this.syncViewModeUi();
      const filteredVideos = this.getFilteredVideos();

      if (this.isFetching && !this.videos.length && !this.hasFetched) {
        this.renderSkeletons();
        return;
      }

      if (!filteredVideos.length) {
        this.renderEmptyState();
        return;
      }

      const tableHtml = filteredVideos
        .map((video, index) => {
          const cover = video.dynamicCoverUrl || video.coverUrl;
          const caption = video.caption || video.desc || "";
          const hasSeparateCaption = caption && caption !== video.title;
          const audioLink = video.audioUrl
            ? `<span>|</span><a href="${escapeHtml(video.audioUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(this.t("Audio"))}</a>`
            : "";

          return `
            <tr class="dyex-video-row">
              <td class="dyex-row-select">
                <input class="dyex-row-check" type="checkbox" data-video-id="${escapeHtml(video.id)}" ${
                  this.selectedIds.has(video.id) ? "checked" : ""
                }>
              </td>
              <td class="dyex-row-index">${index + 1}</td>
              <td class="dyex-row-cover">
                <div class="dyex-cover">
                  ${cover ? `<img src="${escapeHtml(cover)}" alt="${escapeHtml(video.title)}" loading="lazy">` : ""}
                </div>
              </td>
              <td class="dyex-row-title">
                <div class="dyex-title-wrap">
                  <div class="dyex-title" title="${escapeHtml(video.title)}">${escapeHtml(video.title)}</div>
                  ${
                    hasSeparateCaption
                      ? `<div class="dyex-caption" title="${escapeHtml(caption)}">${escapeHtml(caption)}</div>`
                      : ""
                  }
                </div>
              </td>
              <td class="dyex-date dyex-row-date">${escapeHtml(formatDisplayDate(video.createTime, UI_LOCALES[this.activeUiLanguage]))}</td>
              <td class="dyex-row-actions">
                <div class="dyex-actions">
                  <a href="${escapeHtml(video.videoUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(this.t("Video"))}</a>
                  ${audioLink}
                </div>
              </td>
            </tr>
          `;
        })
        .join("");

      const gridHtml = filteredVideos.map((video, index) => {
        const cover = video.dynamicCoverUrl || video.coverUrl;
        return `
          <article class="dyex-video-card ${this.selectedIds.has(video.id) ? "is-selected" : ""}">
            <label class="dyex-card-select" title="${escapeHtml(this.t("Select video {index}", { index: index + 1 }))}">
              <input class="dyex-row-check" type="checkbox" data-video-id="${escapeHtml(video.id)}" ${this.selectedIds.has(video.id) ? "checked" : ""}>
              <span>${index + 1}</span>
            </label>
            <a class="dyex-card-cover" href="${escapeHtml(video.videoUrl)}" target="_blank" rel="noopener noreferrer">
              ${cover ? `<img src="${escapeHtml(cover)}" alt="${escapeHtml(video.title)}" loading="lazy">` : ""}
              <span>${escapeHtml(this.t("Open video"))}</span>
            </a>
            <div class="dyex-card-body">
              <strong title="${escapeHtml(video.title)}">${escapeHtml(video.title)}</strong>
              <time>${escapeHtml(formatDisplayDate(video.createTime, UI_LOCALES[this.activeUiLanguage]))}</time>
            </div>
          </article>
        `;
      }).join("");

      this.ui.tableBody.innerHTML = tableHtml;
      this.ui.grid.innerHTML = gridHtml;
    }

    resetState() {
      this.fetchRequestId += 1;
      if (this.fetchAbortController) {
        this.fetchAbortController.abort();
        this.fetchAbortController = null;
      }
      this.videos = [];
      this.videoMap.clear();
      this.selectedIds.clear();
      this.filters.scope = "all";
      this.range.start = "";
      this.range.end = "";
      this.isFetching = false;
      this.isDownloading = false;
      this.hasFetched = false;
      this.fetchError = "";
      this.lastUpdatedAt = null;
      this.ui.rangeStartInput.value = "";
      this.ui.rangeEndInput.value = "";
      this.ui.filterScope.value = "all";
      this.renderVideos();
      this.updateSelectionUi();
      this.updateControlState();
      this.closeDownloadMenu();
      this.setStatusKey("Preparing profile videos...");
    }

    async syncQueueStatus() {
      try {
        const response = await sendRuntimeMessage({ type: "GET_QUEUE_STATUS" });
        if (!response?.ok || !response.queue) {
          this.isDownloading = false;
          this.lastProgressState = null;
          this.ui.downloadProgress.hidden = true;
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
          errors: response.queue.errors,
          activeItem: response.queue.activeItem,
          kind: response.queue.kind,
          startedAt: response.queue.startedAt,
          updatedAt: response.queue.updatedAt
        });
      } catch (error) {
        console.error("Failed to sync queue status:", error);
      }
    }

    async handleFetchVideos(options = {}) {
      if (this.isFetching || this.isDownloading) return;

      const secUserId = options.secUserId || getSecUserIdFromUrl();
      if (!secUserId) {
        this.setStatusKey("Could not find sec_user_id in the current URL.", {}, "error");
        return;
      }

      this.currentSecUserId = secUserId;
      const requestId = ++this.fetchRequestId;
      const abortController = new AbortController();
      this.fetchAbortController = abortController;
      const hadExistingData = this.hasFetched;
      const previousVideos = this.videos;
      const previousVideoMap = this.videoMap;
      this.isFetching = true;
      this.fetchError = "";
      if (!hadExistingData) {
        this.videos = [];
        this.videoMap = new Map();
        this.selectedIds.clear();
      }
      this.renderVideos();
      this.updateSelectionUi();
      this.updateControlState();
      this.closeDownloadMenu();
      this.setStatusKey(
        hadExistingData ? "Refreshing videos in the background..." : "Loading videos...",
        {},
        "info",
        true
      );

      try {
        const apiClient = new DouyinApiClient(secUserId, abortController.signal);
        const fetchedVideos = await this.fetchAllVideos(apiClient, requestId, secUserId, (partialVideos) => {
          if (!hadExistingData) {
            this.videos = [...partialVideos];
            this.videoMap = new Map(this.videos.map((video) => [video.id, video]));
            this.renderVideos();
            this.updateSelectionUi();
          }
          this.setStatusKey(
            hadExistingData ? "Refreshing... {count} videos found" : "Loading... {count} videos found",
            { count: partialVideos.length },
            "info",
            true
          );
        });
        if (!this.isCurrentFetch(requestId, secUserId)) return;
        this.videos = fetchedVideos;
        this.videoMap = new Map(fetchedVideos.map((video) => [video.id, video]));
        const availableIds = new Set(fetchedVideos.map((video) => video.id));
        this.selectedIds = new Set(Array.from(this.selectedIds).filter((id) => availableIds.has(id)));
        this.hasFetched = true;
        this.lastUpdatedAt = Date.now();
        this.renderVideos();
        this.updateSelectionUi();
        const updatedTime = new Intl.DateTimeFormat(UI_LOCALES[this.activeUiLanguage], {
          hour: "2-digit",
          minute: "2-digit"
        }).format(this.lastUpdatedAt);
        this.setStatusKey(
          "{count} videos loaded / Updated {time}",
          { count: this.videos.length, time: updatedTime },
          "success"
        );
      } catch (error) {
        if (error?.name === "AbortError" || !this.isCurrentFetch(requestId, secUserId)) return;
        console.error("Fetch failed:", error);
        if (hadExistingData) {
          this.videos = previousVideos;
          this.videoMap = previousVideoMap;
        } else if (!this.videos.length) {
          this.fetchError = error.message || "Failed to fetch videos.";
        } else {
          this.hasFetched = true;
        }
        this.setErrorStatus(error, "Failed to refresh videos.");
      } finally {
        if (this.isCurrentFetch(requestId, secUserId)) {
          this.isFetching = false;
          this.fetchAbortController = null;
          this.renderVideos();
          this.updateSelectionUi();
          this.updateControlState();
        }
      }
    }

    isCurrentFetch(requestId, secUserId) {
      return requestId === this.fetchRequestId && secUserId === this.currentSecUserId;
    }

    async fetchAllVideos(apiClient, requestId, secUserId, onProgress) {
      let maxCursor = 0;
      let hasMore = true;
      const seenIds = new Set();
      const seenCursors = new Set();
      const fetchedVideos = [];

      while (hasMore) {
        if (seenCursors.has(maxCursor)) break;
        seenCursors.add(maxCursor);

        const payload = await retryWithDelay(() => apiClient.fetchVideos(maxCursor));
        if (!this.isCurrentFetch(requestId, secUserId)) return;
        const { videos, hasMore: nextHasMore, maxCursor: nextCursor } = VideoDataProcessor.processPayload(payload, seenIds);

        for (const video of videos) {
          fetchedVideos.push(video);
        }

        onProgress(fetchedVideos);

        hasMore = nextHasMore;
        maxCursor = nextCursor;

        if (hasMore) {
          await sleep(CONFIG.REQUEST_DELAY_MS);
        }
      }

      return fetchedVideos;
    }

    getSelectedVideos() {
      return this.videos.filter((video) => this.selectedIds.has(video.id));
    }

    getDownloadFilename(video, kind, translatedTitle = "") {
      const date = formatFileDate(video.createTime);
      const baseFolder = sanitizeFolderPath(this.settings.downloadFolder);
      const typeFolder = kind === "video" ? "videos" : "audios";
      const prefix = baseFolder ? `${baseFolder}/${typeFolder}` : typeFolder;
      const filePrefix = sanitizeFileComponent((baseFolder || "douyin_downloads").replace(/\//g, "_"), "douyin_downloads");
      const titleSource = translatedTitle || video.caption || video.title || video.desc || video.id;
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
      if (!action || this.isDownloading) return;

      const selectedVideos = this.getSelectedVideos();
      if (!selectedVideos.length) {
        this.closeDownloadMenu();
        return;
      }

      this.closeDownloadMenu();
      this.settings.lastDownloadAction = action;
      this.syncDownloadPreferenceUi();
      this.persistSettings().catch((error) => console.error("Failed to save download preference:", error));

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
      this.isDownloading = true;
      this.isPreparingDownload = true;
      this.updateControlState();
      this.setStatusKey("Preparing {kind} files...", { kind }, "info", true);
      this.updateDownloadProgress(
        { total: selectedVideos.length, successCount: 0, failedCount: 0, kind },
        "queued"
      );

      try {
        let translations = {};
        if (this.settings.translationEnabled) {
          const languageNames = { EN: "English", VI: "Vietnamese", JP: "Japanese", KR: "Korean", CN: "Chinese" };
          const targetName = languageNames[this.settings.translationLanguage] || this.settings.translationLanguage;
          this.setStatusKey(
            "Translating {count} filenames to {language}...",
            { count: selectedVideos.length, language: targetName },
            "info",
            true
          );

          const translationResponse = await sendRuntimeMessage({
            type: "TRANSLATE_VIDEO_TITLES",
            payload: {
              items: selectedVideos.map((video) => ({
                id: video.id,
                title: video.title || "",
                caption: video.caption || "",
                desc: video.desc || ""
              }))
            }
          });

          if (!translationResponse?.ok) {
            throw new Error(translationResponse?.error || "Filename translation failed.");
          }
          translations = translationResponse.translations || {};
          const translatedCount = Object.keys(translations).length;
          const providerLabel = Array.isArray(translationResponse.providers)
            ? translationResponse.providers.join(" + ")
            : "AI";
          this.setStatusKey(
            "Translated {translated}/{total} filenames with {provider}.",
            { translated: translatedCount, total: selectedVideos.length, provider: providerLabel },
            "success",
            true
          );
        }

        const items = selectedVideos
          .map((video) => {
            const url = kind === "video" ? video.videoUrl : video.audioUrl;
            if (!url) return null;
            return {
              id: video.id,
              url,
              filename: this.getDownloadFilename(video, kind, translations[video.id] || "")
            };
          })
          .filter(Boolean);

        if (!items.length) {
          throw new Error(this.t("No {kind} URLs available for the selected videos.", { kind }));
        }

        this.isPreparingDownload = false;
        this.updateControlState();
        this.setStatusKey("Starting {kind} queue...", { kind }, "info", true);
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
        this.isPreparingDownload = false;
        this.lastProgressState = null;
        this.ui.downloadProgress.hidden = true;
        this.updateControlState();
        this.setErrorStatus(error, "Failed to start download queue.");
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

        this.setStatusKey("Metadata exported for {count} videos.", { count: selectedVideos.length }, "success");
      } catch (error) {
        this.setErrorStatus(error, "Metadata export failed.");
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

        this.setStatusKey("Video links exported for {count} videos.", { count: selectedVideos.length }, "success");
      } catch (error) {
        this.setErrorStatus(error, "Link export failed.");
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

        this.setStatusKey("CSV exported for {count} videos.", { count: selectedVideos.length }, "success");
      } catch (error) {
        this.setErrorStatus(error, "CSV export failed.");
      }
    }

    async handleCancelQueue() {
      if (!this.isDownloading || this.isPreparingDownload) return;

      try {
        const response = await sendRuntimeMessage({ type: "CANCEL_DOWNLOAD_QUEUE" });
        if (!response?.ok) {
          throw new Error(response?.error || "Failed to cancel queue.");
        }
      } catch (error) {
        this.setErrorStatus(error, "Failed to cancel queue.");
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
