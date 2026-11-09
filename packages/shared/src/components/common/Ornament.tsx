import { useWedding } from "../../config";

interface Props {
  className?: string;
}

/** Hoa văn mảnh dưới tiêu đề các phần. Kiểu hoa văn theo style.ornament trong cấu hình thiệp */
export default function Ornament({ className = "" }: Props) {
  const { ornament } = useWedding().style;
  return ornament === "fret" ? <FretOrnament className={className} /> : <LeafOrnament className={className} />;
}

/** Hai nhánh lá hai bên, trái tim nhỏ ở giữa */
function LeafOrnament({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 240 24"
      className={`mx-auto h-5 w-48 text-royal ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M8 12h82" />
      <path d="M150 12h82" />
      <path d="M90 12c-6-7-14-7-18-3M90 12c-6 7-14 7-18 3M74 12c-5-5-11-5-14-2M74 12c-5 5-11 5-14 2" />
      <path d="M150 12c6-7 14-7 18-3M150 12c6 7 14 7 18 3M166 12c5-5 11-5 14-2M166 12c5 5 11 5 14 2" />
      <path
        d="M120 19s-9-5.2-9-10.6A4.6 4.6 0 0 1 120 6a4.6 4.6 0 0 1 9 2.4C129 13.8 120 19 120 19Z"
        fill="currentColor"
        stroke="none"
      />
      <circle cx="100" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="140" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Kiểu Trung Hoa: hai đường mảnh có móc hồi văn ở đầu, chữ 囍 ở giữa */
function FretOrnament({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 240 24"
      className={`mx-auto h-5 w-48 text-royal ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="square"
      aria-hidden="true"
    >
      {/* đường hai bên, đầu móc vuông như hồi văn */}
      <path d="M100 12H14V6h6v4h-3" />
      <path d="M140 12h86V6h-6v4h3" />
      {/* hai hạt thoi nhỏ */}
      <path d="M100 12l3-3 3 3-3 3z" fill="currentColor" stroke="none" />
      <path d="M140 12l-3-3-3 3 3 3z" fill="currentColor" stroke="none" />
      <text
        x="120"
        y="18.5"
        textAnchor="middle"
        fontSize="17"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
        fontFamily="'Songti SC', 'Noto Serif SC', 'Noto Serif CJK SC', serif"
      >
        囍
      </text>
    </svg>
  );
}
