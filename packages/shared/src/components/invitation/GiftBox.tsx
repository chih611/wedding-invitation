import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GiftQrCard from "./GiftQrCard";
import { useWedding } from "../../config";
import { photoUrl } from "../../utils/photos";
import { useGift } from "../../hooks/useGift";
import type { GiftQr } from "../../utils/gift";

/**
 * Hộp mừng cưới: băng rôn (ảnh bên trái, chữ bên phải), bấm vào thì mở cửa sổ mã QR.
 * Mã QR upload ở trang /admin và lưu trên máy chủ. Chưa có mã thì phần này ẩn hẳn.
 */
export default function GiftBox() {
  const gift = useGift();
  const [open, setOpen] = useState(false);
  const { wedding, photos } = useWedding();

  if (!gift) return null;

  const message = wedding.giftMessage;

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="group grid w-full grid-cols-2 text-left"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        aria-haspopup="dialog"
      >
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={photoUrl(photos.gift)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center bg-navy px-6 text-white">
          <GiftHeartIcon className="h-14 w-14 text-white/90 transition group-hover:scale-110" />
          <span className="my-5 block h-px w-24 bg-white/80" aria-hidden="true" />
          <span className="font-serif text-[clamp(0.95rem,4vw,1.15rem)] uppercase leading-snug tracking-wide">
            Quà tặng
            <br />
            cô dâu, chú rể
          </span>
          <span className="mt-4 text-[11px] uppercase tracking-[0.2em] text-white/70 group-hover:text-white">
            Bấm để xem ›
          </span>
        </div>
      </motion.button>

      <AnimatePresence>
        {open && <GiftDialog gift={gift} message={message} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

interface DialogProps {
  gift: GiftQr;
  message: string;
  onClose: () => void;
}

/** Cửa sổ mã QR: ảnh ở trên, mã QR trong khung viền navy trên nền xanh nhạt như thiệp */
function GiftDialog({ gift, message, onClose }: DialogProps) {
  const { photos } = useWedding();
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Quà tặng cô dâu, chú rể"
        className="relative max-h-full w-full max-w-[420px] overflow-y-auto bg-tint text-center shadow-2xl"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photoUrl(photos.giftModal)}
          alt=""
          className="block aspect-[3/2] w-full object-cover"
          style={photos.giftModalPosition ? { objectPosition: photos.giftModalPosition } : undefined}
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full text-white drop-shadow hover:bg-black/20"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
          </svg>
        </button>

        <div className="px-5 py-6">
          <GiftQrCard label="Mừng cưới" gift={gift} message={message} tone="framed" />
          <p className="mt-5 text-balance text-xs leading-relaxed text-navy/70">
            Cảm ơn tình cảm và lời chúc phúc bạn dành cho chúng mình
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Hộp quà hình trái tim, nét mảnh */
function GiftHeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* thân hộp hình tim */}
      <path d="M32 56C22 49 8 40 8 27c0-7 5-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 7 0 12 5 12 12 0 13-14 22-24 29Z" />
      {/* viền nắp */}
      <path d="M11 33c7 4 35 4 42 0" />
      {/* dải ruy băng dọc */}
      <path d="M32 22v34" />
      {/* nơ */}
      <path d="M32 22c-6-1-10-6-8-9s8 2 8 9Z" />
      <path d="M32 22c6-1 10-6 8-9s-8 2-8 9Z" />
    </svg>
  );
}
