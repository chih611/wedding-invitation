import Heart from "./Heart";

// Vị trí cố định (không random) để lần render nào cũng giống nhau
const HEARTS = [
  { left: "6%", size: 14, duration: 16, delay: 0, opacity: 0.18 },
  { left: "18%", size: 10, duration: 20, delay: 6, opacity: 0.14 },
  { left: "32%", size: 18, duration: 18, delay: 11, opacity: 0.12 },
  { left: "50%", size: 12, duration: 22, delay: 3, opacity: 0.15 },
  { left: "66%", size: 16, duration: 17, delay: 8, opacity: 0.14 },
  { left: "80%", size: 11, duration: 21, delay: 14, opacity: 0.18 },
  { left: "92%", size: 15, duration: 19, delay: 4, opacity: 0.13 },
];

/** Tim bay nhẹ ở nền trang */
export default function FloatingHearts() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {HEARTS.map((h, i) => (
        <span
          key={i}
          className="floating-heart absolute -bottom-8 text-royal"
          style={
            {
              left: h.left,
              width: h.size,
              height: h.size,
              animationDuration: `${h.duration}s`,
              animationDelay: `${h.delay}s`,
              "--heart-opacity": h.opacity,
            } as React.CSSProperties
          }
        >
          <Heart className="h-full w-full" />
        </span>
      ))}
    </div>
  );
}
