import type { WeddingEvent } from "../config";

/** Link Google Maps tìm theo chữ (ví dụ tên + địa chỉ nhà hàng) */
export function mapUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Tạo link Google Calendar cho một sự kiện */
export function googleCalendarUrl(
  title: string,
  event: Pick<WeddingEvent, "start" | "durationHours">,
  location: string,
  details = "",
) {
  const start = new Date(event.start);
  const end = new Date(start.getTime() + event.durationHours * 3600_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    location,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
