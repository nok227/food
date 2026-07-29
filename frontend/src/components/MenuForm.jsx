// src/components/MenuCard.jsx

function MenuCard({ menu, onEdit, onDelete }) {
  if (!menu) return null;

  // ตรวจสอบอย่างเข้มงวดว่าต้องเป็น URL จริงที่ขึ้นต้นด้วย http:// หรือ https:// เท่านั้น
  const isValidHttpUrl = (string) => {
    if (!string || typeof string !== "string") return false;
    return string.startsWith("http://") || string.startsWith("https://");
  };

  const hasImage = isValidHttpUrl(menu.imageUrl);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col justify-between p-4">
      {/* ส่วนแสดงรูปภาพ: ถ้าไม่ใช่ URL จริง จะไม่ใช้แท็ก <img> เลย เพื่อป้องกันเบราว์เซอร์ยิง Request มั่ว */}
      <div className="h-40 w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative mb-3">
        {hasImage ? (
          <img
            src={menu.imageUrl}
            alt={menu.name || "รูปเมนู"}
            className="w-full h-full object-cover"
            onError={(e) => {
              // ถ้าลิงก์พัง ซ่อนตัวรูปแล้วเปิดข้อความเตือนแทน
              e.currentTarget.style.display = "none";
              if (e.currentTarget.nextElementSibling) {
                e.currentTarget.nextElementSibling.style.display = "flex";
              }
            }}
          />
        ) : null}

        {/* กล่องข้อความแสดงแทนเมื่อรูปพัง หรือใส่ค่ามั่วมา เช่น 'sssss' */}
        <div
          className={`w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100 text-xs p-2 text-center ${
            hasImage ? "hidden" : "flex"
          }`}
        >
          <span className="font-bold text-amber-600 mb-1">⚠️ รูปภาพไม่ถูกต้อง</span>
          <span className="truncate max-w-[150px] text-gray-400">
            {menu.imageUrl || "ไม่ได้ระบุ URL"}
          </span>
        </div>
      </div>

      {/* ส่วนข้อมูลชื่อและราคา (โชว์แน่นอน 100%) */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 break-words">
            {menu.name || "ไม่ระบุชื่อ"}
          </h3>
          <p className="text-emerald-600 font-semibold mt-1">
            ฿{Number(menu.price || 0).toLocaleString()}
          </p>
        </div>

        {/* ปุ่มลบ / แก้ไข */}
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