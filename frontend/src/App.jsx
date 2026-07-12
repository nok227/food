import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { menuAPI } from "./services/menuApi";
import MenuForm from "./components/MenuForm";
import MenuCard from "./components/MenuCard";

// 🟢 อ่านค่าจาก .env แทนการ hardcode
// ตอน dev: ตั้ง VITE_API_URL=http://localhost:3000 ใน .env.local
// ตอน production (Vercel): ตั้ง VITE_API_URL=https://food-backend-62tu.onrender.com
const API_URL = `${import.meta.env.VITE_API_URL}/menus`;

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket", "polling"] // ✨ สำคัญมาก: ใส่ polling เผื่อไว้ด้วย เพราะ Render บางครั้งจะบล็อก websocket ตรงๆ
});

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

  // การโหลดข้อมูนเมนูและจัดการ Event Listener สำหรับ Socket.IO
  useEffect(() => {
    // โหลดข้อมูลครั้งแรก
    loadMenus();

    // ฟังเหตุการณ์เมื่อเชื่อมต่อสำเร็จ
    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    // ฟังเหตุการณ์เมื่อข้อมูลเมนูมีการอัปเดตแบบ Realtime
    socket.on("menuUpdated", () => {
      console.log("🔄 Menu updated realtime");
      loadMenus();
    });

    // ฟังเหตุการณ์ข้อผิดพลาดของการเชื่อมต่อ
    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    // 🟢 ล้างและปิดเฉพาะตัวดักจับ (Event Listeners) เมื่อ Component ถูกทำลาย
    return () => {
      socket.off("connect");
      socket.off("menuUpdated");
      socket.off("connect_error");
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