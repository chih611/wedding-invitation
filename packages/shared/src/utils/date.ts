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

/** Các ô của lịch tháng, tuần bắt đầu từ thứ Hai. Ô trống đầu tháng là null. month: 1 - 12 */
export function monthCells(year: number, month: number): (number | null)[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  // getDay(): 0 = Chủ nhật. Đổi sang 0 = thứ Hai.
  const leadingBlanks = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  return [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
}
