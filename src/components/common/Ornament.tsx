interface Props {
  className?: string;
}

/** Đường hoa văn mảnh: hai nhánh lá hai bên, trái tim nhỏ ở giữa. Dùng dưới tiêu đề các phần. */
export default function Ornament({ className = "" }: Props) {
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
