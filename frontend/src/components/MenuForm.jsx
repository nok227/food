import { useState, useEffect, useRef } from "react";

// ตรวจสอบว่าเป็น URL หรือ Base64 image
const isValidImageSource = (string) => {
  if (!string || typeof string !== "string") return false;
  return (
    string.startsWith("http://") ||
    string.startsWith("https://") ||
    string.startsWith("data:image/")
  );
};

function MenuForm({ onSubmit, editData, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    imageUrl: "",
  });

  const [imageMode, setImageMode] = useState("url"); // 'url' หรือ 'file'
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // เมื่อเลือก "แก้ไข" เมนู -> ดึงข้อมูลทั้งหมดของเมนือนั้นมาใส่ฟอร์ม
  useEffect(() => {
    if (editData) {
      const url = editData.imageUrl || "";
      setFormData({
        name: editData.name || "",
        price: editData.price ?? "",
        imageUrl: url,
      });

      if (url.startsWith("data:image/")) {
        setImageMode("file");
      } else {
        setImageMode("url");
      }
    } else {
      resetForm();
    }
  }, [editData]);

  const resetForm = () => {
    setFormData({ name: "", price: "", imageUrl: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // เลือกไฟล์รูปจากเครื่อง PC
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // เคลียร์/ยกเลิกรูปภาพในฟอร์มก่อนบันทึก
  const handleClearImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        resetForm();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const hasImagePreview = isValidImageSource(formData.imageUrl);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-5 mb-8 flex flex-col gap-4"
    >
      <h2 className="text-lg font-bold text-gray-800">
        {editData ? "แก้ไขเมนูอาหาร" : "เพิ่มเมนูใหม่"}
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

      {/* ส่วนเลือกรูปภาพ (สลับ วาง URL / เลือกจาก PC) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600">รูปภาพเมนู</label>

        <div className="flex gap-2 text-xs mb-1">
          <button
            type="button"
            onClick={() => setImageMode("url")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              imageMode === "url"
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            วาง URL รูปภาพ
          </button>
          <button
            type="button"
            onClick={() => setImageMode("file")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              imageMode === "file"
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            เลือกไฟล์จากเครื่อง (PC)
          </button>
        </div>

        {imageMode === "url" ? (
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        ) : (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
          />
        )}

        {/* แสดงตัวอย่างรูปภาพพรีวิว */}
        {formData.imageUrl && (
          <div className="mt-2 flex items-center gap-3">
            <div className="h-28 w-28 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
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
                ⚠️ ไม่พบรูปภาพ
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearImage}
              className="text-xs text-red-500 hover:underline"
            >
              ล้างรูปภาพออก
            </button>
          </div>
        )}
      </div>

      {/* ปุ่มบันทึกข้อมูลเมนู / ยกเลิก */}
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition disabled:opacity-50"
        >
          {submitting ? "กำลังบันทึก..." : editData ? "บันทึกการแก้ไขเมนู" : "เพิ่มเมนู"}
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