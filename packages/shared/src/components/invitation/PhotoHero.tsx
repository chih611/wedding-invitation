import { motion } from "framer-motion";
import { useWedding } from "../../config";
import { photoUrl } from "../../utils/photos";
import { toVietnamDateParts } from "../../utils/date";

/** Ảnh lớn ở đầu thiệp (khung dọc 2:3, ảnh được cắt cho vừa), kèm tên cô dâu chú rể và ngày cưới */
export default function PhotoHero() {
  const { wedding, couple, photos } = useWedding();
  const { reception } = wedding;
  const [dd, mm, yyyy] = toVietnamDateParts(reception.start);

  return (
    <motion.figure
      className="relative mx-auto aspect-[2/3] w-full max-w-[460px] overflow-hidden bg-navy/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.img
        src={photoUrl(photos.hero)}
        alt={`${couple[0].shortName} và ${couple[1].shortName}`}
        className="h-full w-full object-cover"
        style={{ objectPosition: photos.heroPosition }}
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: "easeOut" }}
        fetchPriority="high"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent px-6 pb-8 pt-24 text-center text-white">
        <p className="text-[11px] uppercase tracking-[0.35em] text-white/85">Save the date</p>
        <p className="mt-2 whitespace-nowrap font-script text-[clamp(2rem,9vw,2.8rem)] leading-tight drop-shadow">
          {couple[0].shortName} &amp; {couple[1].shortName}
        </p>
        <p className="mt-1 font-serif text-base tracking-[0.3em]">
          {dd} · {mm} · {yyyy}
        </p>
      </figcaption>
    </motion.figure>
  );
}
