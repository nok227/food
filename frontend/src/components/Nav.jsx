import { NavLink } from "react-router-dom";

// 🟢 เมนูนำทางหลัก ใช้ NavLink เพื่อให้ลิงก์ที่ Active มีสไตล์ต่างจากปกติอัตโนมัติ
const navItems = [
  { to: "/", label: "หน้าเมนู", end: true },
  // เพิ่มลิงก์หน้าอื่นๆ ในอนาคตได้ที่นี่ เช่น
  // { to: "/orders", label: "ออเดอร์" },
];

function Nav() {
  return (
    <nav className="bg-amber-500 px-8">
      <ul className="flex gap-2">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `inline-block px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-white text-amber-600"
                    : "text-white hover:bg-amber-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;