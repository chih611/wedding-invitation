// Cấu hình của một thiệp (nhà gái hoặc nhà trai). Mỗi app tạo một WeddingConfig trong src/data
// rồi bọc ứng dụng bằng <WeddingProvider config={...}>. Component dùng chung đọc qua useWedding().
import { createContext, useContext } from "react";

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

export interface WeddingInfo {
  bride: Person;
  groom: Person;
  brideFamily: Family;
  groomFamily: Family;
  ceremony: WeddingEvent & { title: string; venue: string };
  reception: WeddingEvent & {
    venueType: string;
    venueName: string;
    hall: string;
    address: string;
    /** Chữ để tìm trên Google Maps */
    mapQuery: string;
  };
  /** Xoá hết các dòng thì phần lịch trình ẩn */
  schedule: ScheduleItem[];
  /** Google Form xác nhận tham dự. formUrl để trống thì form ẩn */
  rsvp: {
    formUrl: string;
    fields: { name: string; message: string; attending: string; companion: string; guestOf: string };
    attendingOptions: string[];
    companionOptions: string[];
    guestOfOptions: string[];
  };
  /** Nội dung chuyển khoản tự điền khi khách quét mã QR ngân hàng. "" thì khách tự ghi */
  giftMessage: string;
  /** Nhạc nền trong public/music. Không có file thì nút nhạc tự ẩn */
  music: { src: string; title: string };
}

export interface WeddingPhotos {
  /** Tên file ảnh trong album (packages/shared/src/assets/photos), đúng thứ tự hiện */
  album: string[];
  /** Ảnh lớn ở đầu thiệp (khung dọc 2:3) */
  hero: string;
  /** Vị trí cắt ảnh, "ngang dọc" theo %. 0% = sát trái/trên, 50% = giữa, 100% = sát phải/dưới */
  heroPosition: string;
  /** Ảnh ngang (khung 3:2) dưới lời mời */
  invite: string;
  /** Vị trí cắt ảnh invite (bỏ trống = giữa ảnh) */
  invitePosition?: string;
  /**
   * Ảnh invite là ảnh dọc mà muốn thấy trọn người: đặt ảnh giữa khung 3:2 với tỉ lệ này,
   * hai bên là chính ảnh đó làm mờ. Bỏ trống thì ảnh phủ kín khung như bình thường.
   */
  inviteInnerAspect?: "square" | "5/4";
  /** Hộp mừng cưới: ảnh nửa trái băng rôn */
  gift: string;
  /** Ảnh trên cùng cửa sổ mã QR (khung 3:2) */
  giftModal: string;
  giftModalPosition?: string;
}

export interface WeddingStyle {
  /** Màu vẽ mã QR mừng cưới (mã hex), thường là màu chữ chính */
  qrColor: string;
  /** Biểu tượng trang trí: trái tim, hoặc chữ song hỷ 囍 */
  symbol: "heart" | "double-happiness";
  /** Hoa văn dưới tiêu đề các phần: nhánh lá, hoặc hồi văn kiểu Trung Hoa */
  ornament: "leaf" | "fret";
  /** Chữ vị trí trong gia đình dài (ví dụ "Nhị Thiếu Gia") thì để ô rộng hơn */
  wideOrderLabels?: boolean;
}

export interface WeddingConfig {
  /** Thiệp của nhà nào: người / gia đình nhà đó đứng trước */
  host: "bride" | "groom";
  wedding: WeddingInfo;
  photos: WeddingPhotos;
  style: WeddingStyle;
  labels: {
    /** Tiêu đề trang /admin */
    adminTitle: string;
    /** Tiêu đề khung upload mã QR trong /admin */
    giftQrTitle: string;
  };
}

const WeddingContext = createContext<WeddingConfig | null>(null);

export function WeddingProvider({ config, children }: { config: WeddingConfig; children: React.ReactNode }) {
  return <WeddingContext.Provider value={config}>{children}</WeddingContext.Provider>;
}

/** Cấu hình thiệp hiện tại, kèm vài giá trị tính sẵn */
// eslint-disable-next-line react-refresh/only-export-components
export function useWedding() {
  const config = useContext(WeddingContext);
  if (!config) throw new Error("Thiếu <WeddingProvider> bọc ngoài ứng dụng.");
  const { wedding, host } = config;
  /** Thiệp nhà nào thì người / gia đình nhà đó đứng trước */
  const couple = host === "groom" ? [wedding.groom, wedding.bride] : [wedding.bride, wedding.groom];
  const families = host === "groom" ? [wedding.groomFamily, wedding.brideFamily] : [wedding.brideFamily, wedding.groomFamily];
  return { ...config, couple, families };
}
