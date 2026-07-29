// src/components/MenuCard.jsx

function MenuCard({ menu, onEdit, onDelete }) {
  // รูปสำรองกรณีไม่มีรูป หรือรูปโหลดไม่ได้ (รูปจานอาหารสวยๆ จาก Unsplash)
  const defaultImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col justify-between">
      {/* ส่วนแสดงรูปภาพ */}
      <div className="h-48 w-full bg-gray-100 overflow-hidden relative">
        <img
          src={menu.imageUrl || defaultImage}
          alt={menu.name}
          className="w-full h-full object-cover"
          // 🟢 ถ้าลิงก์รูปผิด หรือดึงรูปไม่ได้ ให้สลับไปใช้รูป default สวยๆ ทันที
          onError={(e) => {
            e.target.onerror = null; // ป้องกัน infinite loop
            e.target.src = defaultImage;
          }}
        />
      </div>

      {/* ส่วนแสดงข้อมูลชื่อและราคา */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{menu.name}</h3>
          <p className="text-emerald-600 font-semibold mt-1">
            ฿{Number(menu.price).toLocaleString()}
          </p>
        </div>

        {/* ปุ่มแก้ไข / ลบ */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit(menu)}
            className="flex-1 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition"
          >
            แก้ไข
          </button>
          <button
            onClick={() => onDelete(menu.id)}
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