// Toàn bộ thông tin trên thiệp nằm ở đây. Muốn sửa chữ trên thiệp thì chỉ cần sửa file này.
import type { WeddingInfo } from "@wedding/shared";

export const wedding = {
  bride: {
    fullName: "Bùi Thị Thu Hương",
    shortName: "Thu Hương",
    order: "Trưởng Nữ",
  },

  groom: {
    fullName: "Thái Chí Quyền",
    shortName: "Chí Quyền",
    order: "Út Nam",
  },

  brideFamily: {
    label: "Nhà Gái",
    father: "Bùi Ngọc Hiếu",
    mother: "Trần Thị Thanh",
    address: "P. Hàng Gòn, TP. Đồng Nai",
  },

  groomFamily: {
    label: "Nhà Trai",
    father: "Thái Quốc Lương",
    mother: "Lương Hoa",
    address: "P. Hòa Bình, TP. HCM",
  },

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
  ],

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
} satisfies WeddingInfo;
