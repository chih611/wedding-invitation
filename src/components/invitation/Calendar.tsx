import { motion } from "framer-motion";
import Heart from "../common/Heart";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

interface Props {
  year: number;
  /** 1 - 12 */
  month: number;
  highlightDay: number;
}

/** Lịch tháng, tuần bắt đầu từ thứ Hai, ngày cưới có trái tim */
export default function Calendar({ year, month, highlightDay }: Props) {
  const daysInMonth = new Date(year, month, 0).getDate();
  // getDay(): 0 = Chủ nhật. Đổi sang 0 = thứ Hai.
  const leadingBlanks = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const cells: (number | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="relative mx-auto mt-6 max-w-[360px] border border-navy/70 px-2 pb-3 pt-5">
      <p className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 text-sm font-medium tracking-wide sm:text-base">
        {MONTHS[month - 1]} - {year}
      </p>

      <div className="grid grid-cols-7 gap-y-1.5 text-xs sm:text-sm">
        {WEEKDAYS.map((d) => (
          <span key={d} className="pb-1 text-[10px] font-medium sm:text-xs">
            {d}
          </span>
        ))}

        {cells.map((day, i) =>
          day === highlightDay ? (
            <span key={i} className="relative flex items-center justify-center">
              <motion.span
                className="absolute text-navy"
                initial={{ scale: 0 }}
                whileInView={{ scale: [0, 1.3, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Heart className="h-8 w-8" />
              </motion.span>
              <span className="relative text-[11px] font-semibold text-white sm:text-xs">{day}</span>
            </span>
          ) : (
            <span key={i} className="leading-7">
              {day ?? ""}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
