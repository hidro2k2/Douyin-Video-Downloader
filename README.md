# Douyin User Video Downloader

Chrome Extension Manifest V3 giúp tự động lấy danh sách video từ trang cá nhân Douyin, lọc và chọn nội dung, tải hàng loạt video/audio, xuất metadata và tùy chọn dịch tên file bằng Gemini hoặc Groq.

Phiên bản hiện tại: `1.3.2`

## Tính năng nổi bật

- Tự động fetch video khi mở hoặc chuyển sang một trang profile Douyin.
- Icon download màu hồng xoay trong lúc tải dữ liệu.
- Phân biệt rõ trạng thái đang tải, không có video và lỗi tải dữ liệu.
- Mở downloader là thấy ngay dữ liệu đã tải; `Refresh` cập nhật lại trong nền.
- Hiển thị danh sách theo chế độ `List` hoặc `Grid`.
- Tìm kiếm theo title/caption, lọc ngày đăng và video đã chọn.
- Sắp xếp mới nhất, cũ nhất hoặc theo tên A–Z/Z–A.
- Chọn tất cả hoặc chọn/bỏ chọn theo khoảng số thứ tự.
- Tải hàng loạt MP4/MP3 và xuất JSON/TXT/CSV.
- Hiển thị tiến trình, tên file hiện tại, phần trăm thành công/lỗi và cho phép dừng queue.
- Ghi nhớ bộ lọc, cách sắp xếp, Grid/List, định dạng tải gần nhất và các thiết lập download.
- Responsive cho màn hình nhỏ.
- Settings drawer trượt mượt từ phải sang trái, không chiếm diện tích khi xem video.
- Popup donate được tích hợp trong header.

## Dịch tên file bằng AI

Extension có thể dịch hoặc viết lại phần title trong tên file trước khi download. Nội dung title/caption hiển thị trong danh sách và metadata gốc không bị thay đổi.

### Ngôn ngữ hỗ trợ

| Mã | Ngôn ngữ |
| --- | --- |
| `VI` | Tiếng Việt |
| `EN` | English |
| `JP` | 日本語 |
| `KR` | 한국어 |
| `CN` | 中文 giản thể |

Khi chọn tiếng Việt, prompt được tối ưu để tạo tiêu đề tự nhiên và thu hút cho nội dung reup từ Trung Quốc, phù hợp với nhiều nhóm video như hoạt hình, review sản phẩm, review phim, giải trí, công nghệ, kịch, nhiếp ảnh, kiến thức, khoa học, ẩm thực và đời sống. Tiêu đề vẫn phải giữ đúng ý chính và không bịa thêm dữ kiện.

### Provider và API key

- Hỗ trợ `Gemini`, `Groq` hoặc `Auto`.
- Chế độ `Auto` ưu tiên Gemini rồi fallback sang Groq.
- Có thể nhập nhiều API key, mỗi dòng một key.
- Khi một key gặp lỗi quota, rate limit hoặc xác thực, extension tự chuyển sang key tiếp theo.
- Có thể bật/tắt dịch. Khi tắt, filename sử dụng title Douyin gốc.
- API key được lưu trong `chrome.storage.local` của extension.
- Mặc định Settings chỉ hiển thị số lượng key. Key được nạp tạm vào textarea khi bấm `Show keys` và bị xóa khỏi DOM khi ẩn hoặc đóng Settings.
- Dữ liệu dịch được gửi trực tiếp từ extension tới provider đã chọn, không qua backend riêng của dự án.

### Model Gemini

| Model | Trạng thái trong extension |
| --- | --- |
| `gemini-3.6-flash` | Mặc định, khuyến nghị |
| `gemini-3.5-flash` | Có thể chọn |
| `gemini-3.5-flash-lite` | Có thể chọn, ưu tiên tốc độ |
| `gemini-2.5-flash` | Có thể chọn, model cũ |
| Gemini 2.0/1.5 | Hiển thị để tham khảo nhưng bị khóa vì đã ngừng hoạt động |

### Model Groq

