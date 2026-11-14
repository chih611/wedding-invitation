// Ảnh cưới dùng chung cho cả hai thiệp, nằm trong packages/shared/src/assets/photos (bản lớn) và photos/thumbs (bản nhỏ).
// Muốn bỏ / đổi thứ tự ảnh trong album thì sửa danh sách này.

export const photos = [
  // Ảnh mặc đồ người Hoa xếp lên đầu
  "tho-2451.jpg",
  "tho-2430.jpg",
  "tho-2447.jpg",
  "tho-2483.jpg",
  "tho-2380.jpg",
  "tho-2551.jpg",
  // Ảnh cưới
  "tho-0468.jpg",
  "tho-0497.jpg",
  "tho-0528.jpg",
  "tho-0598.jpg",
  "tho-0618.jpg",
  "tho-0665.jpg",
  "tho-0685.jpg",
  "tho-0822.jpg",
  "tho-0885.jpg",
  "tho-0918.jpg",
  "tho-0938.jpg",
  "tho-0948.jpg",
  "tho-0961.jpg",
  "tho-0997.jpg",
  "tho-1016.jpg",
  "tho-1072.jpg",
  "tho-1086.jpg",
  "tho-1138.jpg",
  "tho-1383.jpg",
  "tho-1387.jpg",
  "tho-1565.jpg",
  "tho-1576.jpg",
  "tho-1730.jpg",
  "tho-1840.jpg",
  "tho-1941.jpg",
  "tho-1980.jpg",
  "tho-2134.jpg",
  "tho-2146.jpg",
  "tho-2184.jpg",
  "tho-2286.jpg",
  "tho-2301.jpg",
  "tho-2316.jpg",
  "tho-2325.jpg",
  "tho-2364.jpg",
];

/** Ảnh lớn ở đầu thiệp */
export const heroPhoto = "tho-2451.jpg";

/**
 * Vị trí cắt ảnh đầu thiệp cho vừa khung dọc: "ngang dọc" theo %.
 * 0% = sát trái/trên, 50% = giữa, 100% = sát phải/dưới. Chỉnh số đầu để dời ảnh sang trái/phải.
 */
export const heroPhotoPosition = "50% 50%";

/** Ảnh ngang (khung 3:2) dưới phần lịch và lời mời: ảnh trước điện Quang Minh */
export const invitePhoto = "tho-3000.jpg";

/** Hộp mừng cưới: ảnh nửa trái băng rôn, và ảnh trên cùng của cửa sổ mã QR */
export const giftPhoto = "tho-2483.jpg";
export const giftModalPhoto = "tho-2447.jpg";
/** Vị trí cắt ảnh cửa sổ mã QR cho vừa khung ngang 3:2 (giống heroPhotoPosition) */
export const giftModalPhotoPosition = "50% 35%";
