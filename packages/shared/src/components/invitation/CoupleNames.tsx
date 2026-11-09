import { motion } from "framer-motion";
import Section from "../common/Section";
import AnimatedText from "../common/AnimatedText";
import Heart from "../common/Heart";
import DoubleHappiness from "../common/DoubleHappiness";
import { useWedding } from "../../config";

const nameClass =
  "font-script text-royal leading-none text-[clamp(1.9rem,8.2vw,2.75rem)]";

/** Tên hai người, người nhà tổ chức thiệp đứng trước. Giữa là trái tim hoặc chữ 囍 (style.symbol) */
export default function CoupleNames() {
  const { wedding, couple, style } = useWedding();
  const { ceremony } = wedding;
  const [first, second] = couple;
  // Tailwind cần thấy nguyên tên class trong code nên ghi đủ cả hai
  const labelWidth = style.wideOrderLabels ? "w-28" : "w-20";

  return (
    <div>
      <Section>
        <p className="text-balance text-xs uppercase tracking-wide sm:text-sm">
          Trân trọng báo tin <span className="font-bold">{ceremony.title}</span> của con chúng tôi
        </p>
      </Section>

      <h2 className="mt-6">
        <AnimatedText className={nameClass} delay={0.2}>
          {first.fullName}
        </AnimatedText>
      </h2>

      <Section delay={0.6} className="my-3 flex items-center justify-center gap-5 text-xs sm:text-sm">
        <span className={`${labelWidth} text-right`}>{first.order}</span>
        <motion.span
          className="text-navy"
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {style.symbol === "double-happiness" ? <DoubleHappiness className="text-3xl" /> : <Heart className="h-7 w-7" />}
        </motion.span>
        <span className={`${labelWidth} text-left`}>{second.order}</span>
      </Section>

      <h2>
        <AnimatedText className={nameClass} delay={1}>
          {second.fullName}
        </AnimatedText>
      </h2>
    </div>
  );
}
