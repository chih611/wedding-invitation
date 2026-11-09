/**
 * API mã QR mừng cưới (chạy trên Vercel, lưu trong Vercel Blob).
 *   GET  /api/gift          → { qr }   ai cũng đọc được (thiệp cần để hiện mã QR)
 *   PUT  /api/gift { qr }   → { qr }   chỉ admin (Basic auth = ADMIN_USERNAME / ADMIN_PASSWORD)
 * qr là chuỗi đã mã hoá như trong src/utils/gift.ts; gửi "" để xoá.
 *
 * Cần trên Vercel: biến môi trường ADMIN_USERNAME, ADMIN_PASSWORD và một Blob store nối với project
 * (Vercel tự thêm BLOB_READ_WRITE_TOKEN).
 */
import { timingSafeEqual } from "node:crypto";
import { get, put } from "@vercel/blob";

const PATHNAME = "wedding/gift-qr.json";
const MAX_LENGTH = 512;
type Access = "public" | "private";
const ACCESS_ORDER: Access[] = ["public", "private"];

function json(body: unknown, status = 200, cache = "no-store") {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": cache },
  });
}

/** Blob store có thể là loại public hoặc private (chọn lúc tạo), thử lần lượt cả hai */
async function withAccess<T>(run: (access: Access) => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (const access of ACCESS_ORDER) {
    try {
      return await run(access);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

async function readQr(): Promise<string> {
  const result = await withAccess((access) => get(PATHNAME, { access, useCache: false }));
  if (!result || result.statusCode !== 200) return "";
  const data = JSON.parse(await new Response(result.stream).text()) as { qr?: unknown };
  return typeof data.qr === "string" ? data.qr : "";
}

function sameText(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function isAdmin(request: Request) {
  const username = (process.env.ADMIN_USERNAME ?? "").trim();
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!username || !password) return false;

  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return false;
  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const sep = decoded.indexOf(":");
  if (sep === -1) return false;
  // Không dừng sớm, để thời gian trả lời không lộ phần nào sai
  const userOk = sameText(decoded.slice(0, sep).trim(), username);
  const passOk = sameText(decoded.slice(sep + 1), password);
  return userOk && passOk;
}

export async function GET(request: Request) {
  // Admin thêm ?fresh=1 để luôn lấy bản mới nhất; khách thì cho bộ nhớ đệm của Vercel giữ 30 giây
  const fresh = new URL(request.url).searchParams.has("fresh");
  try {
    const qr = await readQr();
    return json({ qr }, 200, fresh ? "no-store" : "public, s-maxage=30, stale-while-revalidate=300");
  } catch (e) {
    console.error("Đọc mã QR thất bại", e);
    return json({ qr: "", error: "storage" }, 503);
  }
}

export async function PUT(request: Request) {
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    return json({ error: "Máy chủ chưa đặt ADMIN_USERNAME / ADMIN_PASSWORD." }, 500);
  }
  if (!isAdmin(request)) return json({ error: "Sai tài khoản admin." }, 401);

  const body = (await request.json().catch(() => null)) as { qr?: unknown } | null;
  const qr = typeof body?.qr === "string" ? body.qr.trim() : null;
  if (qr === null || qr.length > MAX_LENGTH) return json({ error: "Mã QR không hợp lệ." }, 400);

  try {
    await withAccess((access) =>
      put(PATHNAME, JSON.stringify({ qr, updatedAt: new Date().toISOString() }), {
        access,
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
        cacheControlMaxAge: 60,
      }),
    );
    return json({ qr });
  } catch (e) {
    console.error("Lưu mã QR thất bại", e);
    return json({ error: "Không lưu được. Kiểm tra Blob store đã nối với project trên Vercel chưa." }, 503);
  }
}
