import { useSearchParams } from "react-router-dom";

/**
 * Lấy tên khách mời từ link, ví dụ: /?to=Anh%20Nam
 * Trả về chuỗi rỗng nếu link không có tên.
 */
export function useGuestName() {
  const [params] = useSearchParams();
  return (params.get("to") ?? "").trim().slice(0, 60);
}
