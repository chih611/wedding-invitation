import { motion } from "framer-motion";
import Section from "../common/Section";
import { useWedding } from "../../config";
import { photoUrl } from "../../utils/photos";
import { monthCells, toVietnamDateParts } from "../../utils/date";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

/**
 * Thẻ lịch giấy đặt trên phong bì đỏ có con dấu sáp, lời mời ngắn, rồi một ảnh ngang.
 * Phong bì và con dấu vẽ bằng CSS/SVG nên không cần file ảnh.
 * Màu phong bì, con dấu, thẻ lịch lấy từ biến CSS (--envelope-*, --seal-*, --stamp-paper, --color-ink)
 * đặt trong src/index.css của từng app.
 */
export default function SaveTheDate() {
  const { wedding, couple, photos } = useWedding();
  const [dd, mm, yyyy] = toVietnamDateParts(wedding.reception.start);
  const day = Number(dd);
  const month = Number(mm);
  const cells = monthCells(Number(yyyy), month);

  return (
    <div className="w-full bg-white pt-12">
      <Section className="relative mx-5 pb-2 pt-2">
        {/* Phong bì */}
        <motion.div
          className="absolute right-0 top-0 aspect-[4/3] w-[66%] rounded-[3px] shadow-[0_12px_30px_-10px_var(--envelope-shadow)]"
          style={{ background: "linear-gradient(160deg, var(--envelope-light) 0%, var(--envelope) 55%, var(--envelope-dark) 100%)" }}
          initial={{ opacity: 0, x: 40, rotate: 4 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
            {/* nắp phong bì và hai nếp gấp dưới */}
            <path d="M0 0 L200 150 L400 0" fill="rgb(0 0 0 / 0.08)" stroke="rgb(0 0 0 / 0.25)" strokeWidth="1.2" />
            <path d="M0 300 L170 140 M400 300 L230 140" stroke="rgb(0 0 0 / 0.18)" strokeWidth="1" fill="none" />
          </svg>
          <WaxSeal className="absolute left-1/2 top-1/2 w-[24%] -translate-x-1/2 -translate-y-[45%]" />
        </motion.div>

        {/* Thẻ lịch giấy */}
        <motion.div
          className="relative mt-[22%] w-[74%] -rotate-1 bg-[var(--stamp-paper)] px-3 pb-4 pt-3 text-center text-ink shadow-[0_14px_30px_-8px_color-mix(in_srgb,var(--color-navy)_55%,transparent)] sm:px-4"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgb(255 255 255 / 0.7), transparent 45%), radial-gradient(circle at 85% 90%, color-mix(in srgb, var(--color-royal) 8%, transparent), transparent 50%)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
        >
          <p className="font-script text-[clamp(1.6rem,7vw,2.1rem)] leading-tight text-royal">Tháng {month}</p>
          <div className="mt-1 grid grid-cols-7 gap-y-1 text-[clamp(0.55rem,2.4vw,0.7rem)] font-medium">
            {WEEKDAYS.map((d) => (
              <span key={d} className="pb-1 tracking-wide">
                {d}
              </span>
            ))}
            {cells.map((value, i) => (
              <span key={i} className="relative flex h-6 items-center justify-center tabular-nums">
                {value === day && (
                  // Trái tim tự vẽ nét khi cuộn tới, vẽ xong thì đập nhẹ liên tục
                  <motion.svg
                    viewBox="0 0 24 24"
                    className="absolute h-7 w-7 text-royal"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    aria-hidden="true"
                    animate={{ scale: [1, 1.18, 1, 1.1, 1] }}
                    transition={{ duration: 1.4, delay: 2.2, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
                  >
                    <motion.path
                      d="M12 20.5s-8-4.9-8-10.6A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 8 2.6c0 5.7-8 10.6-8 10.6Z"
                      initial={{ pathLength: 0, opacity: 0, fillOpacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1, fillOpacity: 0.12 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.9 }}
                      fill="currentColor"
                    />
                  </motion.svg>
                )}
                <span className={value === day ? "relative font-bold text-royal" : ""}>
                  {value === null ? "" : String(value).padStart(2, "0")}
                </span>
              </span>
            ))}
          </div>
        </motion.div>
      </Section>

      <Section className="mt-10 px-5 text-center">
        <p className="text-balance font-serif text-[clamp(1rem,4.2vw,1.15rem)] leading-loose text-royal">
          Thân mời quý khách và bạn bè
          <br />
          đến chung vui trong lễ cưới của chúng mình.
        </p>
      </Section>

      <Section className="mt-10">
        <img
          src={photoUrl(photos.invite)}
          alt={`${couple[0].shortName} và ${couple[1].shortName}`}
          loading="lazy"
          className="block aspect-[3/2] w-full object-cover"
          style={photos.invitePosition ? { objectPosition: photos.invitePosition } : undefined}
        />
      </Section>
    </div>
  );
}

/** Con dấu sáp: viền gợn sóng, mặt lõm, chữ tắt tên hai người (hoặc chữ 囍) nổi */
function WaxSeal({ className = "" }: { className?: string }) {
  const { couple, style } = useWedding();
  const hy = style.symbol === "double-happiness";
  const initial = (name: string) => name.trim().split(" ").pop()?.[0];
  // Viền gợn: 18 bướu quanh vòng tròn
  const bumps = 18;
  const outline = Array.from({ length: bumps * 2 }, (_, i) => {
    const angle = (i / (bumps * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? 48 : 44;
    return `${(50 + r * Math.cos(angle)).toFixed(2)},${(50 + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="seal-face" cx="40%" cy="35%" r="70%">
          <stop offset="0%" style={{ stopColor: "var(--seal-light)" }} />
          <stop offset="60%" style={{ stopColor: "var(--seal-mid)" }} />
          <stop offset="100%" style={{ stopColor: "var(--seal-dark)" }} />
        </radialGradient>
        <radialGradient id="seal-inner" cx="55%" cy="60%" r="65%">
          <stop offset="0%" style={{ stopColor: "var(--seal-inner-light)" }} />
          <stop offset="100%" style={{ stopColor: "var(--seal-inner-dark)" }} />
        </radialGradient>
      </defs>
      <polygon points={outline} fill="url(#seal-face)" strokeLinejoin="round" style={{ stroke: "var(--seal-dark)" }} strokeWidth="1" />
      <circle cx="50" cy="50" r="31" fill="url(#seal-inner)" stroke="rgb(0 0 0 / 0.25)" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="27" fill="none" style={{ stroke: "var(--seal-ring)" }} strokeWidth="0.8" />
      <text
        x="50"
        y={hy ? 60 : 58}
        textAnchor="middle"
        fontFamily={hy ? "'Songti SC', 'Noto Serif SC', 'Noto Serif CJK SC', serif" : "'Great Vibes', cursive"}
        fontWeight={hy ? 700 : undefined}
        fontSize={hy ? 28 : 24}
        style={{ fill: "var(--seal-text)", stroke: "var(--seal-text-stroke)" }}
        strokeWidth="0.4"
      >
        {hy ? "囍" : `${initial(couple[0].shortName)}&${initial(couple[1].shortName)}`}
      </text>
    </svg>
  );
}
