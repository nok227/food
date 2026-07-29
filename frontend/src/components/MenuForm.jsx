// src/components/MenuForm.jsx
import { useState, useEffect } from "react";

// ตรวจสอบอย่างเข้มงวดว่าต้องเป็น URL จริงที่ขึ้นต้นด้วย http:// หรือ https:// เท่านั้น
// (ใช้ guard เดียวกับ MenuCard.jsx เพื่อป้องกันไม่ให้ browser ยิง request ไปยัง path ที่ไม่ใช่ URL จริง)
const isValidHttpUrl = (string) => {
  if (!string || typeof string !== "string") return false;
  return string.startsWith("http://") || string.startsWith("https://");
};

function MenuForm({ onSubmit, editData, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    imageUrl: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // เติมข้อมูลลงฟอร์มอัตโนมัติเมื่อกดแก้ไขเมนู
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        price: editData.price ?? "",
        imageUrl: editData.imageUrl || "",
      });
    } else {
      setFormData({ name: "", price: "", imageUrl: "" });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        name: formData.name.trim(),
        price: Number(formData.price) || 0,
        imageUrl: formData.imageUrl.trim() || null,
      });
      if (!editData) {
        setFormData({ name: "", price: "", imageUrl: "" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const hasImagePreview = isValidHttpUrl(formData.imageUrl);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-5 mb-8 flex flex-col gap-4"
    >
      <h2 className="text-lg font-bold text-gray-800">
        {editData ? "แก้ไขเมนู" : "เพิ่มเมนูใหม่"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ชื่อเมนู */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">ชื่อเมนู</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="เช่น ผัดไทยกุ้งสด"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* ราคา */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">ราคา (บาท)</label>
          <input
            type="number"
            name="price"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="0"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* URL รูปภาพ */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">URL รูปภาพ</label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        {/* พรีวิวรูปภาพ: render เฉพาะเมื่อเป็น URL http/https จริงเท่านั้น
            ป้องกันไม่ให้ browser ยิง request ไปยัง path ที่พิมพ์ยังไม่เสร็จ เช่น "sssss" */}
        {formData.imageUrl && (
          <div className="mt-2 h-32 w-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
            {hasImagePreview ? (
              <img
                src={formData.imageUrl}
                alt="พรีวิว"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.style.display = "flex";
                  }
                }}
              />
            ) : null}
            <div
              className={`w-full h-full flex-col items-center justify-center text-gray-400 text-xs p-2 text-center ${
                hasImagePreview ? "hidden" : "flex"
              }`}
            >
              ⚠️ URL ไม่ถูกต้อง
            </div>
          </div>
        )}
      </div>

      {/* ปุ่มควบคุม */}
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition disabled:opacity-50"
        >
          {submitting ? "กำลังบันทึก..." : editData ? "บันทึกการแก้ไข" : "เพิ่มเมนู"}
        </button>
        {editData && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}

export default MenuForm;