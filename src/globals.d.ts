/** Mã băm tài khoản admin, vite.config.ts tạo lúc build từ ADMIN_USERNAME / ADMIN_PASSWORD trong .env */
declare const __ADMIN_HASH__: string;

interface ImportMetaEnv {
  /** Link Google Form xác nhận tham dự (…/forms/d/e/<mã>/viewform). Để trống thì form ẩn */
  readonly VITE_RSVP_FORM_URL?: string;
}
