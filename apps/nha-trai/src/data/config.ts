// Cấu hình thiệp nhà trai: gom thông tin (wedding.ts), ảnh (photos.ts) và kiểu trang trí.
// Sửa chữ trên thiệp ở wedding.ts, sửa ảnh ở photos.ts, đổi màu ở src/index.css.
import type { WeddingConfig } from "@wedding/shared";
import { wedding } from "./wedding";
import * as p from "./photos";

export const config: WeddingConfig = {
  host: "groom",
  wedding,
  photos: {
    album: p.photos,
    hero: p.heroPhoto,
    heroPosition: p.heroPhotoPosition,
    invite: p.invitePhoto,
    gift: p.giftPhoto,
    giftModal: p.giftModalPhoto,
    giftModalPosition: p.giftModalPhotoPosition,
  },
  style: {
    // Màu chữ chính (đỏ đô)
    qrColor: "#7a1a1c",
    // Kiểu Trung Hoa: chữ 囍 thay trái tim, hoa văn hồi văn
    symbol: "double-happiness",
    ornament: "fret",
    // "Nhị Thiếu Gia", "Đại Tiểu Thư" dài hơn nên cần ô rộng hơn
    wideOrderLabels: true,
  },
  labels: {
    adminTitle: "Quản lý thiệp nhà trai",
    giftQrTitle: "Mã QR mừng cưới nhà trai",
  },
};
