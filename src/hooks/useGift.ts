import { useSearchParams } from "react-router-dom";
import { decodeGift, GIFT_PARAM, type GiftQr } from "../utils/gift";

/** Lấy mã QR mừng cưới gắn trong link thiệp (tham số qr). Không có thì trả về null. */
export function useGift(): GiftQr | null {
  const [params] = useSearchParams();
  return decodeGift(params.get(GIFT_PARAM));
}
