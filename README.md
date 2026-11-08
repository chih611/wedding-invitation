# Thiệp cưới online · Thu Hương & Chí Quyền

## Chạy thử trên máy

```bash
npm install
cp .env.example .env   # rồi sửa tài khoản admin trong .env
npm run dev
```

Mở http://localhost:5173

## Các trang

| Đường dẫn | Nội dung                                                                                   |
| --------- | ------------------------------------------------------------------------------------------ |
| `/`       | Thiệp cưới: Lễ Vu Quy + thiệp mời tiệc                                                     |
| `/admin`  | Trang quản lý (phải đăng nhập): upload mã QR mừng cưới, tạo link mời từng khách và gửi      |

Thêm `?to=Tên khách` vào cuối link để tên khách hiện trên thiệp, ví dụ: `/?to=Anh%20Nam`

### Tài khoản admin

Đặt trong file `.env` (không commit file này):

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=mat-khau-dai-kho-doan
```

Deploy lên Vercel thì khai báo 2 biến này trong phần Environment Variables rồi build lại.
Lúc build chỉ mã băm của tài khoản được đưa vào code, không có mật khẩu. Vì không có server,
đây là khoá đơn giản để khách không vào nhầm, nên hãy đặt mật khẩu dài.

### Mã QR mừng cưới

Trong `/admin`, upload 1 ảnh mã QR nhận tiền (chụp màn hình từ app ngân hàng
cũng được). Mã được lưu trên máy chủ (Vercel Blob, qua [api/gift.ts](api/gift.ts)) nên hiện ngay trên mọi link
thiệp, kể cả link gốc và link đã gửi, không cần sửa code hay deploy lại.

**Cài đặt 1 lần trên Vercel:** Storage → Create → Blob → nối với project này (Vercel tự thêm
`BLOB_READ_WRITE_TOKEN`), rồi Redeploy. `ADMIN_USERNAME` / `ADMIN_PASSWORD` phải có trong Environment Variables.
Chạy `npm run dev` trên máy thì không có máy chủ này, nên không lưu được mã QR.

- Có mã thì thiệp hiện **Hộp mừng cưới**; không upload thì phần này ẩn hẳn.
- Mã VietQR của ngân hàng được vẽ lại, không điền sẵn nội dung chuyển khoản (khách tự ghi).
  Muốn điền sẵn thì ghi vào `giftMessage` trong [src/data/wedding.ts](src/data/wedding.ts).
  Mã khác (MoMo, ZaloPay...) được giữ nguyên.
- **Kiểm tra trước khi gửi link:** sau khi upload, trang admin hiện mã QR đã vẽ lại. Mở app ngân hàng,
  quét mã đó (không cần chuyển tiền) và xem tên người nhận, số tài khoản có đúng không.

### Gửi thiệp nhanh

1. Mở `/admin` và đưa danh sách khách vào bằng một trong hai cách:
   - **Nhập file Excel** (.xlsx, .xls, .csv): bấm chọn file hoặc kéo thả vào. File cần có cột tiêu đề
     "Họ và tên" (hoặc "Tên", "Khách mời"). Nếu có cột "Xưng hô" (Anh, Chị, Cô...) sẽ tự ghép vào trước tên.
     Có nút **Tải file mẫu** để điền theo.
   - **Dán trực tiếp** cột tên từ Excel / Google Sheets vào ô nhập.

   Cột STT, dòng tiêu đề và tên trùng tự bỏ qua. Nhập nhiều file thì danh sách được cộng dồn.
2. Trên điện thoại: bấm **Gửi** → chọn Zalo / Messenger → chọn người nhận.
   Trên máy tính: bấm **Chép link** rồi dán vào khung chat. Khách tự được đánh dấu đã gửi.

Danh sách và trạng thái đã gửi lưu trên trình duyệt đang dùng, nên hãy gửi trên cùng một máy.

## Sửa thông tin trên thiệp

Toàn bộ tên, địa chỉ, giờ giấc nằm trong [src/data/wedding.ts](src/data/wedding.ts).
Danh sách tên ngân hàng (hiện dưới mã QR) nằm trong [src/utils/vietqr.ts](src/utils/vietqr.ts) (`BANK_BINS`).

### Lịch trình tiệc, dress code, màu sắc

- `schedule` và `dressCode` trong [src/data/wedding.ts](src/data/wedding.ts) đang là nội dung mẫu, nhớ sửa lại.
  Xoá hết dòng của mục nào thì phần đó ẩn khỏi thiệp.
- Màu chủ đạo (xanh navy `navy`, xanh đậm `royal`, nền `paper`) nằm đầu [src/index.css](src/index.css).

### Form xác nhận tham dự (Google Form)

Câu trả lời của khách được gửi thẳng vào Google Form, xem ở tab **Câu trả lời** (hoặc nối sang Google Sheets).

1. Tạo Google Form mới với 5 câu hỏi, đúng loại và đúng các lựa chọn trong `rsvp` ở
   [src/data/wedding.ts](src/data/wedding.ts):
   - **Tên của bạn**: Câu trả lời ngắn
   - **Gửi lời nhắn đến cô dâu chú rể**: Đoạn
   - **Bạn sẽ đến chứ?**: Menu thả xuống, lựa chọn giống `attendingOptions`
   - **Bạn tham dự cùng ai?**: Menu thả xuống, lựa chọn giống `companionOptions`
   - **Bạn là khách mời của ai?**: Menu thả xuống, lựa chọn giống `guestOfOptions`

   Lựa chọn phải giống hệt từng chữ, nếu không Google sẽ bỏ qua câu trả lời đó.
   Không bật "Bắt buộc" cho câu nào và không bật thu thập email (thiệp đã tự kiểm tra rồi).
2. Bấm biểu tượng con mắt (**Xem trước**) rồi chép địa chỉ trên thanh trình duyệt, dạng
   `https://docs.google.com/forms/d/e/.../viewform` (link rút gọn `forms.gle/...` không dùng được).
   Ghi vào biến `VITE_RSVP_FORM_URL`:
   - Chạy trên máy: trong file `.env` (xem `.env.example`).
   - Vercel: **Settings → Environment Variables** → thêm `VITE_RSVP_FORM_URL` → **Redeploy**.
