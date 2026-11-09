// Cấu hình thiệp nhà gái: gom thông tin (wedding.ts), ảnh (photos.ts) và kiểu trang trí.
// Sửa chữ trên thiệp ở wedding.ts, sửa ảnh ở photos.ts, đổi màu ở src/index.css.
import type { WeddingConfig } from "@wedding/shared";
import { wedding } from "./wedding";
import * as p from "./photos";

export const config: WeddingConfig = {
  host: "bride",
  wedding,
  photos: {
    album: p.photos,
    hero: p.heroPhoto,
    heroPosition: p.heroPhotoPosition,
    invite: p.invitePhoto,
    gift: p.giftPhoto,
    giftModal: p.giftModalPhoto,
  },
  style: {
    qrColor: "#1d2c6b",
    symbol: "heart",
    ornament: "leaf",
  },
  labels: {
    adminTitle: "Quản lý thiệp",
    giftQrTitle: "Mã QR mừng cưới",
  },
};
