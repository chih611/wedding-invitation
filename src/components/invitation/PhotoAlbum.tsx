import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import Section from "../common/Section";
import Ornament from "../common/Ornament";
import { photos, photoUrl, thumbUrl } from "../../data/photos";

const AUTOPLAY_MS = 4000;
const SWIPE_PX = 50;

/** Album ảnh cưới: ảnh lớn tự chuyển, vuốt để đổi ảnh, dải ảnh nhỏ bên dưới, bấm để xem toàn màn hình */
export default function PhotoAlbum() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [viewer, setViewer] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const count = photos.length;

  function go(next: number) {
    setDirection(next > index || (index === count - 1 && next === 0) ? 1 : -1);
    setIndex((next + count) % count);
  }

  // Tự chuyển ảnh, dừng khi khách đã tự bấm / vuốt hoặc đang xem toàn màn hình
  useEffect(() => {
    if (paused || viewer || count < 2) return;
    const id = setTimeout(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, viewer, count]);

  // Cuộn dải ảnh nhỏ để ảnh đang xem luôn nằm giữa
  useEffect(() => {
    const strip = thumbsRef.current;
    const item = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !item) return;
    strip.scrollTo({ left: item.offsetLeft - strip.clientWidth / 2 + item.clientWidth / 2, behavior: "smooth" });
  }, [index]);

  // Tải trước ảnh kế tiếp cho mượt
  useEffect(() => {
    if (count < 2) return;
    new Image().src = photoUrl(photos[(index + 1) % count]);
  }, [index, count]);

  if (count === 0) return null;

  function onSwipe(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) < SWIPE_PX) return;
    setPaused(true);
    go(info.offset.x < 0 ? index + 1 : index - 1);
  }

  return (
    <Section className="mx-auto w-full max-w-[460px] text-center">
      <p className="font-script text-4xl text-royal">Album ảnh cưới</p>
      <Ornament className="mt-2" />
      <p className="mt-2 text-xs uppercase tracking-[0.25em] text-navy/70">Our moments of love</p>

      <div className="relative mt-6 aspect-[4/5] overflow-hidden rounded-md bg-navy/5 shadow-[0_10px_30px_-12px_rgb(29_44_107/0.35)]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={index}
            src={photoUrl(photos[index])}
            alt={`Ảnh cưới ${index + 1}`}
            className="absolute inset-0 h-full w-full cursor-zoom-in object-contain"
            custom={direction}
            variants={{
              enter: (d: number) => ({ x: `${d * 100}%`, opacity: 0.4 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: `${d * -100}%`, opacity: 0.4 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={onSwipe}
            // onTap (không dùng onClick) để vuốt xong không bị mở nhầm chế độ toàn màn hình
            onTap={() => setViewer(true)}
            draggable={false}
          />
        </AnimatePresence>

        <NavButton side="left" onClick={() => (setPaused(true), go(index - 1))} />
        <NavButton side="right" onClick={() => (setPaused(true), go(index + 1))} />

        <span className="absolute bottom-2 right-2 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white">
          {index + 1} / {count}
        </span>
      </div>

      <div ref={thumbsRef} className="relative mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
        {photos.map((name, i) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setPaused(true);
              go(i);
            }}
            className={`h-16 w-16 shrink-0 overflow-hidden rounded transition ${
              i === index ? "ring-2 ring-navy ring-offset-2" : "opacity-60 hover:opacity-100"
            }`}
            aria-label={`Xem ảnh ${i + 1}`}
            aria-current={i === index}
          >
            <img src={thumbUrl(name)} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {viewer && <Lightbox index={index} onChange={go} onClose={() => setViewer(false)} />}
      </AnimatePresence>
    </Section>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Ảnh trước" : "Ảnh sau"}
      className={`absolute top-1/2 ${side === "left" ? "left-2" : "right-2"} flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-navy shadow transition hover:bg-white`}
    >
      <Chevron side={side} />
    </button>
  );
}

function Chevron({ side }: { side: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      {side === "left" ? (
        <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59Z" />
      ) : (
        <path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12l-4.58 4.59Z" />
      )}
    </svg>
  );
}

interface LightboxProps {
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}

/** Xem ảnh toàn màn hình: vuốt / phím mũi tên để đổi ảnh, Esc hoặc bấm nền để đóng */
function Lightbox({ index, onChange, onClose }: LightboxProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onChange(index - 1);
      if (e.key === "ArrowRight") onChange(index + 1);
    }
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [index, onChange, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh"
    >
      <motion.img
        key={index}
        src={photoUrl(photos[index])}
        alt={`Ảnh cưới ${index + 1}`}
        className="max-h-full max-w-full select-none object-contain"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) >= SWIPE_PX) onChange(info.offset.x < 0 ? index + 1 : index - 1);
        }}
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />

      <span className="absolute left-4 top-[calc(env(safe-area-inset-top,0px)+1rem)] text-sm text-white/80">
        {index + 1} / {photos.length}
      </span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Đóng"
        className="absolute right-3 top-[calc(env(safe-area-inset-top,0px)+0.5rem)] flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
          <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
        </svg>
      </button>
      {(["left", "right"] as const).map((side) => (
        <button
          key={side}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange(side === "left" ? index - 1 : index + 1);
          }}
          aria-label={side === "left" ? "Ảnh trước" : "Ảnh sau"}
          className={`absolute top-1/2 ${side === "left" ? "left-2" : "right-2"} hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white hover:bg-white/10 sm:flex`}
        >
          <Chevron side={side} />
        </button>
      ))}
    </motion.div>
  );
}
