import { motion } from "framer-motion";

/** Một chiếc lồng đèn đỏ treo bằng dây, có chữ 囍 và tua vàng */
function Lantern({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 140" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="lantern-body" cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#e2463a" />
          <stop offset="65%" stopColor="#b3191c" />
          <stop offset="100%" stopColor="#6e0d10" />
        </radialGradient>
      </defs>
      {/* dây treo */}
      <line x1="30" y1="0" x2="30" y2="30" stroke="#d8ad57" strokeWidth="1.2" />
      {/* nắp trên */}
      <rect x="20" y="28" width="20" height="6" rx="1.5" fill="#d8ad57" />
      {/* thân đèn */}
      <ellipse cx="30" cy="62" rx="27" ry="29" fill="url(#lantern-body)" />
      {/* các sọc dọc */}
      <g fill="none" stroke="#7e1013" strokeOpacity="0.55" strokeWidth="1">
        <ellipse cx="30" cy="62" rx="9" ry="29" />
        <ellipse cx="30" cy="62" rx="18" ry="29" />
      </g>
      <text
        x="30"
        y="70"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fill="#f3cf7a"
        fontFamily="'Songti SC', 'Noto Serif SC', 'Noto Serif CJK SC', serif"
      >
        囍
      </text>
      {/* nắp dưới */}
      <rect x="20" y="90" width="20" height="6" rx="1.5" fill="#d8ad57" />
      {/* tua */}
      <line x1="30" y1="96" x2="30" y2="104" stroke="#d8ad57" strokeWidth="1.5" />
      <path d="M24 104h12l2 32H22z" fill="#c9302c" />
      <g stroke="#e9c06a" strokeWidth="0.8" strokeOpacity="0.8">
        <line x1="26" y1="106" x2="25" y2="134" />
        <line x1="30" y1="106" x2="30" y2="135" />
        <line x1="34" y1="106" x2="35" y2="134" />
      </g>
      <rect x="23" y="103" width="14" height="3" rx="1" fill="#d8ad57" />
    </svg>
  );
}

/** Hai lồng đèn đung đưa nhẹ ở hai góc trên của một trang thiệp (đặt trong khung relative) */
export default function Lanterns() {
  const swing = (delay: number) => ({
    animate: { rotate: [-4, 4, -4] },
    transition: { duration: 4, delay, repeat: Infinity, ease: "easeInOut" as const },
    style: { transformOrigin: "50% 0%" },
  });
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10" aria-hidden="true">
      <motion.div className="absolute left-5 top-0 w-12 drop-shadow-lg sm:w-14" {...swing(0)}>
        <Lantern />
      </motion.div>
      <motion.div className="absolute right-5 top-0 w-12 drop-shadow-lg sm:w-14" {...swing(0.8)}>
        <Lantern />
      </motion.div>
    </div>
  );
}
