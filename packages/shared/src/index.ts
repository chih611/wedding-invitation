// Code dùng chung cho thiệp nhà gái (apps/nha-gai) và nhà trai (apps/nha-trai).
// App chỉ cần: dữ liệu thiệp (WeddingConfig), màu sắc (index.css) và bố cục trang thiệp.

export { WeddingProvider, useWedding } from "./config";
export type {
  Family,
  Person,
  ScheduleIcon,
  ScheduleItem,
  WeddingConfig,
  WeddingEvent,
  WeddingInfo,
  WeddingPhotos,
  WeddingStyle,
} from "./config";

export { default as AppRouter } from "./routes/AppRouter";
export { useGuestName } from "./hooks/useGuestName";

// Khung, chữ, hoa văn
export { default as AnimatedText } from "./components/common/AnimatedText";
export { default as Card } from "./components/common/Card";
export { default as DoubleHappiness } from "./components/common/DoubleHappiness";
export { default as FloatingHearts } from "./components/common/FloatingHearts";
export { default as FretCorners } from "./components/common/FretCorners";
export { default as Heart } from "./components/common/Heart";
export { default as Monogram } from "./components/common/Monogram";
export { default as Ornament } from "./components/common/Ornament";
export { default as Section } from "./components/common/Section";

// Các phần của thiệp
export { default as Calendar } from "./components/invitation/Calendar";
export { default as CeremonyInfo } from "./components/invitation/CeremonyInfo";
export { default as Countdown } from "./components/invitation/Countdown";
export { default as CoupleNames } from "./components/invitation/CoupleNames";
export { default as FamilyInfo } from "./components/invitation/FamilyInfo";
export { default as GiftBox } from "./components/invitation/GiftBox";
export { default as Lanterns } from "./components/invitation/Lanterns";
export { default as MusicPlayer } from "./components/invitation/MusicPlayer";
export { default as PhotoAlbum } from "./components/invitation/PhotoAlbum";
export { default as PhotoHero } from "./components/invitation/PhotoHero";
export { default as ReceptionInfo } from "./components/invitation/ReceptionInfo";
export { default as Rsvp } from "./components/invitation/Rsvp";
export { default as SaveTheDate } from "./components/invitation/SaveTheDate";
export { default as Schedule } from "./components/invitation/Schedule";
export { default as VenueActions } from "./components/invitation/VenueActions";
