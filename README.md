# Thiệp cưới online · Thu Hương & Chí Quyền

Một repo chứa 2 web thiệp riêng, mỗi web là một project Vercel có tên miền riêng.

```
apps/
  nha-gai/          Thiệp nhà gái (Lễ Vu Quy). Hướng dẫn chi tiết: apps/nha-gai/README.md
  nha-trai/         Thiệp nhà trai (Lễ Thành Hôn), phong cách Trung Hoa
packages/
  shared/           Code dùng chung: các phần của thiệp, trang /admin, hooks, tiện ích
```

Mỗi app chỉ giữ phần riêng của mình:

| File trong app                         | Nội dung                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------ |
| `src/data/wedding.ts`                  | Tên, gia đình, giờ giấc, địa điểm, lịch trình, Google Form, nhạc         |
| `src/data/photos.ts`                   | Ảnh nào đặt ở đâu, vị trí cắt ảnh                                        |
| `src/data/config.ts`                   | Nhà nào đứng trước, trái tim hay chữ 囍, hoa văn, chữ trên trang admin   |
| `src/index.css`                        | Màu thiệp, màu phong bì / con dấu, nền trang                             |
| `src/components/InvitationLayout.tsx`  | Thứ tự các phần trên thiệp, viền, lồng đèn...                            |
| `public/`, `index.html`, `api/`        | Ảnh, nhạc, ảnh xem trước Zalo, máy chủ lưu mã QR                          |

Sửa một component trong `packages/shared` là cả hai thiệp cùng đổi. Muốn một bên khác đi thì thêm
tuỳ chọn vào `WeddingConfig` ([packages/shared/src/config.tsx](packages/shared/src/config.tsx)) thay vì chép file sang app.

## Chạy trên máy

```bash
npm install            # chạy ở thư mục gốc, cài cho cả 2 app
npm run dev:nha-gai    # http://localhost:5173
npm run dev:nha-trai
```

Build: `npm run build:nha-gai`, `npm run build:nha-trai` (hoặc `npm run build` cho cả hai).

File `.env` đặt trong thư mục của từng app (ví dụ `apps/nha-gai/.env`, xem `.env.example` ở đó).

## Deploy lên Vercel

Mỗi bên một project Vercel, cùng nối với repo này:

| Project      | Root Directory    |
| ------------ | ----------------- |
| Nhà gái      | `apps/nha-gai`    |
| Nhà trai     | `apps/nha-trai`   |

Đặt trong **Settings → General → Root Directory**, và để bật tuỳ chọn
**Include files outside the root directory in the Build Step** (mặc định đã bật), vì app cần `packages/shared`. Biến môi trường (`ADMIN_USERNAME`, `VITE_RSVP_FORM_URL`, Blob store...)
khai báo riêng trong từng project.
