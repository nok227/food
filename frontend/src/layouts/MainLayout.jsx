import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import TabsBar from "../components/TabsBar";

// 🟢 โครงหลักของหน้าเว็บ ทุกหน้าจะใช้ร่วมกัน
// <Outlet /> คือจุดที่เนื้อหาของแต่ละ Route (Content) จะถูกดึงมาแสดง
//
// การเลื่อน (scroll):
// - นอกสุด h-screen + overflow-hidden -> ตัวหน้าเว็บทั้งหน้าไม่เลื่อน
// - Header, TabsBar, Sidebar อยู่นิ่งกับที่เสมอ
// - เฉพาะฝั่งขวา (Content + Footer) เท่านั้นที่เลื่อนได้ (overflow-y-auto)
//
// Nav บนถูกซ่อนไปแล้ว (ทุกขนาดจอ) — ใช้ Sidebar เป็นเมนูหลักแทน
// Sidebar เปิดเป็น default ตั้งแต่แรก กดปุ่มแฮมเบอร์เกอร์ใน Header เพื่อ toggle ซ่อน/แสดง
function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      <TabsBar />

      <div className="flex flex-1 min-h-0">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* ฝั่งขวา: มีแต่ Content + Footer ที่เลื่อนได้ */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <main className="flex-1 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
              <Outlet />
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;