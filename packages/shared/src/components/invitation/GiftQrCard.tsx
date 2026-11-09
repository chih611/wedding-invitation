import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { createPortal } from "react-dom";
import { giftPayload, type GiftQr } from "../../utils/gift";
import { toTransferText } from "../../utils/vietqr";
import { useWedding } from "../../config";

interface Props {
  label: string;
  gift: GiftQr;
  /** Nội dung chuyển khoản tự điền (chỉ áp dụng cho mã VietQR) */
  message: string;
  /** Ẩn nút lưu ảnh (dùng khi xem trước trong trang admin) */
  compact?: boolean;
  /** light: không khung (trang admin). framed: khung viền navy bo góc, nền trắng (cửa sổ mã QR) */
  tone?: "light" | "framed";
}

/** Một mã QR chuyển khoản kèm ngân hàng, số tài khoản, nút chép và lưu ảnh */
export default function GiftQrCard({ label, gift, message, compact = false, tone = "light" }: Props) {
  const qrColor = useWedding().style.qrColor;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  /** Ảnh QR hiện to để khách nhấn giữ và lưu (khi trình duyệt không cho tải file) */
  const [preview, setPreview] = useState<string | null>(null);
  const isBank = gift.kind === "bank";
  const payload = giftPayload(gift, message);

  async function copyAccount() {
    if (!isBank) return;
    try {
      await navigator.clipboard.writeText(gift.accountNumber);
    } catch {
      window.prompt("Số tài khoản:", gift.accountNumber);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  /**
   * Lưu ảnh QR, thử lần lượt:
   * 1. Điện thoại có bảng chia sẻ file (Safari iOS, Chrome Android): mở bảng chia sẻ → "Lưu ảnh".
   * 2. Máy tính: tải file về.
   * 3. Còn lại (trình duyệt trong Zalo, Messenger... thường chặn tải file): hiện ảnh to để khách nhấn giữ → Lưu ảnh.
   */
  async function saveQr() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fileName = `qr-${toTransferText(label, 40).toLowerCase().replace(/ /g, "-") || "mung-cuoi"}.png`;
    const dataUrl = canvas.toDataURL("image/png");
    const touch = window.matchMedia("(pointer: coarse)").matches;

    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (blob && touch) {
        const file = new File([blob], fileName, { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file] });
          return;
        }
      }
    } catch (e) {
      // Khách bấm huỷ bảng chia sẻ thì thôi, lỗi khác thì thử cách tiếp theo
      if (e instanceof DOMException && e.name === "AbortError") return;
    }

    if (!touch) {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = fileName;
      // Firefox chỉ tải khi thẻ <a> nằm trong trang
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }

    setPreview(dataUrl);
  }

  // Hai kiểu: không khung (trang admin) / có khung viền navy bo góc, nền trắng (cửa sổ mã QR trên thiệp)
  const c =
    tone === "framed"
      ? {
          box: "rounded-2xl border-2 border-navy/70 bg-white px-5 py-6 text-navy",
          qr: "rounded-lg bg-white p-2",
          muted: "text-navy/60",
          soft: "text-navy/80",
          copy: "border-navy/30 hover:bg-navy/5",
          save: "bg-navy text-white hover:bg-navy-light",
        }
      : {
          box: "",
          qr: "rounded-md border border-navy/10 p-2",
          muted: "text-navy/60",
          soft: "text-navy/80",
          copy: "border-navy/30 hover:bg-navy/5",
          save: "bg-navy text-white hover:bg-navy-light",
        };
  const size = compact ? 160 : 200;

  return (
    <div className={c.box}>
      <div className={`mx-auto w-fit ${c.qr}`}>
        <QRCodeCanvas
          ref={canvasRef}
          value={payload}
          size={600}
          level="M"
          marginSize={2}
          fgColor={qrColor}
          // Vẽ 600px cho ảnh lưu về được nét, hiển thị thu nhỏ
          style={{ width: size, height: size, display: "block" }}
          title={`Mã QR chuyển khoản ${label}`}
        />
      </div>

      {isBank && (
        <dl className="mt-4 space-y-1.5 text-sm">
          {gift.accountName && (
            <div>
              <dt className="sr-only">Chủ tài khoản</dt>
              <dd className="text-xs font-semibold uppercase tracking-wide">{gift.accountName}</dd>
            </div>
          )}
          {gift.bank && (
            <div>
              <dt className="sr-only">Ngân hàng</dt>
              <dd className={`text-xs uppercase tracking-wide ${c.soft}`}>{gift.bank}</dd>
            </div>
          )}
          <div className="flex items-center justify-center gap-2">
            <dt className="sr-only">Số tài khoản</dt>
            <dd className="font-serif text-xl font-semibold tracking-wider">{gift.accountNumber}</dd>
            <button
              type="button"
              onClick={copyAccount}
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${c.copy}`}
            >
              {copied ? "Đã chép" : "Chép"}
            </button>
          </div>
        </dl>
      )}

      {!compact && (
        <>
          <button
            type="button"
            onClick={saveQr}
            className={`mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition active:scale-95 ${c.save}`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M11 3h2v9.17l3.59-3.58L18 10l-6 6-6-6 1.41-1.41L11 12.17V3ZM5 19h14v2H5v-2Z" />
            </svg>
            Lưu ảnh QR
          </button>
        </>
      )}

      {/* Gắn thẳng vào <body>, vì cửa sổ mã QR có hiệu ứng thu phóng làm lệch vị trí lớp phủ toàn màn hình */}
      {preview &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-black/85 p-6 text-center text-white"
            onClick={() => setPreview(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Lưu ảnh mã QR"
          >
            <p className="text-sm font-semibold">Nhấn giữ vào ảnh rồi chọn “Lưu ảnh”</p>
            <img
              src={preview}
              alt={`Mã QR chuyển khoản ${label}`}
              className="w-full max-w-[320px] rounded-lg bg-white"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              className="rounded-full border border-white/60 px-6 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-white/10"
            >
              Đóng
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