| Model | Trạng thái trong extension |
| --- | --- |
| `openai/gpt-oss-120b` | Mặc định, khuyến nghị |
| `openai/gpt-oss-20b` | Có thể chọn, ưu tiên tốc độ |
| `qwen/qwen3.6-27b` | Có thể chọn, preview |
| `llama-3.3-70b-versatile` | Legacy, phụ thuộc quyền tài khoản Enterprise |
| Mixtral 8x7B/Gemma2 9B | Hiển thị để tham khảo nhưng bị khóa vì đã ngừng hoạt động |

Danh sách model của provider có thể thay đổi theo thời gian. Tham khảo [Gemini model lifecycle](https://ai.google.dev/gemini-api/docs/deprecations) và [Groq model deprecations](https://console.groq.com/docs/deprecations) trước khi phát hành phiên bản mới.

## Cài đặt

1. Tải source code hoặc clone repository.
2. Mở `chrome://extensions`.
3. Bật `Developer mode`.
4. Chọn `Load unpacked`.
5. Chọn thư mục chứa `manifest.json`.
6. Mở hoặc refresh một trang `https://www.douyin.com/user/*`.

Sau khi cập nhật source, bấm `Reload` tại `chrome://extensions` rồi refresh lại trang Douyin. Chrome có thể yêu cầu xác nhận quyền kết nối Gemini/Groq khi manifest thay đổi.

## Cách sử dụng

1. Đăng nhập Douyin và mở trang profile cần tải.
2. Extension tự động fetch toàn bộ video theo phân trang.
3. Bấm icon download màu hồng cạnh khu vực tab video để mở downloader.
4. Tìm kiếm, lọc, sắp xếp và chọn các video cần tải.
5. Nếu cần, mở icon sliders màu hồng trong header để cấu hình Settings.
6. Bấm `Download` và chọn video, audio hoặc định dạng export.
7. Theo dõi progress bar; dùng `Stop` để dừng queue đang chạy.

`Refresh` chỉ cập nhật dữ liệu trong nền và không khóa toàn bộ giao diện.

## Settings

| Thiết lập | Mô tả |
| --- | --- |
| File prefix | Thư mục/prefix dùng khi tạo đường dẫn và tên file |
| Download delay | Khoảng nghỉ giữa hai file trong queue, tính bằng mili giây |
| Translate | Bật/tắt dịch title trong filename |
| Target language | Chọn VI, EN, JP, KR hoặc CN |
| AI provider | Chọn Auto, Gemini hoặc Groq |
| Gemini model | Chọn model dùng cho Gemini |
| Groq model | Chọn model dùng cho Groq |
| Gemini API keys | Nhiều key, mỗi dòng một key |
| Groq API keys | Nhiều key, mỗi dòng một key |
| Show keys | Tạm hiện key đã lưu hoặc key đang nhập; tự ẩn khi đóng Settings |

## Công cụ quản lý video

| Công cụ | Chức năng |
| --- | --- |
| Search | Tìm theo title hoặc caption |
| Date posted | Lọc theo ngày bắt đầu và kết thúc |
| Show | Hiển thị tất cả hoặc chỉ video đã chọn |
| Sort | Sắp xếp mới nhất, cũ nhất hoặc theo title |
| Select All | Chọn toàn bộ video đang hiển thị |
| Select Range | Chọn một khoảng số thứ tự |
| Unselect Range | Bỏ chọn một khoảng số thứ tự |
| Reset Filters | Xóa search và bộ lọc ngày |
| List/Grid | Chuyển chế độ hiển thị |

`Select Range` và `Unselect Range` áp dụng trên danh sách hiện đang hiển thị sau khi lọc và sắp xếp.

## Download và export

| Hành động | Kết quả |
| --- | --- |
| Download Selected Videos | Tải video MP4 |
| Download Selected Audios | Tải audio MP3 |
| Export Metadata JSON | Xuất metadata đầy đủ của video đã chọn |
| Export Links TXT | Xuất danh sách link video, mỗi dòng một link |
| Export CSV | Xuất bảng metadata để dùng với Excel/Google Sheets |

Queue download chạy trong background service worker nên vẫn giữ được trạng thái khi đóng/mở modal. File được tải bằng Chrome Downloads API với `conflictAction: uniquify` để tránh ghi đè file trùng tên.

## Quy tắc đặt tên file

Video:

```text
<file-prefix>/videos/<prefix>_<title>_<YYYY-MM-DD>_<aweme-id>.mp4
```

Audio:

```text
<file-prefix>/audios/<prefix>_<title>_<YYYY-MM-DD>_<aweme-id>.mp3
```

`<title>` là title do AI tạo nếu bật dịch; nếu tắt dịch hoặc thiếu kết quả dịch, extension fallback về caption/title gốc. Các ký tự không hợp lệ trong tên file được tự động loại bỏ.

## Trạng thái giao diện

- Lần tải đầu hiển thị skeleton thay vì màn hình trống.
- Profile không có video hiển thị empty state riêng.
- Lỗi API hiển thị nút thử lại.
- Refresh nền giữ nguyên danh sách hiện tại cho đến khi dữ liệu mới sẵn sàng.
- Settings drawer luôn được render ngoài màn hình và dùng `translate3d` để mở mượt, tránh giật layout.
- Giao diện không dùng thanh hành động cố định khi cuộn danh sách video.

## Quyền extension

| Quyền | Mục đích |
| --- | --- |
| `downloads` | Tải media và file export |
| `storage` | Lưu Settings, API key và trạng thái queue |
| `activeTab`, `scripting` | Hoạt động trên trang Douyin hiện tại |
| `alarms` | Điều phối khoảng nghỉ giữa các file trong queue |
| `https://*.douyin.com/*` | Fetch dữ liệu profile Douyin |
| `https://generativelanguage.googleapis.com/*` | Gọi Gemini API khi bật dịch |
| `https://api.groq.com/*` | Gọi Groq API khi bật dịch |

## Cấu trúc dự án

```text
Douyin Video Downloader/
├─ manifest.json
├─ content.js
├─ background.js
├─ style.css
├─ Douyin User Video Downloader.user.js
├─ QR.png
├─ icon16.png
├─ icon32.png
├─ icon48.png
├─ icon128.png
└─ README.md
```

| File | Vai trò |
| --- | --- |
| `manifest.json` | Cấu hình Chrome Extension Manifest V3 |
| `content.js` | UI, fetch Douyin, filter, selection và chuẩn bị download |
| `background.js` | Queue download, gọi Gemini/Groq và xoay API key |
| `style.css` | Giao diện responsive và animation |
| `Douyin User Video Downloader.user.js` | Bản userscript standalone cũ, chưa có Settings AI mới |
| `QR.png` | QR donate |
| `icon*.png` | Icon extension |

> Phiên bản được khuyến nghị là Chrome Extension từ `manifest.json`. File `.user.js` là bản legacy và không đồng bộ đầy đủ các tính năng mới.

## Xử lý lỗi nhanh

| Vấn đề | Cách xử lý |
| --- | --- |
| Không thấy icon downloader | Đảm bảo đang ở URL `/user/*`, reload extension và refresh Douyin |
| Video không tự tải | Kiểm tra đăng nhập Douyin rồi bấm `Refresh` |
| Dịch tên file thất bại | Kiểm tra API key, provider, model và quota |
| Nhiều Gemini key vẫn hết quota | Các key cùng Google project có thể dùng chung quota; thử Groq hoặc Auto |
| Model trả lỗi 404/400 | Model có thể đã bị provider ngừng hỗ trợ; chọn model mặc định |
| Download bị gián đoạn | Tăng Download delay và thử lại với số lượng video nhỏ hơn |
| UI chưa cập nhật | Reload extension tại `chrome://extensions` và refresh tab Douyin |

## Tác giả và hỗ trợ

- Tác giả: Le Thanh Thai Duong
- Zalo: <https://zalo.me/0342252825>
- Nhóm Tram AI 4.0: <https://zalo.me/g/mkvsqm829>
- Vietcombank: `1016581189` — Le Thanh Thai Duong

## Lưu ý

- Chỉ sử dụng với nội dung bạn có quyền tải và tuân thủ điều khoản của Douyin.
- Douyin có thể thay đổi giao diện hoặc API, khiến selector và cấu trúc dữ liệu cần được cập nhật.
- API Gemini/Groq có quota và chi phí riêng; người dùng tự quản lý API key và tài khoản provider.
- Dự án không có backend riêng và không thu thập API key.
