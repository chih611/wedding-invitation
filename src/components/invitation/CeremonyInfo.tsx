import Section from "../common/Section";
import { wedding } from "../../data/wedding";
import { toVietnamDateParts } from "../../utils/date";

export default function CeremonyInfo() {
  const { ceremony } = wedding;
  const [dd, mm, yyyy] = toVietnamDateParts(ceremony.start);

  return (
    <Section className="space-y-2">
      <p className="text-balance text-xs uppercase tracking-wide sm:text-sm">
        Hôn lễ được cử hành tại <span className="font-bold">{ceremony.venue}</span>
      </p>
      <p className="text-sm uppercase tracking-wide sm:text-base">
        Vào lúc: <span className="ml-2 font-semibold">{ceremony.timeLabel}</span>
      </p>
      <p
        className="font-serif text-4xl font-medium tracking-wider sm:text-5xl"
        aria-label={`Ngày ${dd} tháng ${mm} năm ${yyyy}`}
      >
        {dd}
        <span className="mx-2 font-light text-navy/60">|</span>
        {mm}
        <span className="mx-2 font-light text-navy/60">|</span>
        {yyyy}
      </p>
      <p className="text-xs italic text-navy/80 sm:text-sm">({ceremony.lunarDate})</p>
    </Section>
  );
}
