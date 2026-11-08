import { useState, type FormEvent } from "react";
import { adminConfigured, login } from "../../utils/auth";

interface Props {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    // Chờ một chút sau mỗi lần thử để khó dò mật khẩu
    await new Promise((r) => setTimeout(r, 400));
    if (login(username, password)) {
      onSuccess();
    } else {
      setError("Sai tên đăng nhập hoặc mật khẩu.");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4 text-navy">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-md border border-navy/15 bg-white p-6 shadow-sm">
        <h1 className="text-center font-script text-4xl text-royal">Quản lý thiệp</h1>

        {!adminConfigured ? (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            Chưa đặt tài khoản admin. Tạo file <code>.env</code> ở thư mục gốc với <code>ADMIN_USERNAME</code> và{" "}
            <code>ADMIN_PASSWORD</code> (xem <code>.env.example</code>), rồi chạy lại <code>npm run dev</code> hoặc build lại.
          </p>
        ) : (
          <>
            <label className="block text-sm">
              <span className="font-semibold">Tên đăng nhập</span>
              <input
                className="mt-1 w-full rounded-md border border-navy/30 px-3 py-2 outline-none focus:border-navy"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className="font-semibold">Mật khẩu</span>
              <input
                type="password"
                className="mt-1 w-full rounded-md border border-navy/30 px-3 py-2 outline-none focus:border-navy"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy || !username || !password}
              className="w-full rounded-full bg-navy py-2.5 text-sm font-semibold text-white transition hover:bg-navy-light disabled:opacity-40"
            >
              {busy ? "Đang kiểm tra..." : "Đăng nhập"}
            </button>
          </>
        )}
      </form>
    </main>
  );
}
