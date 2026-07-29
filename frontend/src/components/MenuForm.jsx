// src/components/MenuCard.jsx

function MenuCard({ menu, onEdit, onDelete }) {
  if (!menu) return null;

  // รูปภาพสำรองเมื่อไม่มีรูป หรือ URL ไม่ถูกต้อง
  const fallbackImg = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500";

  // ตรวจสอบว่า imageUrl เป็น URL ที่ถูกต้องขึ้นต้นด้วย http:// หรือ https:// หรือไม่
  const hasValidImage = 
    menu?.imageUrl && 
    typeof menu.imageUrl === "string" && 
    (menu.imageUrl.startsWith("http://") || menu.imageUrl.startsWith("https://"));

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col justify-between">
      {/* ส่วนรูปภาพ */}
      <div className="h-48 w-full bg-gray-100 overflow-hidden relative">
        <img
          src={hasValidImage ? menu.imageUrl : fallbackImg}
          alt={menu?.name || "รูปเมนู"}
          className="w-full h-full object-cover"
          onError={(e) => {
            // ตัดการทำงานของ onError ทันทีเพื่อป้องกัน Loop นรก
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImg;
          }}
        />
      </div>

      {/* ส่วนข้อมูลชื่อและราคา */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {menu?.name || "ไม่ระบุชื่อเมนู"}
          </h3>
          <p className="text-emerald-600 font-semibold mt-1">
            ฿{Number(menu?.price || 0).toLocaleString()}
          </p>
        </div>

        {/* ปุ่มแก้ไข / ลบ */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit && onEdit(menu)}
            className="flex-1 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition"
          >
            แก้ไข
          </button>
          <button
            onClick={() => onDelete && onDelete(menu?.id)}
            className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;