import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoadingPage from "../components/LoadingPage";
import { RecentTabsProvider } from "../context/RecentTabsContext";

// 🟢 Lazy Load หน้าต่างๆ
const DashboardPage = lazy(() => import("../admin/Dashboard"));
const MasterDataPage = lazy(() => import("../pages/MasterDataPage"));
const StockPage = lazy(() => import("../pages/StockPage")); // 🟢 เพิ่มหน้า StockPage
const HomePage = lazy(() => import("../pages/HomePage"));
const OrdersPage = lazy(() => import("../pages/OrdersPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const QRCodeModal = lazy(() => import("../pages/QRCodeModal"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

function AppRoutes() {
  return (
    <BrowserRouter>
      <RecentTabsProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Dashboard */}
            <Route
              index
              element={
                <Suspense fallback={<LoadingPage />}>
                  <DashboardPage />
                </Suspense>
              }
            />

            {/* Master Data */}
            <Route
              path="/master-data"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <MasterDataPage />
                </Suspense>
              }
            />

            {/* 🟢 จัดการสต็อก (Stock Management) */}
            <Route
              path="/stock"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <StockPage />
                </Suspense>
              }
            />

            {/* บันทึกเมนู */}
            <Route
              path="/homepage"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <HomePage />
                </Suspense>
              }
            />

            {/* จัดการออเดอร์ */}
            <Route
              path="/orders"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <OrdersPage />
                </Suspense>
              }
            />

            {/* รายงานข้อมูล */}
            <Route
              path="/about"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <AboutPage />
                </Suspense>
              }
            />

            {/* ติดต่อเรา */}
            <Route
              path="/qrcode"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <QRCodeModal />
                </Suspense>
              }
            />

            {/* Page Not Found */}
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