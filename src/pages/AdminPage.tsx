import { useState } from "react";
import AdminLogin from "../components/admin/AdminLogin";
import GiftQrManager from "../components/admin/GiftQrManager";
import GuestLinks from "../components/admin/GuestLinks";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { isLoggedIn, logout } from "../utils/auth";
import { giftQuery } from "../utils/gift";

/** Trang quản lý: upload mã QR mừng cưới + tạo link mời khách. Phải đăng nhập mới vào được. */
export default function AdminPage() {
  const [authed, setAuthed] = useState(isLoggedIn);
  const [gift, setGift] = useLocalStorage("admin.gift", "");

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  return (
    <main className="mx-auto min-h-svh max-w-2xl space-y-10 px-4 py-10 text-navy">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-script text-5xl text-royal">Quản lý thiệp</h1>
          <p className="mt-2 text-sm text-navy/70">Mọi thay đổi được lưu trên trình duyệt này.</p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-full border border-navy px-4 py-1.5 text-xs font-semibold hover:bg-navy/5"
          onClick={() => {
            logout();
            setAuthed(false);
          }}
        >
          Đăng xuất
        </button>
      </header>

      <GiftQrManager value={gift} onChange={setGift} />

      <hr className="border-navy/15" />

      <GuestLinks giftQuery={giftQuery(gift)} />
    </main>
  );
}
