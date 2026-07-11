// frontend/src/services/menuAPI.js

// URL ของ Node.js Backend ที่เราเปิดรันไว้ที่พอร์ต 3000
const API = import.meta.env.VITE_API_URL + "/menus";
console.log("API =", API);

export const menuAPI = {
  // 1. ดึงข้อมูลเมนูทั้งหมด (GET /menus)
  getAll: async () => {
    const res = await fetch(API);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "ไม่สามารถดึงข้อมูลเมนูได้");
    }
    return await res.json();
  },

  // 2. เพิ่มเมนูใหม่ (POST /menus)
  create: async (menuData) => {
    const res = await fetch(API, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(menuData),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      // ดึงข้อความ Error ที่เราทำไว้จากระบบ Validator ฝั่งหลังบ้านมาแสดง
      throw new Error(errorData.error || "ไม่สามารถเพิ่มเมนูได้");
    }
    return await res.json();
  },

  // 3. อัปเดตข้อมูลเมนู (PUT /menus/:id)
  update: async (id, menuData) => {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(menuData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "ไม่สามารถแก้ไขเมนูได้");
    }
    return await res.json();
  },

  // 4. ลบเมนู (DELETE /menus/:id)
  delete: async (id) => {
    const res = await fetch(`${API}/${id}`, { 
      method: "DELETE" 
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "ไม่สามารถลบเมนูได้");
    }
    return await res.json();
  },
};