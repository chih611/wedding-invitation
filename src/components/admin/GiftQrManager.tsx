import { useState } from "react";
import GiftQrCard from "../invitation/GiftQrCard";
import { decodeGift, encodeGift, giftFromPayload, normalizeAccountName, readQrFromImage } from "../../utils/gift";
import { wedding } from "../../data/wedding";

export type SaveState =
  | { kind: "loading" }
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved"; text: string }
  | { kind: "error"; text: string };

interface Props {
  /** Mã QR đang lưu trên máy chủ (đã mã hoá), "" nếu chưa có */
  value: string;
  /** Lưu mã mới lên máy chủ ("" để xoá) */
  onChange: (value: string) => void;
  state: SaveState;
}

/** Upload ảnh mã QR mừng cưới. Không có mã thì thiệp không hiện hộp mừng cưới. */
export default function GiftQrManager({ value, onChange, state }: Props) {
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const gift = decodeGift(value);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMsg({ ok: false, text: "Chỉ nhận file ảnh (.png, .jpg...)." });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const text = await readQrFromImage(file);
      if (!text) {
        setMsg({ ok: false, text: "Không tìm thấy mã QR trong ảnh. Thử ảnh rõ hơn hoặc cắt sát mã QR." });
        return;
      }
      const next = giftFromPayload(text);
      const encoded = encodeGift(next);
      if (!decodeGift(encoded)) {
        setMsg({ ok: false, text: "Mã QR này quá dài để gắn vào link. Hãy dùng mã QR nhận tiền của ngân hàng." });
        return;
      }
      onChange(encoded);
      setMsg(
        next.kind === "bank"
          ? { ok: true, text: "Đã đọc mã VietQR." }
          : { ok: true, text: "Mã này không phải VietQR ngân hàng, thiệp sẽ hiện nguyên mã để khách tự quét." },
      );
    } catch {
      setMsg({ ok: false, text: "Không mở được ảnh này." });
    } finally {
      setBusy(false);
    }
  }

  function setAccountName(name: string) {
    if (gift?.kind !== "bank" || name === gift.accountName) return;
    onChange(encodeGift({ ...gift, accountName: name }));
  }

  // Đang đọc ảnh, đang tải hoặc đang lưu thì khoá nút chọn ảnh
  const locked = busy || state.kind === "loading" || state.kind === "saving";

  const picker = (text: string, big: boolean) => (
    <label
      className={
        big
          ? `flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed px-4 py-8 text-center transition ${
              dragging ? "border-navy bg-navy/5" : "border-navy/30 hover:border-navy/60"
            }`
          : "cursor-pointer text-xs font-semibold underline"
      }
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
      {big && (
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-navy/70" fill="currentColor" aria-hidden="true">
          <path d="M3 3h8v8H3V3Zm2 2v4h4V5H5Zm8-2h8v8h-8V3Zm2 2v4h4V5h-4ZM3 13h8v8H3v-8Zm2 2v4h4v-4H5Zm13-2h3v2h-3v-2Zm-5 0h3v3h-3v-3Zm3 3h2v2h-2v-2Zm2 2h3v3h-3v-3Zm-5 1h3v2h-3v-2Z" />
        </svg>
      )}
      <span className={big ? "text-sm font-semibold" : ""}>
        {busy ? "Đang đọc ảnh..." : state.kind === "saving" ? "Đang lưu..." : text}
      </span>
      {big && <span className="text-xs text-navy/70">hoặc kéo thả ảnh vào đây</span>}
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={locked}
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </label>
  );

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold">Mã QR mừng cưới</h2>
        <p className="mt-1 text-sm text-navy/70">
          Tải lên ảnh mã QR nhận tiền (chụp màn hình từ app ngân hàng cũng được). Mã được lưu lên máy chủ và hiện ngay
          trên mọi link thiệp, kể cả link gốc và các link đã gửi (chậm nhất khoảng 30 giây). Không có mã thì thiệp
          không hiện hộp mừng cưới.
        </p>
      </header>

      <div className="mx-auto max-w-sm rounded-md border border-navy/15 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="font-semibold">{gift ? "Mã QR đang dùng" : "Chưa có mã QR"}</h3>
          {gift && (
            <div className="flex items-center gap-3">
              {picker("Đổi ảnh", false)}
              <button
                type="button"
                className="text-xs font-semibold text-red-600 underline"
                disabled={locked}
                onClick={() => {
                  if (!window.confirm("Xoá mã QR? Thiệp sẽ không còn hiện hộp mừng cưới.")) return;
                  onChange("");
                  setMsg(null);
                }}
              >
                Xoá
              </button>
            </div>
          )}
        </div>

        {gift ? (
          <div className="space-y-3 text-center">
            <GiftQrCard
              label="Mừng cưới"
              gift={gift}
              message={wedding.giftMessage}
              compact
            />
            <p className="rounded-md bg-amber-50 px-3 py-2 text-left text-xs text-amber-900">
              <b>Kiểm tra trước khi gửi link:</b> mở app ngân hàng, quét mã QR ở trên (không cần chuyển tiền) và xem
              tên người nhận, số tài khoản có đúng không.
            </p>
            {gift.kind === "bank" && (
              <label className="block text-left text-xs">
                <span className="font-semibold">Tên chủ tài khoản (hiện dưới mã QR)</span>
                <input
                  className="mt-1 w-full rounded-md border border-navy/30 px-3 py-2 text-sm uppercase outline-none focus:border-navy"
                  placeholder="VD: BUI THI THU HUONG"
                  key={`${gift.bin}.${gift.accountNumber}`}
                  defaultValue={gift.accountName}
                  onBlur={(e) => {
                    const name = normalizeAccountName(e.target.value);
                    e.target.value = name;
                    setAccountName(name);
                  }}
                />
              </label>
            )}
          </div>
        ) : state.kind === "loading" ? (
          <p className="py-8 text-center text-sm text-navy/70">Đang tải mã QR đã lưu...</p>
        ) : (
          picker("Chọn ảnh mã QR", true)
        )}

        {msg && (
          <p className={`mt-2 text-xs ${msg.ok ? "text-green-700" : "text-red-600"}`} role="status">
            {msg.text}
          </p>
        )}
        {(state.kind === "saved" || state.kind === "error" || state.kind === "saving") && (
          <p
            className={`mt-2 rounded-md px-3 py-2 text-xs ${
              state.kind === "error"
                ? "bg-red-50 text-red-700"
                : state.kind === "saved"
                  ? "bg-green-50 text-green-800"
                  : "bg-paper text-navy/70"
            }`}
            role="status"
          >
            {state.kind === "saving" ? "Đang lưu lên máy chủ..." : state.text}
          </p>
        )}
      </div>
    </section>
  );
}

