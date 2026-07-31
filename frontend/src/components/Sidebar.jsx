function Sidebar() {
  return (
    <aside className="hidden md:block w-56 bg-white border-r border-gray-200 p-5">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
        เมนู
      </h2>
      <ul className="flex flex-col gap-2 text-sm text-gray-600">
        <li className="px-3 py-2 rounded-lg bg-amber-50 text-amber-700 font-medium">
          รายการอาหารทั้งหมด
        </li>
        {/* เพิ่มลิงก์/ตัวกรองอื่นๆ ในอนาคตได้ที่นี่ */}
      </ul>
    </aside>
  );
}

export default Sidebar;