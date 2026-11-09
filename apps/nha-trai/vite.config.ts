import { createHash } from "node:crypto";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

/** Phải giống hệt AUTH_SALT trong src/utils/auth.ts */
const AUTH_SALT = "wedding-invitation-admin";

/**
 * Zalo / Facebook chỉ hiện ảnh xem trước khi og:image là đường dẫn đầy đủ (có https://tên-miền).
 * Lúc build trên Vercel, tên miền chính có sẵn trong VERCEL_PROJECT_PRODUCTION_URL; muốn dùng tên miền khác
 * thì đặt biến SITE_URL (ví dụ https://thiepcuoi.vn).
 */
function absoluteOgImage(): Plugin {
  const raw = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || "";
  const site = raw && !/^https?:\/\//.test(raw) ? `https://${raw}` : raw;
  return {
    name: "absolute-og-image",
    transformIndexHtml(html) {
      if (!site) return html;
      return html.replace(
        /(<meta property="og:image" content=")(\/[^"]*)"/,
        (_, start: string, path: string) => `${start}${site.replace(/\/$/, "")}${path}"`,
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  // Chỉ đọc biến ADMIN_* (không có tiền tố VITE_ nên mật khẩu không bị nhúng vào code)
  const env = loadEnv(mode, process.cwd(), "ADMIN_");
  const username = (env.ADMIN_USERNAME ?? "").trim();
  const password = env.ADMIN_PASSWORD ?? "";
  const adminHash =
    username && password
      ? createHash("sha256").update(`${AUTH_SALT}\n${username}\n${password}`).digest("hex")
      : "";

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss(), absoluteOgImage()],
    define: {
      __ADMIN_HASH__: JSON.stringify(adminHash),
    },
  };
});
