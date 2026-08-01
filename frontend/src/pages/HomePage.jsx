import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { menuAPI } from "../services/menuApi";
import MenuForm from "../components/MenuForm";
import MenuCard from "../components/MenuCard";

// 🟢 กำหนด URL Backend ตรงๆ เป็นค่าสำรอง (Fallback) หากอ่าน .env ไม่เจอ
const BACKEND_URL = import.meta.env.VITE_SOCKET_URL || "https://food-backend-62tu.onrender.com";

// 🟢 เชื่อมต่อ Socket ไปยัง Render
const socket = io(BACKEND_URL, {
  transports: ["polling"], // ใช้ polling นำทางก่อนเพื่อความเสถียรบน Render
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  timeout: 20000,
});

function HomePage() {
  const [menus, setMenus] = useState([]);
  const [editingMenu, setEditingMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟢 State สำหรับเปิด-ปิด (ซ่อน/แสดง) ฟอร์มบันทึกข้อมูล
  const [showForm, setShowForm] = useState(false);

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
    } finally {
      setLoading(false);
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

  // เมื่อกดปุ่ม "แก้ไข" จากการ์ดเมนู
  const handleEditClick = (menu) => {
    setEditingMenu(menu);
    setShowForm(true); // เปิดฟอร์มทันทีเมื่อกดแก้ไข
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
    <div className="p-2 sm:p-4">
      {/* ส่วนหัว + ปุ่มกด + / ซ่อนฟอร์ม */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">จัดการรายการเมนูอาหาร</h1>
        </div>

        {/* ปุ่มเปิด-ปิดฟอร์ม */}
        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            if (showForm) setEditingMenu(null); // เมื่อซ่อนฟอร์ม ให้เคลียร์ข้อมูลค้างแก้ไข
          }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl font-medium transition shadow-sm cursor-pointer"
        >
          {showForm ? (
            <>
              <span className="text-lg">✕</span>
              <span>ซ่อนฟอร์ม</span>
            </>
          ) : (
            <>
              <span className="text-xl font-bold">+</span>
              <span>เพิ่มเมนูอาหาร</span>
            </>
          )}
        </button>
      </div>

      {/* 
        Layout Container:
        - จอใหญ่ (lg ขึ้นไป): flex-row -> ฟอร์มอยู่ซ้ายสุด, รายการบันทึกอยู่ขวา
        - จอเล็ก (sm/md): flex-col -> ฟอร์มอยู่บน, รายการบันทึกอยู่ล่าง
      */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* 🟢 ส่วนฟอร์มบันทึกข้อมูล (ฝั่งซ้ายสุด / ด้านบนบนจอเล็ก) */}
        {showForm && (
          <div className="w-full lg:w-96 shrink-0 transition-all duration-300">
            <MenuForm
              key={editingMenu ? editingMenu.id : "create"}
              onSubmit={handleFormSubmit}
              editData={editingMenu}
              onCancel={() => {
                setEditingMenu(null);
                setShowForm(false);
              }}
            />
          </div>
        )}

        {/* 🔵 ส่วนแสดงผลรายการอาหาร (ฝั่งขวา / ขยายเต็มอัตโนมัติเมื่อซ่อนฟอร์ม) */}
        <div className="flex-1 w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow p-4 border border-gray-100 animate-pulse"
                >
                  <div className="w-full h-40 bg-gray-200 rounded-lg" />
                  <div className="h-4 bg-gray-200 rounded mt-3 w-3/4" />
                  <div className="h-4 bg-gray-200 rounded mt-2 w-1/2" />
                </div>
              ))}
            </div>
          ) : menus.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center text-gray-500 border border-gray-200">
              ยังไม่มีเมนูอาหารในระบบ กดปุ่ม <span className="font-semibold text-amber-600">"+ เพิ่มเมนูอาหาร"</span> เพื่อเพิ่มรายการ
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {menus.map((menu, index) => (
                <MenuCard
                  key={menu?.id || index}
                  menu={menu}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteMenu}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default HomePage;