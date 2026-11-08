const HEADER_WORDS = /^(stt|tt|tên|họ tên|họ và tên|tên khách|khách mời|name|ghi chú)$/i;

/**
 * Tách danh sách tên khách từ chữ người dùng dán vào.
 * Hỗ trợ dán thẳng từ Excel / Google Sheets (nhiều cột, có cột STT),
 * danh sách đánh số "1. Anh Nam", gạch đầu dòng "- Chị Lan".
 * Bỏ dòng trống, dòng tiêu đề và tên trùng.
 */
export function parseGuestNames(text: string): string[] {
  const seen = new Set<string>();
  const names: string[] = [];

  for (const line of text.split(/\r?\n/)) {
    const cells = line
      .split("\t")
      .map((c) => c.trim())
      .filter(Boolean);
    // Bỏ cột chỉ có số (cột STT), lấy cột chữ đầu tiên làm tên
    const cell = cells.find((c) => !/^\d+[.)]?$/.test(c)) ?? "";
    const name = cell
      .replace(/^\d+\s*[.)/-]\s*/, "")
      .replace(/^[-•*+]\s+/, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 60);

    if (!name || HEADER_WORDS.test(name)) continue;

    const key = name.toLocaleLowerCase("vi");
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(name);
  }

  return names;
}

/** Link thiệp: tên khách (?to=) đứng trước, sau đó là các tham số khác (mã QR mừng cưới) */
export function invitationUrl(origin: string, name: string, extraQuery = "") {
  const parts = [name ? `to=${encodeURIComponent(name)}` : "", extraQuery].filter(Boolean);
  return parts.length ? `${origin}/?${parts.join("&")}` : `${origin}/`;
}

/** Bỏ dấu tiếng Việt, viết thường: "Họ và Tên" → "ho va ten" */
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const NAME_HEADER = /\bten\b|\bname\b|khach|guest/;
const PREFIX_HEADER = /xung ho|danh xung|goi la|prefix|title/;

export interface ExtractResult {
  names: string[];
  /** Tên cột đã dùng làm tên khách, để báo lại cho người dùng */
  column: string;
}

/**
 * Lấy tên khách từ bảng (các dòng của 1 sheet Excel).
 * - Có dòng tiêu đề chứa "Tên" / "Họ và tên" / "Khách mời"... → lấy cột đó.
 *   Nếu có thêm cột "Xưng hô" (Anh, Chị, Cô...) thì ghép vào trước tên.
 * - Không có tiêu đề → lấy cột có nhiều chữ nhất.
 */
export function extractGuestNames(rows: string[][]): ExtractResult {
  const clean = rows.map((r) => r.map((c) => String(c ?? "").trim()));

  // Tìm dòng tiêu đề trong 10 dòng đầu. Dòng tiêu đề phải có ít nhất 2 ô,
  // để không nhầm với dòng tựa lớn kiểu "DANH SÁCH KHÁCH MỜI".
  for (let i = 0; i < Math.min(10, clean.length); i++) {
    if (clean[i].filter(Boolean).length < 2) continue;
    const headers = clean[i].map(normalize);
    const nameCol = headers.findIndex(
      (h) => h && h.length <= 30 && NAME_HEADER.test(h) && !PREFIX_HEADER.test(h),
    );
    if (nameCol === -1) continue;

    const prefixCol = headers.findIndex((h) => h && PREFIX_HEADER.test(h));
    const lines = clean.slice(i + 1).map((r) => {
      const name = r[nameCol] ?? "";
      const prefix = prefixCol === -1 ? "" : (r[prefixCol] ?? "");
      return name ? `${prefix} ${name}`.trim() : "";
    });
    const names = parseGuestNames(lines.join("\n"));
    if (names.length === 0) continue;
    const column = prefixCol === -1 ? clean[i][nameCol] : `${clean[i][prefixCol]} + ${clean[i][nameCol]}`;
    return { names, column };
  }

  // Không có tiêu đề: chọn cột có nhiều ô chữ nhất
  const width = Math.max(0, ...clean.map((r) => r.length));
  let best = -1;
  let bestCount = 0;
  for (let c = 0; c < width; c++) {
    const count = clean.filter((r) => /\p{L}/u.test(r[c] ?? "")).length;
    if (count > bestCount) {
      best = c;
      bestCount = count;
    }
  }
  if (best === -1) return { names: [], column: "" };

  return {
    names: parseGuestNames(clean.map((r) => r[best] ?? "").join("\n")),
    column: `cột ${String.fromCharCode(65 + best)}`,
  };
}
