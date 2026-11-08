import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { wedding } from "../../data/wedding";

/**
 * Nhạc nền + nút bật/tắt nổi ở góc dưới bên phải. Không có file nhạc thì ẩn.
 * Trình duyệt thường chặn tự phát nhạc khi khách chưa bấm gì, nên: thử phát ngay khi mở trang,
 * bị chặn thì phát ở lần đầu khách chạm / bấm vào trang.
 */
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  function play() {
    audioRef.current?.play().catch(() => setPlaying(false));
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let userPaused = false;

    function startOnFirstTouch(e: Event) {
      stopListening();
      // Lần chạm đầu là vào nút nhạc thì để nút tự xử lý, không phát rồi tắt ngay
      if (buttonRef.current?.contains(e.target as Node)) return;
      if (!userPaused) audio?.play().catch(() => {});
    }
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    function stopListening() {
      events.forEach((name) => window.removeEventListener(name, startOnFirstTouch, true));
    }

    audio.play().catch(() => {
      events.forEach((name) => window.addEventListener(name, startOnFirstTouch, true));
    });

    // Khách chuyển sang app khác (ví dụ quét QR) thì tạm dừng, quay lại thì phát tiếp
    let resume = false;
    function onVisibility() {
      if (!audio) return;
      if (document.hidden) {
        resume = !audio.paused;
        audio.pause();
      } else if (resume) {
        audio.play().catch(() => {});
      }
    }
    function onUserPause() {
      if (!document.hidden) userPaused = true;
    }
    document.addEventListener("visibilitychange", onVisibility);
    audio.addEventListener("pause", onUserPause);

    return () => {
      stopListening();
      document.removeEventListener("visibilitychange", onVisibility);
      audio.removeEventListener("pause", onUserPause);
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={wedding.music.src}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setAvailable(false)}
      />
      {available && (
        <motion.button
          ref={buttonRef}
          type="button"
          onClick={() => (playing ? audioRef.current?.pause() : play())}
          aria-label={playing ? `Tắt nhạc ${wedding.music.title}` : `Bật nhạc ${wedding.music.title}`}
          aria-pressed={playing}
          title={wedding.music.title}
          className="fixed right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white shadow-lg ring-4 ring-white/70 transition hover:bg-navy-light"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, rotate: playing ? 360 : 0 }}
          transition={
            playing
              ? { rotate: { duration: 6, repeat: Infinity, ease: "linear" }, default: { duration: 0.3 } }
              : { duration: 0.3 }
          }
        >
          {playing ? <NoteIcon /> : <MutedIcon />}
        </motion.button>
      )}
    </>
  );
}

function NoteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M4.27 3 3 4.27l9 9v.28A4 4 0 1 0 14 17v-1.73L19.73 21 21 19.73 4.27 3ZM14 7h4V3h-6v5.18l2 2V7Z" />
    </svg>
  );
}
