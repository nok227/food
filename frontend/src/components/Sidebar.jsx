import { NavLink } from "react-router-dom";
import { navItems } from "../data/navItems";

// 🟢 Sidebar แบบ "ดันเนื้อหา" (push) ไม่ใช่ลอยทับแบบ overlay
// เป็น flex item ปกติในเลย์เอาต์ -> ตอนเปิด/ปิดแค่เปลี่ยนความกว้าง (w-64 <-> w-0)
// เนื้อหาฝั่งขวา (Content/Footer) จะขยับตามอัตโนมัติเพราะมี flex-1 อยู่แล้ว
function Sidebar({ open, onClose }) {
  return (
    <aside
      className={`shrink-0 bg-white border-r border-gray-200 overflow-y-auto overflow-x-hidden
      transition-all duration-200 ${open ? "w-64" : "w-0"}`}
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
  );
}

export default Sidebar;