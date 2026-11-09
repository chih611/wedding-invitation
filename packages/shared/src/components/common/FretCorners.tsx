/** Bốn góc hoa văn hồi văn (回) màu vàng, đặt trong một khung có position: relative */
export default function FretCorners({ className = "inset-5" }: { className?: string }) {
  const corner = (
    <svg viewBox="0 0 40 40" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
      <path d="M2 38V2h36" />
      <path d="M9 30V9h21" />
      <path d="M16 24V16h8v6h-4" />
    </svg>
  );
  const pos = ["left-0 top-0", "right-0 top-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"];
  return (
    <div className={`pointer-events-none absolute text-royal ${className}`} aria-hidden="true">
      {pos.map((p) => (
        <span key={p} className={`absolute h-9 w-9 ${p}`}>
          {corner}
        </span>
      ))}
    </div>
  );
}