3. Lấy mã từng câu: menu **⋮** → **Lấy đường liên kết điền sẵn** → điền thử mỗi câu một giá trị →
   **Lấy đường liên kết** → **Sao chép**. Link có dạng `...&entry.123456=Tên&entry.234567=...`;
   ghi từng `entry.<số>` vào `rsvp.fields` theo đúng câu hỏi.
4. Mở thiệp, gửi thử một câu trả lời rồi xem trong Google Form đã nhận chưa.

`VITE_RSVP_FORM_URL` để trống thì phần xác nhận tham dự ẩn khỏi thiệp. Nếu đổi lời các lựa chọn, sửa ở cả hai nơi.

### Ảnh cưới

- Ảnh lớn nằm trong `public/photos/`, ảnh nhỏ (400px) trong `public/photos/thumbs/`, cùng tên file.
- Danh sách ảnh trong album và ảnh lớn ở đầu thiệp (`heroPhoto`) nằm trong [src/data/photos.ts](src/data/photos.ts).
  Bỏ một dòng là ảnh đó không hiện; đổi thứ tự dòng là đổi thứ tự trong album.

### Nhạc nền

Đặt file nhạc vào `public/music/hon-ca-yeu.mp3` (hoặc tên khác rồi sửa `music.src` trong
[src/data/wedding.ts](src/data/wedding.ts)). Nhạc tự phát khi mở thiệp (nếu trình duyệt chặn thì phát ở lần đầu khách chạm vào trang), có nút bật/tắt ở
góc dưới bên phải. Chưa có file thì nút nhạc tự ẩn.

## Deploy

```bash
npm run build   # kết quả nằm trong thư mục dist/
```

- **Vercel**: import repo, giữ cấu hình mặc định (đã có `vercel.json`).

Ảnh xem trước khi gửi link (Zalo / Messenger) là `public/og-image.jpg` (1200×630, cắt từ `THO_0685.jpg`).
Lúc build trên Vercel, tên miền được tự thêm vào thẻ `og:image`. Dùng tên miền riêng thì đặt biến `SITE_URL`
(ví dụ `https://thiepcuoi.vn`) trong Environment Variables.
