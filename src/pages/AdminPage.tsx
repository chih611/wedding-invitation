import { useEffect, useState } from "react";
import AdminLogin from "../components/admin/AdminLogin";
import GiftQrManager, { type SaveState } from "../components/admin/GiftQrManager";
import GuestLinks from "../components/admin/GuestLinks";
import { isLoggedIn, logout } from "../utils/auth";
import { fetchGift, saveGift } from "../utils/giftApi";

/** Trang quản lý: upload mã QR mừng cưới + tạo link mời khách. Phải đăng nhập mới vào được. */
export default function AdminPage() {
  const [authed, setAuthed] = useState(isLoggedIn);

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  return (
    <Dashboard
      onLogout={() => {
        logout();
        setAuthed(false);
      }}
    />
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  // Mã QR lưu trên server: ai mở thiệp (kể cả link gốc) cũng thấy
  const [gift, setGift] = useState("");
  const [state, setState] = useState<SaveState>({ kind: "loading" });

  useEffect(() => {
    let alive = true;
    fetchGift(true)
      .then((qr) => {
        if (!alive) return;
        setGift(qr);
        setState({ kind: "idle" });
      })
      .catch((e: Error) => alive && setState({ kind: "error", text: e.message }));
    return () => {
      alive = false;
    };
  }, []);

  async function save(next: string) {
    const previous = gift;
    setGift(next);
    setState({ kind: "saving" });
    try {
      setGift(await saveGift(next));
      setState({ kind: "saved", text: next ? "Đã lưu. Mọi link thiệp (kể cả link gốc) giờ hiện mã QR này." : "Đã xoá mã QR khỏi thiệp." });
    } catch (e) {
      setGift(previous);
      setState({ kind: "error", text: (e as Error).message });
    }
  }

  return (
    <main className="mx-auto min-h-svh max-w-2xl space-y-10 px-4 py-10 text-navy">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-script text-5xl text-royal">Quản lý thiệp</h1>
          <p className="mt-2 text-sm text-navy/70">
            Mã QR được lưu trên máy chủ. Danh sách khách được lưu trên trình duyệt này.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-full border border-navy px-4 py-1.5 text-xs font-semibold hover:bg-navy/5"
          onClick={onLogout}
        >
          Đăng xuất
        </button>
      </header>

      <GiftQrManager value={gift} onChange={save} state={state} />

      <hr className="border-navy/15" />

      <GuestLinks />
    </main>
  );
}
