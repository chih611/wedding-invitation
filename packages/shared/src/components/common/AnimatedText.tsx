import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

/**
 * Chữ hiện dần từ trái sang phải, giống như đang được viết tay.
 * Lớp ngoài dùng để theo dõi khi nào cuộn tới (không bị che), lớp trong chạy hiệu ứng.
 * Có padding để nét bay của font chữ viết tay không bị cắt.
 */
export default function AnimatedText({
  children,
  className = "",
  delay = 0,
  duration = 2,
}: Props) {
  return (
    <motion.span
      className="inline-block"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <motion.span
        className={`inline-block px-3 py-2 ${className}`}
        variants={{
          hidden: { clipPath: "inset(0 100% 0 0)" },
          visible: { clipPath: "inset(0 0% 0 0)" },
        }}
        transition={{ duration, delay, ease: "easeInOut" }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
