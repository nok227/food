import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Nav from "../components/Nav";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

// 🟢 โครงหลักของหน้าเว็บ (Layout) ที่ทุกหน้าจะใช้ร่วมกัน
// <Outlet /> คือจุดที่เนื้อหาของแต่ละ Route (Content) จะถูกดึงมาแสดง
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Nav />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default MainLayout;