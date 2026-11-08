const VN_TIME_ZONE = "Asia/Ho_Chi_Minh";

/** Lấy [ngày, tháng, năm] theo giờ Việt Nam, dù người xem đang ở múi giờ nào */
export function toVietnamDateParts(iso: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: VN_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return [get("day"), get("month"), get("year")] as const;
}
