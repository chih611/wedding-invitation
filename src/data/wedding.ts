// Toàn bộ thông tin trên thiệp nằm ở đây. Muốn sửa chữ trên thiệp thì chỉ cần sửa file này.

export interface Family {
  label: string;
  father: string;
  mother: string;
  address: string;
}

export interface Person {
  fullName: string;
  shortName: string;
  /** Vị trí trong gia đình, ví dụ: Trưởng Nữ, Út Nam */
  order: string;
}

export interface WeddingEvent {
  /** Thời điểm bắt đầu, luôn ghi kèm múi giờ Việt Nam (+07:00) */
  start: string;
  /** Thời lượng dự kiến (giờ), dùng cho nút "Thêm vào lịch" */
  durationHours: number;
  timeLabel: string;
  lunarDate: string;
}

export const wedding = {
  bride: {
    fullName: "Bùi Thị Thu Hương",
    shortName: "Thu Hương",
    order: "Trưởng Nữ",
  } satisfies Person,

  groom: {
    fullName: "Thái Chí Quyền",
    shortName: "Chí Quyền",
    order: "Út Nam",
  } satisfies Person,

  brideFamily: {
    label: "Nhà Gái",
    father: "Bùi Ngọc Hiếu",
    mother: "Trần Thị Thanh",
    address: "P. Hàng Gòn, TP. Đồng Nai",
  } satisfies Family,

  groomFamily: {
    label: "Nhà Trai",
    father: "Thái Quốc Lương",
    mother: "Lương Hoa",
    address: "P. Hòa Bình, TP. HCM",
  } satisfies Family,

  ceremony: {
    title: "Lễ Vu Quy",
    venue: "Tư gia nhà gái",
    start: "2026-12-19T08:30:00+07:00",
    durationHours: 2,
    timeLabel: "08 giờ 30",
    lunarDate: "Nhằm ngày 11 tháng 11 năm Bính Ngọ",
  },

  reception: {
    venueType: "Nhà hàng",
    venueName: "Cát Tường Garden",
    hall: "Sảnh Lầu",
    address: "178 Khổng Tử, Phường Long Khánh, TP. Đồng Nai",
    mapQuery: "Nhà hàng Cát Tường Garden, 178 Khổng Tử, Long Khánh, Đồng Nai",
    start: "2026-12-19T11:00:00+07:00",
    durationHours: 3,
    timeLabel: "11H00",
    lunarDate: "Nhằm ngày 11 tháng 11 năm Bính Ngọ",
  },
};

export const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  wedding.reception.mapQuery,
)}`;

/** Tạo link Google Calendar cho một sự kiện */
export function googleCalendarUrl(
  title: string,
  event: Pick<WeddingEvent, "start" | "durationHours">,
  location: string,
  details = "",
) {
  const start = new Date(event.start);
  const end = new Date(start.getTime() + event.durationHours * 3600_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    location,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
