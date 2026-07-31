import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">404</h2>
      <p className="text-gray-500 mb-6">ไม่พบหน้าที่คุณต้องการ</p>
      <Link to="/" className="text-amber-600 font-medium hover:underline">
        กลับหน้าแรก
      </Link>
    </div>
  );
}

export default NotFoundPage;