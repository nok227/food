import { NavLink } from "react-router-dom";
import { navItems } from "../data/navItems";

// 🟢 เมนูนำทางแนวนอน แสดงเฉพาะจอ md ขึ้นไป (จอมือถือใช้ Sidebar แบบเลื่อนออกแทน)
function Nav() {
  return (
    <nav className="hidden md:block shrink-0 bg-amber-500 px-8">
      <ul className="flex gap-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-white text-amber-600"
                    : "text-white hover:bg-amber-600"
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;