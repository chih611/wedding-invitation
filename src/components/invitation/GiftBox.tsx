import { useState } from "react";
import { motion } from "framer-motion";
import Section from "../common/Section";
import GiftQrCard from "./GiftQrCard";
import { wedding } from "../../data/wedding";
import { useGift } from "../../hooks/useGift";

interface Props {
  guestName: string;
}

/**
 * Hộp mừng cưới: mã QR chuyển khoản.
 * Mã QR upload ở trang /admin và được gắn vào link thiệp. Link không có mã thì hộp này ẩn hẳn.
 */
export default function GiftBox({ guestName }: Props) {
  const gift = useGift();
  const [open, setOpen] = useState(false);

  if (!gift) return null;

  const message = guestName
    ? `Mung cuoi ${guestName}`
    : `Mung cuoi ${wedding.bride.shortName} ${wedding.groom.shortName}`;

  return (
    <Section className="mx-auto w-full max-w-[460px] text-center">
      <p className="font-script text-4xl text-royal">Hộp mừng cưới</p>
      <p className="mt-2 text-xs uppercase tracking-wide text-navy/70">
        Cảm ơn tình cảm bạn dành cho chúng mình
      </p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-navy px-6 py-3 text-xs font-semibold uppercase tracking-wider text-navy transition hover:bg-navy/5 active:scale-95"
        >
          <GiftIcon />
          Gửi quà mừng
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-5 rounded-md border border-navy/15 bg-white p-5 shadow-sm"
        >
          <GiftQrCard label="Mừng cưới" gift={gift} message={message} />
        </motion.div>
      )}
    </Section>
  );
}

function GiftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M20 7h-2.18A3 3 0 0 0 12 3.76 3 3 0 0 0 6.18 7H4a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h1v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8h1a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2Zm-5-2a1 1 0 1 1 0 2h-2V6a1 1 0 0 1 2-1ZM9 5a1 1 0 0 1 1 1v1H8a1 1 0 1 1 1-2Zm2 15H6v-8h5v8Zm0-10H4V9h7v1Zm7 10h-5v-8h5v8Zm2-10h-7V9h7v1Z" />
    </svg>
  );
}
