import { useId, useState } from "react";
import Section from "../common/Section";
import Ornament from "../common/Ornament";
import { wedding } from "../../data/wedding";

type Status = "idle" | "sending" | "sent" | "error";

/** Lấy đường dẫn nhận câu trả lời từ link Google Form (…/forms/d/e/<mã>/viewform) */
function formResponseUrl(formUrl: string) {
  const id = /\/forms\/d\/e\/([\w-]+)/.exec(formUrl)?.[1];
  return id ? `https://docs.google.com/forms/d/e/${id}/formResponse` : "";
}

/** Form xác nhận tham dự, câu trả lời được gửi thẳng vào Google Form của cô dâu chú rể */
export default function Rsvp({ guestName }: { guestName: string }) {
  const { rsvp } = wedding;
  const action = formResponseUrl(rsvp.formUrl);
  const [name, setName] = useState(guestName);
  const [message, setMessage] = useState("");
  const [attending, setAttending] = useState("");
  const [companion, setCompanion] = useState("");
  const [guestOf, setGuestOf] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  if (!action) return null;

  // Lựa chọn đầu tiên là "sẽ đến"; không đến thì không cần hỏi đi cùng ai
  const coming = attending !== "" && attending === rsvp.attendingOptions[0];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const body = new URLSearchParams();
    body.append(rsvp.fields.name, name.trim());
    body.append(rsvp.fields.message, message.trim());
    body.append(rsvp.fields.attending, attending);
    if (coming) body.append(rsvp.fields.companion, companion);
    body.append(rsvp.fields.guestOf, guestOf);

    try {
      // Google Form không cho đọc phản hồi từ trang khác (no-cors), nên chỉ biết được lỗi mạng
      await fetch(action, { method: "POST", mode: "no-cors", body });
      setStatus("sent");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section className="mx-auto w-full max-w-[460px] text-center">
      <p className="font-script text-4xl text-royal">Xác nhận tham dự</p>
      <Ornament className="mt-2" />
      <p className="mx-auto mt-4 max-w-[340px] text-balance text-xs uppercase leading-relaxed tracking-wide text-navy/80">
        Hãy xác nhận sự có mặt của bạn để chúng mình chuẩn bị đón tiếp một cách chu đáo nhất. Trân trọng!
      </p>

      {status === "sent" ? (
        <div className="mt-6 rounded-2xl border border-navy/30 bg-white px-5 py-8 text-navy">
          <p className="font-serif text-xl text-royal">Cảm ơn bạn!</p>
          <p className="mt-2 text-sm text-navy/80">
            {coming
              ? "Chúng mình đã nhận được xác nhận, hẹn gặp bạn trong ngày vui nhé."
              : "Chúng mình đã nhận được lời nhắn của bạn."}
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-5 text-xs font-semibold uppercase tracking-wider text-royal underline underline-offset-4"
          >
            Gửi thêm lời nhắn
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-3 text-left">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            placeholder="Tên của bạn"
            aria-label="Tên của bạn"
            className={`${FIELD} rounded-full`}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Gửi lời nhắn đến cô dâu chú rể"
            aria-label="Lời nhắn"
            className={`${FIELD} resize-none rounded-3xl`}
          />
          <Select label="Bạn sẽ đến chứ?" value={attending} onChange={setAttending} options={rsvp.attendingOptions} />
          {coming && (
            <Select
              label="Bạn tham dự cùng ai?"
              value={companion}
              onChange={setCompanion}
              options={rsvp.companionOptions}
            />
          )}
          <Select label="Bạn là khách mời của ai?" value={guestOf} onChange={setGuestOf} options={rsvp.guestOfOptions} />

          {status === "error" && (
            <p className="text-center text-sm text-red-600" role="alert">
              Chưa gửi được, bạn kiểm tra kết nối mạng rồi thử lại nhé.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-navy py-3 font-serif text-base uppercase tracking-wider text-white transition hover:bg-navy-light active:scale-[0.98] disabled:opacity-60"
          >
            {status === "sending" ? "Đang gửi..." : "Gửi lời nhắn"}
          </button>
        </form>
      )}
    </Section>
  );
}

const FIELD =
  "block w-full border border-navy/40 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-navy/50 outline-none transition focus:border-royal focus:ring-2 focus:ring-royal/20";

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  const id = useId();
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${FIELD} appearance-none rounded-full pr-10 ${value ? "" : "text-navy/50"}`}
      >
        <option value="" disabled>
          {label}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="text-navy">
            {o}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-navy/60"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M4 6h12l-6 8Z" />
      </svg>
    </div>
  );
}
