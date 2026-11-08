import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { decodeGift, GIFT_PARAM, type GiftQr } from "../utils/gift";
import { fetchGift } from "../utils/giftApi";

/**
 * Mã QR mừng cưới của thiệp:
 * 1. Mã admin đã upload (lưu trên server) — link nào cũng có, kể cả link gốc.
 * 2. Không có thì dùng mã gắn trong link (?qr=), để các link cũ vẫn chạy.
 * Cả hai đều không có thì trả về null (thiệp ẩn hộp mừng cưới).
 */
export function useGift(): GiftQr | null {
  const [params] = useSearchParams();
  const [remote, setRemote] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchGift()
      .then((qr) => alive && setRemote(qr))
      .catch(() => {
        // Không đọc được server thì dùng mã trong link (nếu có)
      });
    return () => {
      alive = false;
    };
  }, []);

  return decodeGift(remote) ?? decodeGift(params.get(GIFT_PARAM));
}
