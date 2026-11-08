import { createHash } from "node:crypto";
import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

/** Phải giống hệt AUTH_SALT trong src/utils/auth.ts */
const AUTH_SALT = "wedding-invitation-admin";

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
    plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
    define: {
      __ADMIN_HASH__: JSON.stringify(adminHash),
    },
  };
});
