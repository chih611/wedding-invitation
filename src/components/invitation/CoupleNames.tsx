import { motion } from "framer-motion";
import Section from "../common/Section";
import AnimatedText from "../common/AnimatedText";
import Heart from "../common/Heart";
import { wedding } from "../../data/wedding";

const nameClass =
  "font-script text-royal leading-none text-[clamp(1.9rem,8.2vw,2.75rem)]";

export default function CoupleNames() {
  const { bride, groom, ceremony } = wedding;

  return (
    <div>
      <Section>
        <p className="text-balance text-xs uppercase tracking-wide sm:text-sm">
          Trân trọng báo tin <span className="font-bold">{ceremony.title}</span> của con chúng tôi
        </p>
      </Section>

      <h2 className="mt-6">
        <AnimatedText className={nameClass} delay={0.2}>
          {bride.fullName}
        </AnimatedText>
      </h2>

      <Section delay={0.6} className="my-3 flex items-center justify-center gap-5 text-xs sm:text-sm">
        <span className="w-20 text-right">{bride.order}</span>
        <motion.span
          className="text-navy"
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="h-7 w-7" />
        </motion.span>
        <span className="w-20 text-left">{groom.order}</span>
      </Section>

      <h2>
        <AnimatedText className={nameClass} delay={1}>
          {groom.fullName}
        </AnimatedText>
      </h2>
    </div>
  );
}
