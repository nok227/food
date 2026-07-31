import { Link } from "react-router-dom";

// 🟢 หน้า 404 แบบสวย รองรับทุกขนาดจอ ใช้ทดสอบเข้า path ที่ไม่มีอยู่จริง
function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 px-4">
      <p className="text-amber-500 font-extrabold text-7xl sm:text-8xl mb-2 leading-none">404</p>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
        ไม่พบหน้าที่คุณต้องการ
      </h2>
      <p className="text-gray-500 text-sm sm:text-base mb-8 max-w-sm">
        หน้าที่คุณกำลังมองหาอาจถูกย้าย ลบไปแล้ว หรือไม่เคยมีอยู่จริง
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition"
      >
        กลับหน้าแรก
      </Link>
    </div>
  );
}

export default NotFoundPage;