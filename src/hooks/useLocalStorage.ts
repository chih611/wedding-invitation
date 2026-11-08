import { useEffect, useState } from "react";

/** Giống useState nhưng lưu lại trong trình duyệt, tải lại trang không bị mất */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved === null ? initial : (JSON.parse(saved) as T);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Trình duyệt chặn lưu trữ (ví dụ chế độ ẩn danh) thì bỏ qua
    }
  }, [key, value]);

  return [value, setValue] as const;
}
