interface Props {
  className?: string;
}

/** Chữ song hỷ 囍, cỡ chữ và màu chỉnh bằng class (text-*) */
export default function DoubleHappiness({ className = "" }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block font-bold leading-none ${className}`}
      style={{ fontFamily: "'Songti SC', 'Noto Serif SC', 'Noto Serif CJK SC', serif" }}
    >
      囍
    </span>
  );
}
