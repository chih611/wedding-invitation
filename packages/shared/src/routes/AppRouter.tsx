import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "../pages/AdminPage";

/** Trang thiệp ở "/" (bố cục riêng của từng app) và trang quản lý ở "/admin" */
export default function AppRouter({ home }: { home: React.ReactNode }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={home} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/tao-link" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
