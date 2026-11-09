import Section from "../common/Section";
import AnimatedText from "../common/AnimatedText";
import Calendar from "./Calendar";
import { useWedding } from "../../config";
import { toVietnamDateParts } from "../../utils/date";

interface Props {
  guestName: string;
}

export default function ReceptionInfo({ guestName }: Props) {
  const { reception } = useWedding().wedding;
  const [dd, mm, yyyy] = toVietnamDateParts(reception.start);

  return (
    <div>
      <Section>
        <p className="text-sm uppercase tracking-[0.15em] sm:text-base">Trân trọng kính mời</p>

        {/* Tên khách lấy từ link (?to=...). Không có tên thì để dòng chấm như thiệp giấy. */}
        <div className="mx-auto mt-3 flex min-h-14 max-w-[340px] items-end justify-center border-b-2 border-dotted border-navy/50 pb-1">
          {guestName && (
            <AnimatedText className="font-script text-[clamp(2rem,9vw,2.6rem)] leading-none text-royal" duration={1.5}>
              {guestName}
            </AnimatedText>
          )}
        </div>

        <p className="mt-4 text-balance text-xs uppercase leading-relaxed tracking-wide sm:text-sm">
          Đến dự buổi tiệc chung vui cùng gia đình chúng tôi tại
        </p>
      </Section>

      <Section className="mt-5">
        <p className="text-sm font-bold uppercase tracking-[0.15em]">{reception.venueType}</p>
        <h2 className="font-script text-[clamp(2.6rem,12vw,3.6rem)] leading-tight text-navy">
          {reception.venueName}
        </h2>
        <p className="text-sm uppercase tracking-wide">- {reception.hall} -</p>
        <p className="mt-1 text-balance text-xs uppercase tracking-wide sm:text-sm">{reception.address}</p>
      </Section>

      <Section>
        <Calendar year={Number(yyyy)} month={Number(mm)} highlightDay={Number(dd)} />
      </Section>

      <Section className="mx-auto mt-6 flex max-w-[360px] items-center justify-center gap-4">
        <div className="font-serif text-4xl font-semibold leading-none sm:text-5xl">
          <p>{dd}</p>
          <div className="my-1 h-0.5 bg-navy" />
          <p>{mm}</p>
        </div>
        <div className="w-px self-stretch bg-navy" />
        <div className="space-y-1 text-left">
          <p className="text-sm uppercase sm:text-base">Vào lúc: {reception.timeLabel}</p>
          <p className="text-sm font-bold uppercase sm:text-base">
            Ngày {Number(dd)} tháng {Number(mm)} năm {yyyy}
          </p>
          <p className="text-[11px] italic text-navy/80 sm:text-xs">({reception.lunarDate})</p>
        </div>
      </Section>

      <Section className="mt-6">
        <p className="text-xs uppercase leading-relaxed tracking-wide sm:text-sm">
          Sự hiện diện của quý khách
          <br />
          là niềm vinh hạnh cho gia đình chúng tôi.
        </p>
      </Section>
    </div>
  );
}
