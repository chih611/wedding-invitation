import { motion } from "framer-motion";
import Section from "../common/Section";
import Ornament from "../common/Ornament";
import { wedding } from "../../data/wedding";

/** Lịch trình tiệc: đường dọc ở giữa, giờ một bên, việc một bên */
export default function Schedule() {
  const items = wedding.schedule;
  if (items.length === 0) return null;

  return (
    <Section className="mx-auto w-full max-w-[460px] text-center">
      <p className="font-script text-4xl text-royal">Lịch trình</p>
      <Ornament className="mt-2" />

      <ol className="relative mt-6">
        {/* đường dọc */}
        <span className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-royal/50" aria-hidden="true" />
        {items.map((item, i) => (
          <motion.li
            key={item.time + item.title}
            className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
          >
            <p className="text-right font-serif text-xl font-semibold tabular-nums">{item.time}</p>
            <span className="relative z-10 h-3 w-3 rounded-full border-2 border-royal bg-paper" aria-hidden="true" />
            <p className="text-left text-sm uppercase tracking-wide">{item.title}</p>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
