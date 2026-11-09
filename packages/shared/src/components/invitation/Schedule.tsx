import { motion } from "framer-motion";
import Section from "../common/Section";
import Ornament from "../common/Ornament";
import { useWedding, type ScheduleIcon, type ScheduleItem } from "../../config";

/**
 * Lịch trình tiệc kiểu zig-zag: biểu tượng ở giữa, giờ + việc xen kẽ trái / phải,
 * phía đối diện là đường kẻ chạy ra tới mép thiệp.
 */
export default function Schedule() {
  const items = useWedding().wedding.schedule;
  if (items.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-[460px] text-center">
      <Section>
        <p className="font-script text-4xl text-royal">Lịch trình</p>
        <Ornament className="mt-2" />
      </Section>

      {/* -mx-5 để đường kẻ chạy sát mép cột thiệp (Block có đệm px-5) */}
      <ol className="-mx-5 mt-8 space-y-7">
        {items.map((item, i) => (
          <Row key={item.time + item.title} item={item} textLeft={i % 2 === 0} />
        ))}
      </ol>
    </div>
  );
}

function Row({ item, textLeft }: { item: ScheduleItem; textLeft: boolean }) {
  const text = (
    <motion.div
      className={`flex-1 px-3 ${textLeft ? "text-right" : "text-left"}`}
      initial={{ opacity: 0, x: textLeft ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
    >
      <p className="font-serif text-xl leading-tight tabular-nums text-royal">{item.time}</p>
      <p className="mt-0.5 text-[clamp(0.8rem,3.6vw,0.95rem)] uppercase leading-snug tracking-wide text-royal">
        {item.title}
      </p>
    </motion.div>
  );

  // Đường kẻ mọc ra từ phía biểu tượng
  const line = (
    <div className="flex flex-1 items-center">
      <motion.span
        className="block h-px w-full bg-royal/60"
        style={{ originX: textLeft ? 0 : 1 }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        aria-hidden="true"
      />
    </div>
  );

  return (
    <li className="flex items-center">
      {textLeft ? text : line}
      <motion.span
        className="flex h-16 w-16 shrink-0 items-center justify-center text-navy"
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: "backOut" }}
      >
        <EventIcon name={item.icon} />
      </motion.span>
      {textLeft ? line : text}
    </li>
  );
}

/** Biểu tượng nét mảnh cho từng mục trong lịch trình */
function EventIcon({ name }: { name: ScheduleIcon }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-14 w-14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

const ICONS: Record<ScheduleIcon, React.ReactNode> = {
  // Máy ảnh cổ
  camera: (
    <>
      <rect x="6" y="20" width="52" height="32" rx="4" />
      <path d="M22 20l3-6h14l3 6" />
      <rect x="10" y="15" width="8" height="5" rx="1" />
      <circle cx="32" cy="36" r="11" />
      <circle cx="32" cy="36" r="7" />
      <circle cx="32" cy="36" r="2.5" />
      <path d="M6 28h12M46 28h12" />
      <circle cx="51" cy="24" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  // Hộp nhẫn mở nắp, hai chiếc nhẫn
  rings: (
    <>
      <path d="M12 36l4-18c.5-2 2-3 4-3h24c2 0 3.5 1 4 3l4 18" />
      <path d="M17 20h30" />
      <rect x="9" y="36" width="46" height="18" rx="3" />
      <path d="M9 42h46" />
      <circle cx="27" cy="33" r="6" />
      <circle cx="37" cy="33" r="6" />
      <path d="M25 27l2-3 2 3M35 27l2-3 2 3" />
    </>
  ),
  // Hai ly rượu chạm nhau
  cheers: (
    <>
      <path d="M17 8h12l-1 14a5 5 0 0 1-10 0Z" transform="rotate(-10 23 15)" />
      <path d="M22 27v18M16 46h12" transform="rotate(-10 23 15)" />
      <path d="M35 8h12l-1 14a5 5 0 0 1-10 0Z" transform="rotate(10 41 15)" />
      <path d="M40 27v18M34 46h12" transform="rotate(10 41 15)" />
      <path d="M19 15h9" transform="rotate(-10 23 15)" opacity="0.6" />
      <path d="M37 15h9" transform="rotate(10 41 15)" opacity="0.6" />
      <path d="M32 4v-1M27 6l-1.5-1.5M37 6l1.5-1.5" />
    </>
  ),
  // Quả cầu disco lấp lánh
  party: (
    <>
      <path d="M32 6v8" />
      <circle cx="32" cy="34" r="18" />
      <path d="M14 34h36M17 25h30M17 43h30M22 18h20M22 50h20" />
      <path d="M32 16c-6 5-6 31 0 36M32 16c6 5 6 31 0 36M32 16v36" />
      <path d="M24 17c-5 7-5 27 0 34M40 17c5 7 5 27 0 34" />
      <path d="M8 10l1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" fill="currentColor" stroke="none" />
      <path d="M56 12l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" fill="currentColor" stroke="none" />
      <path d="M55 48l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" fill="currentColor" stroke="none" />
    </>
  ),
  // Bó hoa có nơ
  bouquet: (
    <>
      <circle cx="24" cy="18" r="7" />
      <path d="M24 13c-2 1-3 3-2 5s4 2 5 0-1-4-3-5" />
      <circle cx="40" cy="18" r="7" />
      <path d="M40 13c-2 1-3 3-2 5s4 2 5 0-1-4-3-5" />
      <circle cx="32" cy="12" r="6" />
      <circle cx="17" cy="29" r="5" />
      <circle cx="47" cy="29" r="5" />
      <circle cx="32" cy="26" r="6" />
      <path d="M10 22c-3-2-4-6-2-8 3 1 4 4 2 8ZM54 22c3-2 4-6 2-8-3 1-4 4-2 8Z" />
      <path d="M26 33l5 15M38 33l-5 15M32 32v16" />
      <path d="M27 46c-4 1-7 4-6 6 3 0 6-2 7-5M37 46c4 1 7 4 6 6-3 0-6-2-7-5" />
      <path d="M29 48h6" />
      <path d="M31 48l-2 11M33 48l2 11" />
    </>
  ),
};
