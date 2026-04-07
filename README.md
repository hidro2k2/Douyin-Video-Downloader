# Douyin User Video Downloader

A Chrome Extension Manifest V3 for fetching, previewing, filtering, and batch-downloading videos from Douyin user profile pages.

## Overview

| Item | Value |
| --- | --- |
| Project | Douyin User Video Downloader |
| Platform | Chrome Extension (Manifest V3) |
| Supported URL | `https://www.douyin.com/user/*` |
| Tech | JavaScript, CSS, Chrome Downloads API |
| Mode | Client-side only, no backend |
| Author | Le Thanh Thai Duong |

---

## Tiếng Việt

### Giới thiệu

`Douyin User Video Downloader` là extension Chrome giúp lấy toàn bộ video từ trang profile Douyin, hiển thị danh sách để chọn, lọc, tìm kiếm, export metadata và tải hàng loạt.

Extension hiện tại tập trung vào 4 mục tiêu:

| Mục tiêu | Mô tả |
| --- | --- |
| Fetch toàn bộ video | Lấy video qua API Douyin theo phân trang |
| Quản lý danh sách | Search, lọc theo ngày, select range, unselect range |
| Batch download | Download video/audio, export JSON/TXT/CSV |
| Lưu file linh hoạt | Dùng Chrome Downloads API hoặc chọn folder để lưu trực tiếp |

### Tính năng chính

| Nhóm tính năng | Chi tiết |
| --- | --- |
| UI Downloader | Chèn nút download nhỏ ngay trên profile Douyin, mở modal ở giữa màn hình |
| Fetch API | Tự lấy `sec_user_id`, gọi API Douyin, retry + delay để ổn định hơn |
| Hiển thị video | Cover, title, caption, date, link Video/Audio |
| Search và filter | Tìm theo `title` / `caption`, lọc ngày `from` / `to` |
| Chọn video | Checkbox từng dòng, `Select All`, `Select Range`, `Unselect Range` |
| Download | MP4, MP3, JSON, TXT, CSV |
| Queue control | Có nút `Stop` để dừng download đang chạy |
| Save mode | Chọn folder trực tiếp bằng `Choose Folder` hoặc dùng flow tải file của Chrome |
| Settings | Nhớ `File prefix` và `Delay (ms)` bằng `chrome.storage` |
| Donate | Popup donate nhỏ trong header, giữ UI đồng bộ |

### Cài đặt

| Bước | Thao tác |
| --- | --- |
| 1 | Mở `chrome://extensions` |
| 2 | Bật `Developer mode` |
| 3 | Bấm `Load unpacked` |
| 4 | Chọn thư mục project này |
| 5 | Sau mỗi lần sửa code, bấm `Reload` |

### Cách dùng

1. Mở trang profile Douyin theo mẫu `https://www.douyin.com/user/*`.
2. Bấm icon download nhỏ ở khu vực tab video.
3. Trong modal, bấm `Fetch Videos`.
4. Nếu cần, dùng các công cụ lọc:

| Công cụ | Tác dụng |
| --- | --- |
| Search | Tìm theo `title` hoặc `caption` |
| Date From / Date To | Lọc theo ngày tạo video |
| Select Range | Chọn theo số thứ tự đang hiển thị |
| Unselect Range | Bỏ chọn theo số thứ tự đang hiển thị |
| Select All | Chọn tất cả video đang hiển thị |
| Reset Filters | Xóa search và filter ngày |

5. Đặt `File prefix` nếu muốn đổi phần đầu tên file.
6. Đặt `Delay (ms)` nếu muốn download chậm hơn hoặc nhanh hơn.
7. Nếu muốn lưu vào một thư mục cụ thể, bấm `Choose Folder`.
8. Bấm `Download` và chọn loại file cần tải.
9. Nếu cần dừng giữa chừng, bấm `Stop`.

### Giải thích giao diện

| Thành phần | Ý nghĩa |
| --- | --- |
| Fetch Videos | Lấy toàn bộ video từ profile |
| Download | Mở menu download/export |
| Stop | Dừng queue download đang chạy |
| File prefix | Đặt tiền tố cho tên file |
| Choose Folder | Chọn thư mục lưu trực tiếp |
| Delay (ms) | Độ trễ giữa các file trong queue |
| Title / Caption | Hiển thị title và caption lấy từ API |

