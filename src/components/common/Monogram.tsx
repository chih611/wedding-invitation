import logo from "../../assets/monogram.png";

interface Props {
  className?: string;
}

/**
 * Logo H&Q. Dùng ảnh làm "khuôn" (CSS mask) rồi tô màu bằng bg-*,
 * nên đổi màu logo chỉ cần đổi class, không phải sửa file ảnh.
 */
export default function Monogram({ className = "w-28 bg-royal" }: Props) {
  return (
    <span
      role="img"
      aria-label="Logo cô dâu chú rể H&Q"
      className={`inline-block aspect-[600/614] ${className}`}
      style={{
        maskImage: `url(${logo})`,
        WebkitMaskImage: `url(${logo})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
