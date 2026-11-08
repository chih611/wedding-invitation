import jsQR from "jsqr";
import { bankNameFromBin, buildVietQrPayload, parseVietQr, toTransferText } from "./vietqr";

/**
 * Mã hoá mã QR mừng cưới thành chuỗi ngắn để lưu trên máy chủ (api/gift.ts).
 * Link cũ có dạng /?to=...&qr=970436.0123456789.BUI+THI+THU+HUONG vẫn đọc được.
 * - Mã VietQR được rút gọn thành "BIN.số tài khoản.tên chủ TK" để link ngắn
 *   và để thiệp tự điền nội dung chuyển khoản (giftMessage trong wedding.ts).
 * - Mã QR khác (MoMo, ZaloPay...) giữ nguyên nội dung gốc.
 */

export const GIFT_PARAM = "qr";

export type GiftQr =
  | { kind: "bank"; bin: string; bank: string; accountNumber: string; accountName: string }
  | { kind: "raw"; payload: string };

const COMPACT = /^(\d{6})\.([A-Za-z0-9]{1,19})(?:\.([A-Z0-9 ]{0,50}))?$/;
const MAX_RAW = 512;

/** Tên chủ tài khoản: viết hoa, không dấu, như trên app ngân hàng */
export function normalizeAccountName(name: string) {
  return toTransferText(name, 50).toUpperCase();
}

/** Từ nội dung đọc được trong ảnh QR → dữ liệu mừng cưới */
export function giftFromPayload(payload: string): GiftQr {
  const info = parseVietQr(payload);
  if (!info) return { kind: "raw", payload: payload.trim() };
  return {
    kind: "bank",
    bin: info.bin,
    bank: bankNameFromBin(info.bin),
    accountNumber: info.accountNumber,
    accountName: normalizeAccountName(info.accountName),
  };
}

export function encodeGift(gift: GiftQr) {
  if (gift.kind === "raw") return gift.payload;
  const name = normalizeAccountName(gift.accountName);
  return [gift.bin, gift.accountNumber, name].filter(Boolean).join(".");
}

export function decodeGift(value: string | null): GiftQr | null {
  const text = (value ?? "").trim();
  if (!text) return null;
  const m = COMPACT.exec(text);
  if (m) {
    return { kind: "bank", bin: m[1], bank: bankNameFromBin(m[1]), accountNumber: m[2], accountName: m[3] ?? "" };
  }
  if (text.length > MAX_RAW) return null;
  // Mã VietQR đầy đủ dán thẳng vào link cũng nhận
  return giftFromPayload(text);
}

/** Nội dung để vẽ mã QR trên thiệp */
export function giftPayload(gift: GiftQr, message: string) {
  return gift.kind === "bank" ? buildVietQrPayload(gift.bin, gift.accountNumber, message) : gift.payload;
}

/** Đọc mã QR trong ảnh (ảnh chụp màn hình app ngân hàng cũng được) */
export async function readQrFromImage(file: File): Promise<string | null> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    // Thử vài kích thước: ảnh quá to đọc chậm, ảnh thu nhỏ quá thì mất chi tiết
    const longest = Math.max(img.naturalWidth, img.naturalHeight);
    const sizes = [...[800, 1200, 1600].filter((s) => s < longest), Math.min(longest, 3000)];
    for (const size of sizes) {
      const scale = Math.min(1, size / longest);
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(data.data, data.width, data.height, { inversionAttempts: "attemptBoth" });
      if (code?.data) return code.data;
    }
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}
