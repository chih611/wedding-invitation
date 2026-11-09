import { useEffect, useState } from "react";
import Section from "../common/Section";
import Ornament from "../common/Ornament";

interface Props {
  target: string;
}

function getRemaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    done: diff === 0,
    units: [
      { label: "Ngày", value: Math.floor(diff / 86_400_000) },
      { label: "Giờ", value: Math.floor(diff / 3_600_000) % 24 },
      { label: "Phút", value: Math.floor(diff / 60_000) % 60 },
      { label: "Giây", value: Math.floor(diff / 1000) % 60 },
    ],
  };
}

/** Đếm ngược tới giờ tiệc */
export default function Countdown({ target }: Props) {
  const targetMs = new Date(target).getTime();
  const [remaining, setRemaining] = useState(() => getRemaining(targetMs));

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  return (
    <Section className="text-center">
      <p className="font-script text-4xl text-royal">Đếm ngược ngày vui</p>
      <Ornament className="mt-2" />

      {remaining.done ? (
        <p className="mt-3 text-sm uppercase tracking-wide">Cảm ơn bạn đã đến chung vui cùng chúng mình!</p>
      ) : (
        <div className="mt-4 flex justify-center gap-3">
          {remaining.units.map((u) => (
            <div
              key={u.label}
              className="w-[72px] rounded-md border border-navy/20 bg-white py-3 shadow-[0_8px_20px_-8px_color-mix(in_srgb,var(--color-navy)_40%,transparent)]"
            >
              <p className="font-serif text-2xl font-semibold tabular-nums">
                {String(u.value).padStart(2, "0")}
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-navy/70">{u.label}</p>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
