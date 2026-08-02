import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoadingPage from "../components/LoadingPage"; //[cite: 16]
import { RecentTabsProvider } from "../context/RecentTabsContext"; //[cite: 13]

// 🟢 1. ໂຫລດທຸກໜ້າແບບ lazy (รวมถึง MasterDataPage)
const DashboardPage = lazy(() => import("../admin/Dashboard"));
const MasterDataPage = lazy(() => import("../pages/MasterDataPage"));
const HomePage = lazy(() => import("../pages/HomePage"));
const OrdersPage = lazy(() => import("../pages/OrdersPage"));
const AboutPage = lazy(() => import("../pages/AboutPage")); //[cite: 9]
const ContactPage = lazy(() => import("../pages/ContactPage")); //[cite: 10]
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

function AppRoutes() {
  return (
    <BrowserRouter>
      <RecentTabsProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* หน้าหลัก Dashboard */}
            <Route
              index
              element={
                <Suspense fallback={<LoadingPage />}>
                  <DashboardPage />
                </Suspense>
              }
            />

            {/* 🟢 ຈັດການຂໍ້ມູນ (Master Data) */}
            <Route
              path="/master-data"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <MasterDataPage />
                </Suspense>
              }
            />

            {/* ບັນທຶກເມນູ */}
            <Route
              path="/homepage"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <HomePage />
                </Suspense>
              }
            />

            {/* ຈັດການອໍເດີ */}
            <Route
              path="/orders"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <OrdersPage />
                </Suspense>
              }
            />

            {/* ລາຍງານຂໍ້ມູນ */}
            <Route
              path="/about"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <AboutPage />
                </Suspense>
              }
            />

            {/* ຕິດຕໍ່ເຮົາ */}
            <Route
              path="/contact"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <ContactPage />
                </Suspense>
              }
            />

            {/* หน้า 404 */}
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