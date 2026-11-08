import { adminAuthHeader } from "./auth";

/**
 * Đọc / lưu mã QR mừng cưới trên server (api/gift.ts, chạy trên Vercel).
 * Chạy `npm run dev` trên máy thì không có server này: đọc trả về "", lưu báo lỗi.
 */

const ENDPOINT = "/api/gift";

export class GiftApiError extends Error {}

async function parse(res: Response) {
  const type = res.headers.get("content-type") ?? "";
  // Không có API (chạy npm run dev) thì server trả về trang HTML thay vì JSON
  if (!type.includes("application/json")) {
    throw new GiftApiError("Không có máy chủ lưu mã QR. Phần này chỉ chạy trên bản đã deploy lên Vercel.");
  }
  const data = (await res.json()) as { qr?: string; error?: string };
  if (!res.ok) throw new GiftApiError(data.error || `Máy chủ báo lỗi (${res.status}).`);
  return data.qr ?? "";
}

/** Mã QR đang lưu trên server. fresh: bỏ qua bộ nhớ đệm (dùng ở trang admin) */
export async function fetchGift(fresh = false): Promise<string> {
  const res = await fetch(fresh ? `${ENDPOINT}?fresh=${Date.now()}` : ENDPOINT, {
    cache: fresh ? "no-store" : "default",
  });
  return parse(res);
}

/** Lưu mã QR lên server (cần đã đăng nhập admin). Gửi "" để xoá. */
export async function saveGift(qr: string): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...adminAuthHeader() },
    body: JSON.stringify({ qr }),
  });
  return parse(res);
}
