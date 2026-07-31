import { Link } from "react-router-dom";
import { navItems } from "../data/navItems";

// 🟢 Footer แบบเว็บทั่วไป: แนะนำเว็บ + ลิงก์ด่วน + ข้อมูลติดต่อ + บรรทัดลิขสิทธิ์
function Footer() {
  return (
    <footer className="shrink-0 bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
        <div>
          <h3 className="font-bold text-gray-800 mb-2">Food Ordering Menu</h3>
          <p className="text-gray-500 leading-relaxed">
            ระบบจัดการเมนูอาหารสำหรับร้านค้า อัปเดตแบบเรียลไทม์ผ่าน Socket.IO
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">ลิงก์ด่วน</h4>
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className="text-gray-500 hover:text-amber-600 transition">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">ติดต่อ</h4>
          <ul className="flex flex-col gap-1 text-gray-500">
            <li>[email protected]</li>
            <li>020-000-0000</li>
            <li>เวียงจันทน์, สปป.ลาว</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 px-4 sm:px-8 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Food Ordering Menu — All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;