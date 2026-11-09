import FretCorners from "./FretCorners";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Viền bên trong trang thiệp, mặc định là đường mảnh nhạt */
  frameClassName?: string;
  /** Thêm bốn góc hoa văn hồi văn màu vàng */
  corners?: boolean;
  /** Trang trí đặt theo mép của trang (ví dụ lồng đèn), không nằm trong phần nội dung */
  decoration?: React.ReactNode;
}

/** Một trang thiệp trong cột thiệp, có viền mảnh bên trong như thiệp giấy */
export default function Card({ children, className = "bg-white", frameClassName = "border border-navy/15", corners = false, decoration }: Props) {
  return (
    <article className={`relative w-full px-6 py-12 text-center sm:px-10 ${className}`}>
      <div className={`pointer-events-none absolute inset-3 ${frameClassName}`} aria-hidden="true" />
      {corners && <FretCorners className="inset-6" />}
      {decoration}
      <div className="relative">{children}</div>
    </article>
  );
}
