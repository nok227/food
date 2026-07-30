import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { menuAPI } from "./services/menuApi";
import MenuForm from "./components/MenuForm";
import MenuCard from "./components/MenuCard";

// 🟢 กำหนด URL Backend ตรงๆ เป็นค่าสำรอง (Fallback) หากอ่าน .env ไม่เจอ
const BACKEND_URL = import.meta.env.VITE_SOCKET_URL || "https://food-backend-62tu.onrender.com";

// 🟢 เชื่อมต่อ Socket ไปยัง Render
  const socket = io(BACKEND_URL, {
    transports: ["polling"], // ใช้ polling นำทางก่อนเพื่อความเสถียรบน Render
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    timeout: 20000
  });

function App() {
  const [menus, setMenus] = useState([]);
  const [editingMenu, setEditingMenu] = useState(null);

  // 🟢 ดึงข้อมูลเมนูทั้งหมด
  const loadMenus = useCallback(async () => {
    try {
      const data = await menuAPI.getAll();
      // กรองเอาเฉพาะข้อมูลที่มีอยู่จริง ไม่เป็น null หรือ undefined
      if (Array.isArray(data)) {
        setMenus(data.filter(Boolean));
      } else {
        setMenus([]);
      }
    } catch (error) {
      console.error("Failed to fetch menus:", error);
    }
  }, []);

  useEffect(() => {
    const initData = async () => {
      await loadMenus();
    };
    initData();

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
      socket.off("connect");
      socket.off("menuUpdated");
      socket.off("connect_error");
    };
  }, [loadMenus]);

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
          key={editingMenu ? editingMenu.id : "create"}
          onSubmit={handleFormSubmit}
          editData={editingMenu}
          onCancel={() => setEditingMenu(null)}
        />

        {/* ส่วนแสดงผลรายการอาหาร */}
        {menus.length === 0 ? (
          <p className="text-center text-gray-500 py-10">ยังไม่มีเมนูอาหารในระบบ</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {menus.map((menu, index) => (
              <MenuCard
                key={menu?.id || index}
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