### Đặt tên file

Input `File prefix` được dùng làm phần đầu của tên file.

Ví dụ:

```text
douyin_downloads_caption-video_2026-03-29_123456789.mp4
caucaTV_caption-video_2026-03-29_123456789.mp3
```

Quy tắc:

| Phần | Nguồn |
| --- | --- |
| Prefix | Lấy từ input `File prefix` |
| Nội dung tên | Ưu tiên `caption`, fallback sang `title` |
| Date | `YYYY-MM-DD` |
| ID | `aweme_id` của video |

### Export dữ liệu

| Định dạng | Nội dung |
| --- | --- |
| JSON | Full metadata của video đã chọn |
| TXT | Danh sách link video, mỗi dòng 1 link |
| CSV | Metadata dạng bảng, để mở bằng Excel/Sheets |

### Save mode

| Cách lưu | Mô tả |
| --- | --- |
| Chrome Downloads API | Nếu chưa chọn folder, extension tải theo flow của Chrome |
| Direct save | Nếu đã bấm `Choose Folder`, extension có thể lưu trực tiếp vào folder đã chọn |

Lưu ý:

- Quyền folder có thể cần cấp lại sau khi reload extension hoặc khởi động lại trình duyệt.
- `Select Range` và `Unselect Range` áp dụng trên danh sách đang hiển thị sau filter/search.

### Cấu trúc project

```text
Douyin Video Downloader/
├─ manifest.json
├─ content.js
├─ background.js
├─ style.css
├─ QR.png
├─ icon16.png
├─ icon32.png
├─ icon48.png
├─ icon128.png
└─ README.md
```

### Vai trò từng file

| File | Vai trò |
| --- | --- |
| `manifest.json` | Cấu hình extension MV3 |
| `content.js` | UI, fetch API, filter, selection, save logic |
| `background.js` | Queue download bằng Chrome Downloads API |
| `style.css` | Toàn bộ giao diện extension |
| `QR.png` | Mã QR donate |
| `icon*.png` | Icon toolbar của extension |

### Tác giả và Donate

| Mục | Thông tin |
| --- | --- |
| Tác giả | Le Thanh Thai Duong |
| Ngân hàng | Vietcombank |
| Số tài khoản | `1016581189` |
| Chủ tài khoản | Le Thanh Thai Duong |
| Zalo tác giả | https://zalo.me/0342252825 |
| Nhóm Zalo | Tram AI 4.0 - https://zalo.me/g/mkvsqm829 |

### Xử lý lỗi nhanh

| Vấn đề | Gợi ý |
| --- | --- |
| Không thấy nút downloader | Refresh trang Douyin, sau đó `Reload` extension |
| Download không chạy | Kiểm tra login Douyin, delay, quyền folder |
| Save folder không hoạt động | Bấm `Choose Folder` lại và cấp quyền read/write |
| Dropdown bị che layer | `Reload` extension và refresh trang |

---

## English

### Introduction

`Douyin User Video Downloader` is a Chrome Extension built to fetch all videos from a Douyin user profile, display them in a selection UI, and support batch downloads and metadata export.

It focuses on 4 main goals:

| Goal | Description |
| --- | --- |
| Fetch all videos | Load videos from the Douyin API with pagination |
| Manage selection | Search, date filtering, range selection, unselect range |
| Batch download | Download video/audio and export JSON/TXT/CSV |
| Flexible saving | Use Chrome Downloads API or direct-save into a chosen folder |

### Main features

| Feature group | Details |
| --- | --- |
| Downloader UI | Injects a small downloader trigger into the Douyin profile page |
| API fetch | Automatically reads `sec_user_id`, calls Douyin API, retries with delay |
| Video list | Cover, title, caption, date, Video/Audio links |
| Search and filtering | Search by `title` / `caption`, filter by date range |
| Selection tools | Row checkbox, `Select All`, `Select Range`, `Unselect Range` |
| Download actions | MP4, MP3, JSON, TXT, CSV |
| Queue control | Includes `Stop` to stop active downloads |
| Save mode | Direct folder save with `Choose Folder` or default Chrome download flow |
| Persistent settings | Saves `File prefix` and `Delay (ms)` with `chrome.storage` |
| Author support | Donation popup integrated into the header |

