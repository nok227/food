// 🟢 หน้าตัวอย่าง: เกี่ยวกับเรา
function AboutPage() {
  const features = [
    { title: "รวดเร็ว", desc: "อัปเดตเมนูแบบเรียลไทม์ ไม่ต้องรีเฟรชหน้า" },
    { title: "ใช้งานง่าย", desc: "ฟอร์มเพิ่ม/แก้ไขเมนูออกแบบมาให้ใช้งานง่าย" },
    { title: "รองรับทุกอุปกรณ์", desc: "ใช้งานได้ทั้งบนมือถือ แท็บเล็ต และคอมพิวเตอร์" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">เกี่ยวกับเรา</h2>
        <p className="text-gray-600 leading-relaxed">
          Food Ordering Menu คือระบบจัดการเมนูอาหารสำหรับร้านค้าขนาดเล็กถึงกลาง
          ช่วยให้เจ้าของร้านเพิ่ม แก้ไข และลบเมนูได้แบบเรียลไทม์
          พร้อมอัปเดตให้ลูกค้าเห็นทันทีผ่านการเชื่อมต่อ Socket.IO
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {features.map((item) => (
          <div key={item.title} className="bg-white rounded-xl border border-gray-100 shadow p-5">
            <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutPage;