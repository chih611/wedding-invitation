import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { giftPayload, type GiftQr } from "../../utils/gift";
import { toTransferText } from "../../utils/vietqr";

interface Props {
  label: string;
  gift: GiftQr;
  /** Nội dung chuyển khoản tự điền (chỉ áp dụng cho mã VietQR) */
  message: string;
  /** Ẩn nút lưu ảnh (dùng khi xem trước trong trang admin) */
  compact?: boolean;
  /** light: chữ navy trên nền trắng. dark: chữ trắng trong khung viền trắng, dùng trên nền navy */
  tone?: "light" | "dark";
}

/** Một mã QR chuyển khoản kèm ngân hàng, số tài khoản, nút chép và lưu ảnh */
export default function GiftQrCard({ label, gift, message, compact = false, tone = "light" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const isBank = gift.kind === "bank";
  const transferText = isBank ? toTransferText(message) : "";
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

  function saveQr() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `qr-${toTransferText(label, 40).toLowerCase().replace(/ /g, "-")}.png`;
    a.click();
  }

  // Hai kiểu màu: chữ navy trên nền trắng (trang admin) / chữ trắng trên nền navy (thiệp)
  const c =
    tone === "dark"
      ? {
          box: "rounded-2xl border-2 border-white/90 px-5 py-6 text-white",
          qr: "rounded-lg bg-white p-2",
          muted: "text-white/70",
          soft: "text-white/85",
          copy: "border-white/50 hover:bg-white/10",
          save: "bg-white text-navy hover:bg-white/90",
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
          fgColor="#1d2c6b"
          // Vẽ 600px cho ảnh lưu về được nét, hiển thị thu nhỏ
          style={{ width: size, height: size, display: "block" }}
          title={`Mã QR chuyển khoản ${label}`}
        />
      </div>
      <p className={`mt-2 text-[11px] ${c.muted}`}>
        {isBank ? "Quét bằng app ngân hàng bất kỳ" : "Quét bằng app ngân hàng hoặc ví điện tử"}
      </p>

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
          {transferText && (
            <div className={`text-xs ${c.muted}`}>
              <dt className="inline">Nội dung: </dt>
              <dd className="inline">{transferText}</dd>
            </div>
          )}
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
          <p className={`mt-2 text-[11px] ${c.muted}`}>
            Đang xem trên điện thoại? Lưu ảnh rồi mở app ngân hàng, chọn quét QR từ ảnh.
          </p>
        </>
      )}
    </div>
  );
}
