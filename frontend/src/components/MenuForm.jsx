// src/components/MenuCard.jsx
import { useState } from "react";

function MenuCard({ menu, onEdit, onDelete }) {
  // ใช้ State เช็กว่ารูปโหลดผ่านหรือไม่
  const [imgError, setImgError] = useState(false);

  if (!menu) return null;

  // รูปสำรองกรณีไม่มีรูป หรือรูปพัง
  const fallbackImg = "https://placehold.co/600x400/e2e8f0/475569?text=Food+Image";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col justify-between">
      {/* ส่วนแสดงรูปภาพ */}
      <div className="h-48 w-full bg-gray-100 overflow-hidden relative">
        <img
          src={imgError || !menu?.imageUrl ? fallbackImg : menu.imageUrl}
          alt={menu?.name || "รูปเมนู"}
          className="w-full h-full object-cover"
          // 🟢 ถ้าโหลดรูปไม่ขึ้น จะเปลี่ยน State เป็น true ทันที (และทำงานครั้งเดียว ไม่เกิด Infinite loop)
          onError={() => setImgError(true)}
        />
      </div>

      {/* ส่วนแสดงข้อมูล */}
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