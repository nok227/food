import { NavLink } from "react-router-dom";
import { navItems } from "../data/navItems";

// 🟢 Sidebar แบบ "ลูกผสม" ตามขนาดจอ
// - จอใหญ่ (md ขึ้นไป): แบบเดิม "ดันเนื้อหา" (push) เป็น flex item ปกติ
//   ตอนเปิด/ปิดแค่เปลี่ยนความกว้าง (md:w-64 <-> md:w-0)
// - จอเล็ก (ต่ำกว่า md): แบบ "ลอยทับ" (overlay/float) ไม่ดันเนื้อหา
//   ใช้ position: absolute ซ้อนอยู่เหนือเนื้อหา แล้วเลื่อนเข้า-ออกด้วย translate-x
//   พร้อม backdrop สีเข้มคลุมเนื้อหา กดที่ backdrop เพื่อปิดได้
//
// หมายเหตุ: ต้องมี "relative" อยู่ที่ container ห่อ (flex flex-1 min-h-0 relative)
// ใน MainLayout.jsx เพื่อให้ position: absolute ของ aside ยึดตำแหน่งถูกที่
function Sidebar({ open, onClose }) {
  // ปิด sidebar อัตโนมัติเมื่อกดลิงก์เมนู แต่ทำเฉพาะจอเล็ก (จอใหญ่ให้เปิดค้างไว้)
  const handleNavClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* 🟢 Backdrop: แสดงเฉพาะจอเล็กตอน sidebar เปิดอยู่ กดเพื่อปิด */}
      {open && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="absolute inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`absolute md:static inset-y-0 left-0 z-40 shrink-0
        bg-white border-r border-gray-200 overflow-y-auto overflow-x-hidden shadow-xl md:shadow-none
        transition-transform md:transition-all duration-200 w-64
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 ${open ? "md:w-64" : "md:w-0"}`}
      >
        {/* กำหนดความกว้างคงที่ของเนื้อหาข้างในไว้ที่ w-64 เสมอ
            กัน text ห่อ/บีบเบี้ยวระหว่างที่ aside กำลังเปลี่ยนความกว้าง */}
        <div className="w-64 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">
              เมนู
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="ปิดเมนู"
              className="text-gray-400 hover:text-gray-600 text-xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                    isActive
                      ? "bg-amber-50 text-amber-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;