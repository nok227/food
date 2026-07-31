import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecentTabsProvider } from "../context/RecentTabsContext";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";

// 🟢 กำหนดเส้นทาง (Routes) ของแอปทั้งหมดไว้ที่นี่ที่เดียว
// ถ้าจะเพิ่มหน้าใหม่ในอนาคต (เช่น /orders, /about) ให้เพิ่ม <Route> ที่นี่
function AppRoutes() {
  return (
    <BrowserRouter>
      <RecentTabsProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </RecentTabsProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;