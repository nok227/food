import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoadingPage from "../components/LoadingPage";
import { RecentTabsProvider } from "../context/RecentTabsContext";
import MasterDataPage from "../pages/MasterDataPage";

// 🟢 โหลดแต่ละหน้าแบบ lazy -> ได้เห็น LoadingPage จริงๆ ตอนสลับหน้า (code splitting)
const DashboardPage = lazy(() => import("../admin/Dashboard"));
const HomePage = lazy(() => import("../pages/HomePage"));
const OrdersPage = lazy(() => import("../pages/OrdersPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

// 🟢 กำหนดเส้นทาง (Routes) ของแอปทั้งหมดไว้ที่นี่ที่เดียว
// ถ้าจะเพิ่มหน้าใหม่ในอนาคต: 1) เพิ่มไฟล์ใน pages/ 2) เพิ่ม path ใน data/navItems.js
// 3) เพิ่ม <Route> ที่นี่
function AppRoutes() {
  return (
    <BrowserRouter>
      <RecentTabsProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                <Suspense fallback={<LoadingPage />}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route path="/master-data" element={<MasterDataPage />} />
            <Route
              path="/homepage"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <HomePage />
                </Suspense>
              }
            />
            <Route
              path="orders"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <OrdersPage />
                </Suspense>
              }
            />
            <Route
              path="about"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <AboutPage />
                </Suspense>
              }
            />
            <Route
              path="contact"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <ContactPage />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <NotFoundPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </RecentTabsProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;