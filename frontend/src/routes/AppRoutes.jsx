import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";

// 🟢 กำหนดเส้นทาง (Routes) ของแอปทั้งหมดไว้ที่นี่ที่เดียว
// ถ้าจะเพิ่มหน้าใหม่ในอนาคต (เช่น /orders, /about) ให้เพิ่ม <Route> ที่นี่
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          {/* ตัวอย่างการเพิ่มหน้าใหม่ในอนาคต
          <Route path="orders" element={<OrdersPage />} />
          <Route path="about" element={<AboutPage />} />
          */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;