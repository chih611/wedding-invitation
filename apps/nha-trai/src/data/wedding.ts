// Thiệp NHÀ TRAI (thông tin theo thiệp giấy). Toàn bộ thông tin trên thiệp nằm ở đây. Muốn sửa chữ trên thiệp thì chỉ cần sửa file này.
import type { WeddingInfo } from "@wedding/shared";

export const wedding = {
  bride: {
    fullName: "Bùi Thị Thu Hương",
    shortName: "Thu Hương",
    order: "Đại Tiểu Thư",
  },

  groom: {
    fullName: "Thái Chí Quyền",
    shortName: "Chí Quyền",
    order: "Nhị Thiếu Gia",
  },

  brideFamily: {
    label: "Nhà Gái",
    father: "Bùi Ngọc Hiếu",
    mother: "Trần Thị Thanh",
    address: "Long Khánh, Đồng Nai",
  },

  groomFamily: {
    label: "Nhà Trai",
    father: "Thái Quốc Lương",
    mother: "Lương Hoa",
    address: "Phường Hòa Bình, TP.HCM",
  },

  ceremony: {
    title: "Lễ Thành Hôn",
    venue: "Tư gia",
    start: "2026-12-20T09:00:00+07:00",
    durationHours: 2,
    timeLabel: "09 giờ 00",
    lunarDate: "Nhằm ngày 12 tháng 11 năm Bính Ngọ",
  },

  reception: {
    venueType: "Trung Tâm Hội Nghị Tiệc Cưới",
    venueName: "Asiana Plaza",
    hall: "Sảnh Sonas · Lầu 6",
    address: "Số 284 - 286 Vườn Lài, Phường Phú Thọ Hòa, TP.HCM",
    mapQuery: "Trung tâm Hội nghị Tiệc cưới Asiana Plaza, 284 Vườn Lài, Phú Thọ Hòa, TP.HCM",
    start: "2026-12-20T17:00:00+07:00",
    durationHours: 4,
    timeLabel: "17H00",
    lunarDate: "Nhằm ngày 12 tháng 11 năm Bính Ngọ",
  },

  /**
   * Lịch trình tiệc. Xoá hết các dòng thì phần này ẩn.
   * icon: camera (máy ảnh), rings (nhẫn), cheers (ly rượu), party (quả cầu disco), bouquet (bó hoa).
   */
  schedule: [
    { time: "17:30", title: "Đón khách", icon: "camera" },
    { time: "19:00", title: "Lễ cưới", icon: "rings" },
    { time: "19:30", title: "Khai tiệc", icon: "cheers" },
    { time: "20:30", title: "Hoạt động vui vẻ", icon: "party" },
    { time: "21:00", title: "Tung hoa", icon: "bouquet" },
  ],

  /**
   * Form xác nhận tham dự, câu trả lời được gửi vào Google Form (xem README, mục "Form xác nhận tham dự").
   * formUrl lấy từ biến VITE_RSVP_FORM_URL trong .env (Vercel: Environment Variables). Để trống thì form ẩn khỏi thiệp.
   * Các lựa chọn bên dưới phải giống HỆT các lựa chọn trong Google Form (kể cả dấu, hoa thường).
   */
  rsvp: {
    formUrl: (import.meta.env.VITE_RSVP_FORM_URL ?? "").trim(),
    fields: {
      name: "entry.1715066311",
      message: "entry.1612446770",
      attending: "entry.1363508337",
      companion: "entry.1670851005",
      guestOf: "entry.1355248234",
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
} satisfies WeddingInfo;
