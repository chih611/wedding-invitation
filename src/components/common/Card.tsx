interface Props {
  children: React.ReactNode;
  className?: string;
}

/** Một trang thiệp trong cột thiệp, có viền mảnh bên trong như thiệp giấy */
export default function Card({ children, className = "bg-white" }: Props) {
  return (
    <article className={`relative w-full px-6 py-12 text-center sm:px-10 ${className}`}>
      <div className="pointer-events-none absolute inset-3 border border-navy/15" aria-hidden="true" />
      <div className="relative">{children}</div>
    </article>
  );
}
