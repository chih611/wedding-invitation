import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ReceptionPage from "../pages/ReceptionPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reception" element={<ReceptionPage />} />
      </Routes>
    </BrowserRouter>
  );
}
