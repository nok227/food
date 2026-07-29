// src/components/MenuCard.jsx

function MenuCard({ menu, onEdit, onDelete }) {
  // 🟢 1. ดักป้องกันกรณีข้อมูล menu เป็น null หรือ undefined
  if (!menu) return null;

  // 🟢 2. ตรวจเช็กว่า imageUrl เป็นลิงก์รูปภาพจริงๆ (ขึ้นต้นด้วย http:// หรือ https://) หรือไม่
  const isRealUrl =
    typeof menu.imageUrl === "string" &&
    (menu.imageUrl.startsWith("http://") || menu.imageUrl.startsWith("https://"));

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col justify-between p-4">
      {/* ส่วนแสดงรูปภาพ (ถ้าลิงก์พัง จะโชว์กรอบสีเทาแทน ไม่ปล่อยให้ App พัง) */}
      <div className="h-40 w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative mb-3">
        {isRealUrl ? (
          <img
            src={menu.imageUrl}
            alt={menu.name || "รูปเมนู"}
            className="w-full h-full object-cover"
            onError={(e) => {
              // ถ้าลิงก์ขึ้นต้นด้วย http แต่เป็นลิงก์เสีย ดึงรูปไม่ได้ ให้เปลี่ยนเป็นข้อความแจ้งเตือนทันที
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling.style.display = "flex";
            }}
          />
        ) : null}

        {/* กรอบแสดงกรณีรูปพัง / ใส่ข้อความมั่วมา เช่น 'sssss' หรือ 'Zhhshs' */}
        <div
          className={`w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100 text-xs p-2 text-center ${
            isRealUrl ? "hidden" : "flex"
          }`}
        >
          <span className="font-bold text-gray-500 mb-1">⚠️ รูปภาพไม่ถูกต้อง</span>
          <span className="truncate max-w-[150px]">{String(menu.imageUrl || "ไม่มีรูป")}</span>
        </div>
      </div>

      {/* ส่วนแสดงข้อมูลชื่อและราคา (แสดงแน่นอน 100%) */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 break-words">
            {menu.name || "ไม่ระบุชื่อ"}
          </h3>
          <p className="text-emerald-600 font-semibold mt-1">
            ฿{Number(menu.price || 0).toLocaleString()}
          </p>
        </div>

        {/* ปุ่มกดลบ/แก้ไข (เอาไว้ให้คุณกดลบรายการที่พังทิ้งได้) */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit && onEdit(menu)}
            className="flex-1 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition"
          >
            แก้ไข
          </button>
          <button
            onClick={() => onDelete && onDelete(menu.id)}
            className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
          >
            🗑️ ลบ
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;