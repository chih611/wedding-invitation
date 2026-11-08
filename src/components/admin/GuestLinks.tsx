import { useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { invitationUrl, parseGuestNames } from "../../utils/guests";
import { downloadTemplate, downloadXlsx, importGuestFile } from "../../utils/excel";

const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

const btn =
  "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition active:scale-95 disabled:opacity-40";
const btnPrimary = `${btn} bg-navy text-white hover:bg-navy-light`;
const btnOutline = `${btn} border border-navy text-navy hover:bg-navy/5`;

interface Props {
  /** Tham số mã QR mừng cưới gắn thêm vào mọi link, ví dụ "qr=..." */
  giftQuery: string;
}

/**
 * Tạo link mời có tên từng khách và gửi nhanh.
 * Danh sách khách và trạng thái "đã gửi" được lưu trong trình duyệt.
 */
export default function GuestLinks({ giftQuery }: Props) {
  const [rawNames, setRawNames] = useLocalStorage("guests.raw", "");
  const [sent, setSent] = useLocalStorage<string[]>("guests.sent", []);
  const [hideSent, setHideSent] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const origin = window.location.origin;
  const generalUrl = invitationUrl(origin, "", giftQuery);
  const sentSet = new Set(sent);

  const guests = parseGuestNames(rawNames).map((name) => {
    const url = invitationUrl(origin, name, giftQuery);
    return { name, url, sent: sentSet.has(name) };
  });
  const visible = hideSent ? guests.filter((g) => !g.sent) : guests;
  const sentCount = guests.filter((g) => g.sent).length;

  function showFlash(key: string) {
    setFlash(key);
    setTimeout(() => setFlash((f) => (f === key ? null : f)), 1500);
  }

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt("Sao chép nội dung:", text);
    }
    showFlash(key);
  }

  function setGuestSent(name: string, value: boolean) {
    setSent((prev) => (value ? [...new Set([...prev, name])] : prev.filter((n) => n !== name)));
  }

  /** Mở bảng chia sẻ của điện thoại → chọn Zalo / Messenger → chọn người nhận */
  async function share(guest: (typeof guests)[number]) {
    try {
      await navigator.share({ url: guest.url });
      setGuestSent(guest.name, true);
    } catch {
      // Người dùng bấm huỷ: không đánh dấu đã gửi
    }
  }

  async function copyLink(guest: (typeof guests)[number]) {
    await copy(guest.url, guest.name);
    setGuestSent(guest.name, true);
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      setImportMsg({ ok: false, text: "Chỉ nhận file Excel (.xlsx, .xls) hoặc .csv." });
      return;
    }

    setImporting(true);
    setImportMsg(null);
    try {
      const result = await importGuestFile(file);
      if (result.names.length === 0) {
        setImportMsg({ ok: false, text: `Không tìm thấy tên khách nào trong file "${file.name}".` });
        return;
      }

      // Thêm vào cuối danh sách hiện có, tên trùng tự bỏ qua
      const existing = new Set(guests.map((g) => g.name.toLocaleLowerCase("vi")));
      const added = result.names.filter((n) => !existing.has(n.toLocaleLowerCase("vi")));
      if (added.length > 0) {
        setRawNames((prev) => [prev.trimEnd(), ...added].filter(Boolean).join("\n"));
      }

      const skipped = result.names.length - added.length;
      setImportMsg({
        ok: true,
        text:
          added.length === 0
            ? `Cả ${skipped} tên trong file đều đã có trong danh sách.`
            : `Đã thêm ${added.length} khách từ "${result.column}" (sheet ${result.sheet})` +
              (skipped > 0 ? `, bỏ qua ${skipped} tên đã có.` : "."),
      });
    } catch {
      setImportMsg({ ok: false, text: `Không đọc được file "${file.name}". File có thể bị hỏng hoặc đang đặt mật khẩu.` });
    } finally {
      setImporting(false);
    }
  }

  function exportXlsx() {
    return downloadXlsx(
      "danh-sach-thiep-moi.xlsx",
      "Thiệp mời",
      [
        ["STT", "Tên khách", "Link thiệp"],
        ...guests.map((g, i) => [String(i + 1), g.name, g.url]),
      ],
      [6, 32, 60],
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-lg font-semibold">Gửi thiệp mời</h2>
        <p className="mt-1 text-sm text-navy/70">
          Danh sách và trạng thái đã gửi được lưu trên trình duyệt này, tắt trang mở lại vẫn còn.
        </p>
      </header>

      {/* Link chung */}
      <section className="rounded-md border border-navy/15 bg-white p-4">
        <h3 className="font-semibold">Link chung (không ghi tên)</h3>
        <p className="mt-1 text-xs text-navy/70">Dùng để gửi vào nhóm chat hoặc đăng Facebook.</p>
        <div className="mt-3 flex items-center gap-3">
          <code className="min-w-0 flex-1 truncate rounded bg-paper px-3 py-2 text-xs">{generalUrl}</code>
          <button type="button" className={btnPrimary} onClick={() => copy(generalUrl, "general")}>
            {flash === "general" ? "Đã chép" : "Sao chép"}
          </button>
        </div>
      </section>

      {/* Danh sách khách */}
      <section>
        <h3 className="font-semibold">1. Danh sách khách mời</h3>

        {/* Nhập từ file Excel */}
        <label
          className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed px-4 py-6 text-center transition ${
            dragging ? "border-navy bg-navy/5" : "border-navy/30 bg-white hover:border-navy/60"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files[0]);
          }}
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-navy/70" fill="currentColor" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm-1 7V3.5L18.5 9H13Zm-4.6 3h2l1.1 2 1.1-2h2l-2.1 3.5L14.6 19h-2l-1.1-2-1.1 2h-2l2.1-3.5L8.4 12Z" />
          </svg>
          <span className="text-sm font-semibold">
            {importing ? "Đang đọc file..." : "Chọn file Excel danh sách khách"}
          </span>
          <span className="text-xs text-navy/70">hoặc kéo thả file vào đây (.xlsx, .xls, .csv)</span>
          <input
            type="file"
            className="sr-only"
            accept=".xlsx,.xls,.csv"
            disabled={importing}
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = ""; // cho phép chọn lại cùng file
            }}
          />
        </label>

        {importMsg && (
          <p className={`mt-2 text-xs ${importMsg.ok ? "text-green-700" : "text-red-600"}`} role="status">
            {importMsg.text}
          </p>
        )}

        <p className="mt-2 text-xs text-navy/70">
          File cần có cột tiêu đề "Họ và tên" (hoặc "Tên", "Khách mời"). Có cột "Xưng hô" thì sẽ ghép vào trước
          tên.{" "}
          <button type="button" className="font-semibold underline" onClick={downloadTemplate}>
            Tải file mẫu
          </button>
        </p>

        <div className="mt-5 flex items-end justify-between gap-3">
          <p className="text-xs text-navy/70">
            Hoặc nhập / dán trực tiếp, mỗi dòng một người
            {guests.length > 0 && <span className="font-semibold text-navy"> · {guests.length} khách</span>}
          </p>
          {rawNames && (
            <button
              type="button"
              className="shrink-0 whitespace-nowrap text-xs underline"
              onClick={() => window.confirm("Xoá toàn bộ danh sách khách?") && setRawNames("")}
            >
              Xoá danh sách
            </button>
          )}
        </div>
        <textarea
          className="mt-2 h-44 w-full rounded-md border border-navy/30 bg-white p-3 text-sm outline-none focus:border-navy"
          value={rawNames}
          onChange={(e) => setRawNames(e.target.value)}
        />
      </section>

      {/* Danh sách link */}
      {guests.length > 0 && (
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold">
              2. Gửi thiệp · đã gửi {sentCount}/{guests.length}
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={btnOutline}
                onClick={() => copy(guests.map((g) => `${g.name}: ${g.url}`).join("\n"), "all")}
              >
                {flash === "all" ? "Đã chép!" : "Chép tất cả link"}
              </button>
              <button type="button" className={btnOutline} onClick={exportXlsx}>
                Tải file Excel
              </button>
            </div>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy/10">
            <div
              className="h-full bg-navy transition-all"
              style={{ width: `${(sentCount / guests.length) * 100}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={hideSent} onChange={(e) => setHideSent(e.target.checked)} />
              Ẩn khách đã gửi
            </label>
            {sentCount > 0 && (
              <button
                type="button"
                className="underline"
                onClick={() => window.confirm("Bỏ đánh dấu đã gửi cho tất cả khách?") && setSent([])}
              >
                Bỏ đánh dấu tất cả
              </button>
            )}
          </div>

          <ul className="mt-3 divide-y divide-navy/10 rounded-md border border-navy/15 bg-white">
            {visible.map((g) => (
              <li
                key={g.name}
                className={`flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:gap-3 ${g.sent ? "bg-paper/70" : ""}`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 shrink-0 accent-navy"
                    checked={g.sent}
                    onChange={(e) => setGuestSent(g.name, e.target.checked)}
                    aria-label={`Đã gửi cho ${g.name}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold ${g.sent ? "text-navy/50 line-through" : ""}`}>{g.name}</p>
                    <a
                      href={g.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate text-xs text-royal underline"
                    >
                      {g.url}
                    </a>
                  </div>
                </div>
                <div className="flex gap-2 pl-7 sm:pl-0">
                  <button type="button" className={canShare ? btnOutline : btnPrimary} onClick={() => copyLink(g)}>
                    {flash === g.name ? "Đã chép" : "Chép link"}
                  </button>
                  {canShare && (
                    <button type="button" className={btnPrimary} onClick={() => share(g)}>
                      Gửi
                    </button>
                  )}
                </div>
              </li>
            ))}
            {visible.length === 0 && (
              <li className="p-4 text-center text-sm text-navy/70">Đã gửi hết cho tất cả khách 🎉</li>
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
