import { useState } from "react";

// 🟢 หน้าตัวอย่าง: ติดต่อเรา (ฟอร์มยังไม่ต่อ backend จริง แค่โชว์ UI)
function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <h2 className="text-2xl font-bold text-gray-800">ติดต่อเรา</h2>

      {sent ? (
        <div className="bg-green-50 text-green-700 border border-green-200 rounded-xl p-5 text-sm">
          ขอบคุณสำหรับข้อความ! ทีมงานจะติดต่อกลับโดยเร็วที่สุด
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">ชื่อ</label>
            <input
              required
              type="text"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">อีเมล</label>
            <input
              required
              type="email"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">ข้อความ</label>
            <textarea
              required
              rows={4}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <button
            type="submit"
            className="self-start px-5 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition"
          >
            ส่งข้อความ
          </button>
        </form>
      )}
    </div>
  );
}

export default ContactPage;