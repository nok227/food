import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { menuAPI } from "./services/menuApi";
import MenuForm from "./components/MenuForm";
import MenuCard from "./components/MenuCard";

let socket;

function App() {
  const [menus, setMenus] = useState([]);
  const [editingMenu, setEditingMenu] = useState(null);

  // โหลดข้อมูลเมนู
  const loadMenus = async () => {
    try {
      const data = await menuAPI.getAll();
      setMenus(data);
    } catch (error) {
      console.error("Failed to fetch menus:", error);
      alert(`❌ ไม่สามารถดึงข้อมูลเมนูได้: ${error.message}`);
    }
  };

  // การโหลดข้อมูนเมนูและตั้งค่า Socket.IO สำหรับการแจ้งเตือนแบบ realtime
useEffect(() => {

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    transports: ["websocket"]
  });

  loadMenus();

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id);
  });

  socket.on("menuUpdated", () => {
    console.log("🔄 Menu updated realtime");
    loadMenus();
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error.message);
  });


  return () => {
    if (socket) {
      socket.disconnect();
    }
  };

}, []);

  // จัดการเมื่อส่งข้อมูลจากฟอร์ม (ทั้งเพิ่มและแก้ไข)
  const handleFormSubmit = async (formData) => {
    try {
      if (editingMenu) {
        await menuAPI.update(editingMenu.id, formData);
        setEditingMenu(null);
      } else {
        await menuAPI.create(formData);
      }
      loadMenus();
    } catch (error) {
      console.error("Failed to save menu:", error);
      // ➕ เสริมตรงนี้: แสดงแจ้งเตือนเมื่อเจอข้อมูลผิดเงื่อนไขจาก Validator หลังบ้าน
      alert(`❌ บันทึกไม่สำเร็จ: ${error.message}`);
    }
  };

  // ลบข้อมูลเมนู
  const handleDeleteMenu = async (id) => {
    if (window.confirm("คุณต้องการลบเมนูนี้ใช่หรือไม่?")) {
      try {
        await menuAPI.delete(id);
        loadMenus();
        if (editingMenu?.id === id) setEditingMenu(null);
      } catch (error) {
        console.error("Failed to delete menu:", error);
        // ➕ เสริมตรงนี้: แสดงแจ้งเตือนกรณีลบไม่สำเร็จ
        alert(`❌ ลบไม่สำเร็จ: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Food Ordering Menu
        </h1>

        {/* ส่วนฟอร์มเพิ่ม/แก้ไข */}
        <MenuForm
          onSubmit={handleFormSubmit}
          editData={editingMenu}
          onCancel={() => setEditingMenu(null)}
        />

        {/* ส่วนแสดงผลรายการอาหาร */}
        {menus.length === 0 ? (
          <p className="text-center text-gray-500 py-10">ยังไม่มีเมนูอาหารในระบบ</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onEdit={setEditingMenu}
                onDelete={handleDeleteMenu}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;