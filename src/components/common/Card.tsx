interface Props {
  children: React.ReactNode;
  className?: string;
}

/** Khung thiệp giấy trắng có viền mảnh bên trong */
export default function Card({ children, className = "" }: Props) {
  return (
    <article
      className={`relative mx-auto w-full max-w-[460px] bg-white px-6 py-10 text-center shadow-[0_10px_40px_-12px_rgb(29_44_107/0.25)] sm:px-10 ${className}`}
    >
      <div className="pointer-events-none absolute inset-2.5 border border-navy/15" aria-hidden="true" />
      <div className="relative">{children}</div>
    </article>
  );
}
