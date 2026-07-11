function MenuCard({ menu, onEdit, onDelete }) {
  // ภาพ Default กรณีไม่มีการใส่ URL หรือโหลดภาพไม่ได้
  const placeholderImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop";

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col justify-between p-4 border border-gray-100 hover:shadow-md transition">
      <div>
        <img
          src={menu.imageUrl || placeholderImage}
          alt={menu.name}
          className="w-full h-40 object-cover rounded-lg"
          onError={(e) => { e.target.src = placeholderImage; }}
        />
        <h2 className="text-xl font-bold mt-3 text-gray-800">{menu.name}</h2>
        <p className="text-gray-600 mt-1 font-semibold">ราคา {menu.price} บาท</p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onEdit(menu)}
          className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition"
        >
          แก้ไข
        </button>
        <button
          onClick={() => onDelete(menu.id)}
          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
        >
          ลบ
        </button>
      </div>
    </div>
  );
}

export default MenuCard;