### Installation

| Step | Action |
| --- | --- |
| 1 | Open `chrome://extensions` |
| 2 | Enable `Developer mode` |
| 3 | Click `Load unpacked` |
| 4 | Select this project folder |
| 5 | Click `Reload` whenever the code changes |

### How to use

1. Open a Douyin profile page matching `https://www.douyin.com/user/*`.
2. Click the small downloader icon near the video/profile tab area.
3. Click `Fetch Videos`.
4. Use the available tools when needed:

| Tool | Purpose |
| --- | --- |
| Search | Search by `title` or `caption` |
| Date From / Date To | Filter by video create date |
| Select Range | Select videos by visible row number |
| Unselect Range | Unselect videos by visible row number |
| Select All | Select all currently visible videos |
| Reset Filters | Clear search and date filters |

5. Set `File prefix` if you want a custom filename prefix.
6. Set `Delay (ms)` if you want slower or faster downloads.
7. Click `Choose Folder` if you want a custom destination folder.
8. Click `Download` and choose the action you need.
9. Click `Stop` if you want to stop the active job.

### UI reference

| Component | Purpose |
| --- | --- |
| Fetch Videos | Fetch all videos from the current profile |
| Download | Opens the download/export menu |
| Stop | Stops the active queue |
| File prefix | Sets the filename prefix |
| Choose Folder | Selects a direct-save folder |
| Delay (ms) | Sets delay between downloaded files |
| Title / Caption | Shows API-based title and caption |

### Filename format

The `File prefix` input is used as the start of each filename.

Examples:

```text
douyin_downloads_video-caption_2026-03-29_123456789.mp4
caucaTV_video-caption_2026-03-29_123456789.mp3
```

Rules:

| Part | Source |
| --- | --- |
| Prefix | Value from `File prefix` |
| Main text | `caption` first, fallback to `title` |
| Date | `YYYY-MM-DD` |
| ID | Douyin `aweme_id` |

### Export formats

| Format | Content |
| --- | --- |
| JSON | Full selected video metadata |
| TXT | Video links, one per line |
| CSV | Table-style metadata for Excel or Google Sheets |

### Save modes

| Mode | Description |
| --- | --- |
| Chrome download flow | Used when no folder is explicitly chosen |
| Direct save | Used after `Choose Folder`, saves directly into the selected folder |

Notes:

- Folder permissions may need to be granted again after extension reload or browser restart.
- `Select Range` and `Unselect Range` work on the currently visible list after filtering/searching.

### Project structure

```text
Douyin Video Downloader/
├─ manifest.json
├─ content.js
├─ background.js
├─ style.css
├─ QR.png
├─ icon16.png
├─ icon32.png
├─ icon48.png
├─ icon128.png
└─ README.md
```

### File responsibilities

| File | Purpose |
| --- | --- |
| `manifest.json` | MV3 extension configuration |
| `content.js` | UI, API fetch, filtering, selection, and save logic |
| `background.js` | Background queue management with Chrome Downloads API |
| `style.css` | Extension styling |
| `QR.png` | Donation QR image |
| `icon*.png` | Extension toolbar icons |

### Author and donation

| Item | Value |
| --- | --- |
| Author | Le Thanh Thai Duong |
| Bank | Vietcombank |
| Account number | `1016581189` |
| Account name | Le Thanh Thai Duong |
| Author Zalo | https://zalo.me/0342252825 |
| Zalo group | Tram AI 4.0 - https://zalo.me/g/mkvsqm829 |

### Quick troubleshooting

| Problem | Suggestion |
| --- | --- |
| Downloader button does not appear | Refresh Douyin page and reload the extension |
| Downloads do not start | Check login state, delay value, and folder permission |
| Direct save does not work | Click `Choose Folder` again and re-grant permission |
| Dropdown layering issue | Reload the extension and refresh the page |

---

## Notes

- This project is intended for browser-side personal workflow automation.
- Douyin UI selectors and API structures may change over time.
- If Douyin updates its frontend or API, some selectors or fields may need to be adjusted.
