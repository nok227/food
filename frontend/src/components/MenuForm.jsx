// src/components/MenuCard.jsx

function MenuCard({ menu, onEdit, onDelete }) {
  if (!menu) return null;

  // รูปสำรองกรณีไม่มีรูป หรือลิงก์พัง
  const fallbackImg = "https://placehold.co/600x400/e2e8f0/475569?text=No+Image";

  // เช็กว่า URL เป็นลิงก์ที่ขึ้นต้นด้วย http/https จริงหรือไม่ (ป้องกันพวก 'sssss' หรือ 'Zhhshs')
  const isValidUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    return url.startsWith("http://") || url.startsWith("https://");
  };

  const initialSrc = isValidUrl(menu?.imageUrl) ? menu.imageUrl : fallbackImg;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col justify-between">
      {/* ส่วนแสดงรูปภาพ */}
      <div className="h-48 w-full bg-gray-100 overflow-hidden relative">
        <img
          src={initialSrc}
          alt={menu?.name || "รูปเมนู"}
          className="w-full h-full object-cover"
          onError={(e) => {
            // 🟢 ป้องกันลูปนรก: ถอด onError ออกทันทีหลังทำงานครั้งแรก
            e.currentTarget.onerror = null; 
            e.currentTarget.src = fallbackImg;
          }}
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