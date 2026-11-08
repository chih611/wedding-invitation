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

export type ScheduleIcon = "camera" | "rings" | "cheers" | "party" | "bouquet";

export interface ScheduleItem {
  time: string;
  title: string;
  icon: ScheduleIcon;
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

  /**
   * Lịch trình tiệc (nội dung mẫu, sửa lại cho đúng). Xoá hết các dòng thì phần này ẩn.
   * icon: camera (máy ảnh), rings (nhẫn), cheers (ly rượu), party (quả cầu disco), bouquet (bó hoa).
   */
  schedule: [
    { time: "11:00", title: "Đón khách", icon: "camera" },
    { time: "11:30", title: "Lễ cưới", icon: "rings" },
    { time: "12:00", title: "Khai tiệc", icon: "cheers" },
    { time: "13:00", title: "Hoạt động vui vẻ", icon: "party" },
    { time: "13:30", title: "Tung hoa", icon: "bouquet" },
  ] satisfies ScheduleItem[],

  /** Dress code (nội dung mẫu, sửa lại cho đúng). Xoá hết màu thì phần này ẩn. */
  dressCode: {
    note: "Chúng mình sẽ rất vui nếu bạn diện trang phục theo tông màu dưới đây",
    colors: [
      { name: "Trắng", hex: "#ffffff" },
      { name: "Xanh nhạt", hex: "#cfdcf2" },
      { name: "Xanh dương", hex: "#6f8fd0" },
      { name: "Xanh navy", hex: "#1d2c6b" },
    ],
  },

  /**
   * Form xác nhận tham dự, câu trả lời được gửi vào Google Form (xem README, mục "Form xác nhận tham dự").
   * formUrl lấy từ biến VITE_RSVP_FORM_URL trong .env (Vercel: Environment Variables). Để trống thì form ẩn khỏi thiệp.
   * Các lựa chọn bên dưới phải giống HỆT các lựa chọn trong Google Form (kể cả dấu, hoa thường).
   */
  rsvp: {
    formUrl: (import.meta.env.VITE_RSVP_FORM_URL ?? "").trim(),
    fields: {
      name: "entry.311504078",
      message: "entry.508937073",
      attending: "entry.2048936796",
      companion: "entry.1200854592",
      guestOf: "entry.2069028892",
    },
    attendingOptions: ["Mình sẽ đến", "Rất tiếc, mình không đến được"],
    companionOptions: ["1 người", "2 người", "3 người", "4 người"],
    guestOfOptions: ["Khách của cô dâu", "Khách của chú rể"],
  },

  /**
   * Nội dung chuyển khoản tự điền khi khách quét mã QR (chỉ với mã VietQR ngân hàng).
   * Để trống ("") thì khách tự ghi. Ngân hàng không nhận chữ có dấu nên sẽ tự bỏ dấu; tối đa 25 ký tự.
   */
  giftMessage: "",

  /**
   * Nhạc nền: đặt file mp3 vào public/music/ rồi ghi tên ở đây.
   * Không có file thì nút nhạc tự ẩn.
   */
  music: {
    src: "/music/hon-ca-yeu.mp3",
    title: "Hơn Cả Yêu",
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
