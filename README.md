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

## Vietnamese

### Gioi thieu

`Douyin User Video Downloader` la extension Chrome giup lay toan bo video tu trang profile Douyin, hien thi danh sach de chon, loc, tim kiem, export metadata va tai hang loat.

Extension hien tai tap trung vao 4 muc tieu:

| Muc tieu | Mo ta |
| --- | --- |
| Fetch toan bo video | Lay video qua API Douyin theo phan trang |
| Quan ly danh sach | Search, filter theo ngay, select range, unselect range |
| Batch download | Download video/audio, export JSON/TXT/CSV |
| Luu file linh hoat | Dung Chrome Downloads API hoac chon folder de luu truc tiep |

### Tinh nang chinh

| Nhom tinh nang | Chi tiet |
| --- | --- |
| UI Downloader | Chen nut download nho ngay tren profile Douyin, mo modal o giua man hinh |
| Fetch API | Tu lay `sec_user_id`, goi API Douyin, retry + delay de on dinh hon |
| Hien thi video | Cover, title, caption, date, link Video/Audio |
| Search va filter | Tim theo `title` / `caption`, loc ngay `from` / `to` |
| Chon video | Checkbox tung dong, `Select All`, `Select Range`, `Unselect Range` |
| Download | MP4, MP3, JSON, TXT, CSV |
| Queue control | Co nut `Stop` de dung download dang chay |
| Save mode | Chon folder truc tiep bang `Choose Folder` hoac dung flow tai file cua Chrome |
| Settings | Nho `File prefix` va `Delay (ms)` bang `chrome.storage` |
| Donate | Popup donate nho trong header, giu UI dong bo |

### Cai dat

| Buoc | Thao tac |
| --- | --- |
| 1 | Mo `chrome://extensions` |
| 2 | Bat `Developer mode` |
| 3 | Bam `Load unpacked` |
| 4 | Chon thu muc project nay |
| 5 | Sau moi lan sua code, bam `Reload` |

### Cach dung

1. Mo trang profile Douyin theo mau `https://www.douyin.com/user/*`.
2. Bam icon download nho o khu vuc tab video.
3. Trong modal, bam `Fetch Videos`.
4. Neu can, dung cac cong cu loc:

| Cong cu | Tac dung |
| --- | --- |
| Search | Tim theo `title` hoac `caption` |
| Date From / Date To | Loc theo ngay tao video |
| Select Range | Chon theo so thu tu dang hien thi |
| Unselect Range | Bo chon theo so thu tu dang hien thi |
| Select All | Chon tat ca video dang hien thi |
| Reset Filters | Xoa search va filter ngay |

5. Dat `File prefix` neu muon doi phan dau ten file.
6. Dat `Delay (ms)` neu muon download cham hon hoac nhanh hon.
7. Neu muon luu vao mot thu muc cu the, bam `Choose Folder`.
8. Bam `Download` va chon loai file can tai.
9. Neu can dung giua chung, bam `Stop`.

### Giai thich giao dien

| Thanh phan | Y nghia |
| --- | --- |
| Fetch Videos | Lay toan bo video tu profile |
| Download | Mo menu download/export |
| Stop | Dung queue download dang chay |
| File prefix | Dat tien to cho ten file |
| Choose Folder | Chon thu muc luu truc tiep |
| Delay (ms) | Do tre giua cac file trong queue |
| Title / Caption | Hien thi title va caption lay tu API |

### Dat ten file

Input `File prefix` duoc dung lam phan dau cua ten file.

Vi du:

```text
douyin_downloads_caption-video_2026-03-29_123456789.mp4
caucaTV_caption-video_2026-03-29_123456789.mp3
```

Quy tac:

| Phan | Nguon |
| --- | --- |
| Prefix | Lay tu input `File prefix` |
| Noi dung ten | Uu tien `caption`, fallback sang `title` |
| Date | `YYYY-MM-DD` |
| ID | `aweme_id` cua video |

### Export du lieu

| Dinh dang | Noi dung |
| --- | --- |
| JSON | Full metadata cua video da chon |
| TXT | Danh sach link video, moi dong 1 link |
| CSV | Metadata dang bang, de mo bang Excel/Sheets |

### Save mode

| Cach luu | Mo ta |
| --- | --- |
| Chrome Downloads API | Neu chua chon folder, extension tai theo flow cua Chrome |
| Direct save | Neu da bam `Choose Folder`, extension co the luu truc tiep vao folder da chon |

Luu y:

- Quyen folder co the can cap lai sau khi reload extension hoac khoi dong lai trinh duyet.
- `Select Range` va `Unselect Range` ap dung tren danh sach dang hien thi sau filter/search.

### Cau truc project

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

### Vai tro tung file

| File | Vai tro |
| --- | --- |
| `manifest.json` | Cau hinh extension MV3 |
| `content.js` | UI, fetch API, filter, selection, save logic |
| `background.js` | Queue download thong qua Chrome Downloads API |
| `style.css` | Toan bo giao dien extension |
| `QR.png` | Ma QR donate |
| `icon*.png` | Icon toolbar cua extension |

### Tac gia va Donate

| Muc | Thong tin |
| --- | --- |
| Tac gia | Le Thanh Thai Duong |
| Ngan hang | Vietcombank |
| So tai khoan | `1016581189` |
| Chu tai khoan | Le Thanh Thai Duong |
| Zalo tac gia | https://zalo.me/0342252825 |
| Nhom Zalo | Tram AI 4.0 - https://zalo.me/g/mkvsqm829 |

### Xu ly loi nhanh

| Van de | Goi y |
| --- | --- |
| Khong thay nut downloader | Refresh trang Douyin, sau do `Reload` extension |
| Download khong chay | Kiem tra login Douyin, delay, quyen folder |
| Save folder khong hoat dong | Bam `Choose Folder` lai va cap quyen read/write |
| Dropdown bi che layer | `Reload` extension va refresh trang |

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
