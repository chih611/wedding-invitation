import Section from "../common/Section";
import Ornament from "../common/Ornament";
import { wedding } from "../../data/wedding";

/** Gợi ý màu trang phục cho khách */
export default function DressCode() {
  const { note, colors } = wedding.dressCode;
  if (colors.length === 0) return null;

  return (
    <Section className="mx-auto w-full max-w-[460px] text-center">
      <p className="font-script text-4xl text-royal">Dress code</p>
      <Ornament className="mt-2" />
      <p className="mx-auto mt-4 max-w-[340px] text-balance text-xs uppercase leading-relaxed tracking-wide text-navy/80">
        {note}
      </p>

      <ul className="mt-6 flex flex-wrap justify-center gap-5">
        {colors.map((c) => (
          <li key={c.hex} className="flex w-16 flex-col items-center gap-2">
            <span
              className="h-14 w-14 rounded-full border border-navy/15 shadow-[inset_0_-6px_12px_rgb(0_0_0/0.08)]"
              style={{ backgroundColor: c.hex }}
              aria-hidden="true"
            />
            <span className="text-[11px] uppercase tracking-wide text-navy/80">{c.name}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
