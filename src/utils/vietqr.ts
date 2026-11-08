/**
 * Tạo nội dung mã QR chuyển khoản theo chuẩn VietQR (NAPAS / EMVCo).
 * Quét bằng app của mọi ngân hàng Việt Nam sẽ tự điền ngân hàng, số tài khoản và nội dung.
 */

/** Mã BIN của các ngân hàng phổ biến (theo NAPAS) */
export const BANK_BINS = {
  Vietcombank: "970436",
  VietinBank: "970415",
  BIDV: "970418",
  Agribank: "970405",
  Techcombank: "970407",
  MBBank: "970422",
  ACB: "970416",
  VPBank: "970432",
  TPBank: "970423",
  Sacombank: "970403",
  HDBank: "970437",
  VIB: "970441",
  SHB: "970443",
  Eximbank: "970431",
  MSB: "970426",
  OCB: "970448",
  SeABank: "970440",
  LPBank: "970449",
  NamABank: "970428",
  PVcomBank: "970412",
  BacABank: "970409",
  VietABank: "970427",
  ABBANK: "970425",
  KienlongBank: "970452",
  NCB: "970419",
  VietBank: "970433",
  BaoVietBank: "970438",
  PGBank: "970430",
  GPBank: "970408",
  SaigonBank: "970400",
  ShinhanBank: "970424",
  CAKE: "546034",
  Ubank: "546035",
  Timo: "963388",
} as const;

/** Tên ngân hàng theo mã BIN, không có trong danh sách thì trả về "" */
export function bankNameFromBin(bin: string) {
  return Object.entries(BANK_BINS).find(([, b]) => b === bin)?.[0] ?? "";
}

/** Một trường dữ liệu: mã (2 số) + độ dài (2 số) + giá trị */
function field(id: string, value: string) {
  return id + String(value.length).padStart(2, "0") + value;
}

/** CRC16-CCITT (poly 0x1021, bắt đầu 0xFFFF) theo chuẩn EMVCo */
function crc16(text: string) {
  let crc = 0xffff;
  for (let i = 0; i < text.length; i++) {
    crc ^= text.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/** Bỏ dấu tiếng Việt và ký tự lạ, vì nội dung chuyển khoản chỉ nên có chữ không dấu */
export function toTransferText(text: string, maxLength = 25) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength)
    .trim();
}

export function buildVietQrPayload(bin: string, accountNumber: string, message = "") {
  const beneficiary = field("00", bin) + field("01", accountNumber);
  const merchantInfo = field("00", "A000000727") + field("01", beneficiary) + field("02", "QRIBFTTA");

  let payload =
    field("00", "01") + // phiên bản
    field("01", "11") + // QR tĩnh, khách tự nhập số tiền
    field("38", merchantInfo) +
    field("53", "704") + // VND
    field("58", "VN");

  const purpose = toTransferText(message);
  if (purpose) payload += field("62", field("08", purpose));

  payload += "6304";
  return payload + crc16(payload);
}

/** Tách chuỗi EMVCo thành các trường { mã: giá trị }. Sai định dạng thì trả về null. */
function parseFields(text: string): Record<string, string> | null {
  const out: Record<string, string> = {};
  let i = 0;
  while (i < text.length) {
    const id = text.slice(i, i + 2);
    const lenText = text.slice(i + 2, i + 4);
    const len = Number(lenText);
    if (!/^\d{2}$/.test(id) || !/^\d{2}$/.test(lenText) || i + 4 + len > text.length) return null;
    out[id] = text.slice(i + 4, i + 4 + len);
    i += 4 + len;
  }
  return out;
}

export interface VietQrInfo {
  bin: string;
  accountNumber: string;
  /** Tên chủ tài khoản nếu mã QR có ghi (nhiều ngân hàng không ghi) */
  accountName: string;
}

/**
 * Đọc mã ngân hàng + số tài khoản từ nội dung mã QR chuyển khoản VietQR.
 * Mã không phải VietQR chuyển tới tài khoản (ví dụ MoMo, ZaloPay) thì trả về null.
 */
export function parseVietQr(payload: string): VietQrInfo | null {
  const top = parseFields(payload.trim());
  if (!top?.["38"]) return null;
  const merchant = parseFields(top["38"]);
  if (merchant?.["00"] !== "A000000727" || !merchant["01"]) return null;
  const beneficiary = parseFields(merchant["01"]);
  const bin = beneficiary?.["00"] ?? "";
  const accountNumber = beneficiary?.["01"] ?? "";
  if (!/^\d{6}$/.test(bin) || !/^[A-Za-z0-9]{1,19}$/.test(accountNumber)) return null;

  const name = (top["59"] ?? "").trim();
  return { bin, accountNumber, accountName: /^napas/i.test(name) ? "" : name };
}
