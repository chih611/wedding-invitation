import Section from "../common/Section";
import { useWedding } from "../../config";
import { googleCalendarUrl, mapUrl } from "../../utils/links";

/** Bản đồ nhà hàng + nút chỉ đường / lưu vào lịch */
export default function VenueActions() {
  const { wedding, couple } = useWedding();
  const { reception } = wedding;
  const calendarUrl = googleCalendarUrl(
    `Tiệc cưới ${couple[0].shortName} & ${couple[1].shortName}`,
    reception,
    `${reception.venueType} ${reception.venueName} - ${reception.hall}, ${reception.address}`,
    "Hẹn gặp bạn tại tiệc cưới của chúng mình!",
  );
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(reception.mapQuery)}&z=16&output=embed`;

  const buttonClass =
    "inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-wider transition active:scale-95";

  return (
    <Section className="mx-auto w-full max-w-[460px]">
      <div className="overflow-hidden rounded-md border border-navy/15 bg-white shadow-[0_10px_30px_-12px_color-mix(in_srgb,var(--color-navy)_35%,transparent)]">
        <iframe
          title={`Bản đồ ${reception.venueName}`}
          src={embedUrl}
          className="block h-60 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="mt-4 flex gap-3">
        <a
          href={mapUrl(reception.mapQuery)}
          target="_blank"
          rel="noreferrer"
          className={`${buttonClass} bg-navy text-white hover:bg-navy-light`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
          </svg>
          Chỉ đường
        </a>
        <a
          href={calendarUrl}
          target="_blank"
          rel="noreferrer"
          className={`${buttonClass} border border-navy text-navy hover:bg-navy/5`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm-2 8h14v10H5V10Z" />
          </svg>
          Lưu vào lịch
        </a>
      </div>
    </Section>
  );
}
