import { useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import TabsBar from "../components/TabsBar";

const SWIPE_THRESHOLD = 60; // ระยะปัดขั้นต่ำ (px) ถึงจะนับว่าเป็นการปัด
const EDGE_ZONE = 40; // ปัดเปิดได้เฉพาะเริ่มจากใกล้ขอบซ้ายจอ (px)

// 🟢 โครงหลักของหน้าเว็บ ทุกหน้าจะใช้ร่วมกัน
// <Outlet /> คือจุดที่เนื้อหาของแต่ละ Route (Content) จะถูกดึงมาแสดง
//
// การเลื่อน (scroll):
// - นอกสุด h-screen + overflow-hidden -> ตัวหน้าเว็บทั้งหน้าไม่เลื่อน
// - Header, TabsBar, Sidebar อยู่นิ่งกับที่เสมอ
// - เฉพาะฝั่งขวา (Content + Footer) เท่านั้นที่เลื่อนได้ (overflow-y-auto)
//
// Nav บนถูกซ่อนไปแล้ว (ทุกขนาดจอ) — ใช้ Sidebar เป็นเมนูหลักแทน
// จอใหญ่ (md ขึ้นไป): Sidebar เปิดเป็น default / จอเล็ก: ปิดเป็น default
// เปิด/ปิดได้ 2 ทาง: กดปุ่มแฮมเบอร์เกอร์ใน Header หรือ "ปัดนิ้ว" บนจอสัมผัส
// - ปัดไปทางซ้าย (ที่ไหนก็ได้) ตอน Sidebar เปิดอยู่ -> ปิด
// - ปัดไปทางขวาเริ่มจากใกล้ขอบซ้ายจอ ตอน Sidebar ปิดอยู่ -> เปิด
//
// พฤติกรรม Sidebar ต่างกันตามขนาดจอ (ดูรายละเอียดใน Sidebar.jsx):
// - จอใหญ่ (md+): ดันเนื้อหา (push) เหมือนเดิม
// - จอเล็ก: ลอยทับเนื้อหา (overlay/float) พร้อม backdrop มืด ไม่ดันเนื้อหาอีกต่อไป
function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768
  );
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const startX = touchStartX.current;
    const deltaX = e.changedTouches[0].clientX - startX;
    touchStartX.current = null;

    if (deltaX < -SWIPE_THRESHOLD && sidebarOpen) {
      setSidebarOpen(false); // ปัดซ้าย -> ปิด
    } else if (deltaX > SWIPE_THRESHOLD && !sidebarOpen && startX < EDGE_ZONE) {
      setSidebarOpen(true); // ปัดขวาจากขอบจอ -> เปิด
    }
  };

  return (
    <div
      className="h-screen flex flex-col bg-gray-50 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      <TabsBar />

      {/* 🟢 relative: จำเป็นสำหรับ Sidebar บนจอเล็ก ที่ใช้ position: absolute ลอยทับ (ไม่ดันเนื้อหา) */}
      <div className="flex flex-1 min-h-0 relative">
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