import { NavLink } from "react-router-dom";
import { navItems } from "../data/navItems";

// 🟢 Sidebar: เมนูหลักเดียวของเว็บ (แทน Nav บนที่ถูกซ่อนไปแล้ว)
// ทำงานเป็นเมนูแบบเลื่อนออกจากซ้าย (drawer) เหมือนกันทุกขนาดจอ
// เปิด/ปิดผ่านปุ่มแฮมเบอร์เกอร์ใน Header (props open/onClose)
function Sidebar({ open, onClose }) {
  return (
    <>
      {/* ฉากหลังสีดำโปร่งตอนเปิดเมนู กดเพื่อปิด (แสดงทุกขนาดจอ) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 p-5 overflow-y-auto
        transform transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
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
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
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
      </aside>
    </>
  );
}

export default Sidebar;