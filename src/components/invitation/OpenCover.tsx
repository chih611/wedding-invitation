import { motion } from "framer-motion";
import Heart from "../common/Heart";
import { wedding } from "../../data/wedding";
import { toVietnamDateParts } from "../../utils/date";
import logoHQ from "../../assets/monogram.png";

interface Props {
  guestName: string;
  onOpen: () => void;
}

/** Màn hình bìa thiệp, bấm "Mở thiệp" để xem nội dung */
export default function OpenCover({ guestName, onOpen }: Props) {
  const { bride, groom, reception } = wedding;
  const [dd, mm, yyyy] = toVietnamDateParts(reception.start);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper px-6 text-center"
      exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.7, 0, 0.3, 1] } }}
    >
      <motion.div
        className="flex w-full max-w-[420px] flex-col items-center border border-navy/20 bg-white px-6 py-12 shadow-[0_10px_40px_-12px_rgb(29_44_107/0.3)]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-navy/70">Thiệp mời cưới</p>

        <img src={logoHQ} alt="Logo cô dâu chú rể" className="mt-6 w-28" />

        <p className="mt-4 whitespace-nowrap font-script text-[clamp(1.9rem,8.5vw,2.6rem)] text-royal">
          {bride.shortName} &amp; {groom.shortName}
        </p>

        <p className="mt-3 font-serif text-lg tracking-[0.25em]">
          {dd} · {mm} · {yyyy}
        </p>

        {guestName && (
          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest text-navy/70">Thân gửi</p>
            <p className="mt-1 font-script text-3xl text-navy">{guestName}</p>
          </div>
        )}

        <motion.button
          type="button"
          onClick={onOpen}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-navy px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-lg hover:bg-navy-light"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart className="h-4 w-4" />
          Mở thiệp
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
