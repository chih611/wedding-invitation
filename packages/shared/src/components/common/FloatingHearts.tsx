import Heart from "./Heart";
import { useWedding } from "../../config";

// Vị trí cố định (không random) để lần render nào cũng giống nhau
const HEARTS = [
  { left: "6%", size: 14, duration: 16, delay: 0, opacity: 0.4 },
  { left: "18%", size: 10, duration: 20, delay: 6, opacity: 0.32 },
  { left: "32%", size: 18, duration: 18, delay: 11, opacity: 0.28 },
  { left: "50%", size: 12, duration: 22, delay: 3, opacity: 0.35 },
  { left: "66%", size: 16, duration: 17, delay: 8, opacity: 0.32 },
  { left: "80%", size: 11, duration: 21, delay: 14, opacity: 0.4 },
  { left: "92%", size: 15, duration: 19, delay: 4, opacity: 0.3 },
];

/** Tim bay nhẹ trên toàn trang (nằm trên thiệp nhưng không chặn bấm, dưới nút nhạc và cửa sổ) */
function FloatingHeartIcons() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
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

// Vị trí cố định (không random) để lần render nào cũng giống nhau
const HY_ITEMS = [
  { left: "6%", size: 18, duration: 16, delay: 0, opacity: 0.4 },
  { left: "18%", size: 14, duration: 20, delay: 6, opacity: 0.32 },
  { left: "32%", size: 22, duration: 18, delay: 11, opacity: 0.28 },
  { left: "50%", size: 16, duration: 22, delay: 3, opacity: 0.35 },
  { left: "66%", size: 20, duration: 17, delay: 8, opacity: 0.32 },
  { left: "80%", size: 15, duration: 21, delay: 14, opacity: 0.4 },
  { left: "92%", size: 19, duration: 19, delay: 4, opacity: 0.3 },
];

/** Chữ song hỷ 囍 bay nhẹ trên toàn trang (nằm trên thiệp nhưng không chặn bấm, dưới nút nhạc và cửa sổ) */
function FloatingDoubleHappiness() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      {HY_ITEMS.map((h, i) => (
        <span
          key={i}
          className="floating-heart absolute -bottom-8 font-serif font-bold leading-none text-royal"
          style={
            {
              left: h.left,
              fontSize: h.size,
              animationDuration: `${h.duration}s`,
              animationDelay: `${h.delay}s`,
              "--heart-opacity": h.opacity,
            } as React.CSSProperties
          }
        >
          囍
        </span>
      ))}
    </div>
  );
}

/** Họa tiết bay nhẹ trên toàn trang: trái tim, hoặc chữ 囍 (theo style.symbol trong cấu hình thiệp) */
export default function FloatingHearts() {
  const { symbol } = useWedding().style;
  return symbol === "double-happiness" ? <FloatingDoubleHappiness /> : <FloatingHeartIcons />;
}
