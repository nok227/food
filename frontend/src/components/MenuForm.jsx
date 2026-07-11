import { useEffect, useState } from "react";

function MenuForm({ onSubmit, editData, onCancel }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // ดึงข้อมูลมาใส่ฟอร์มเมื่อมีการกดปุ่ม "แก้ไข"
  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setPrice(editData.price);
      setImageUrl(editData.imageUrl || "");
    } else {
      resetForm();
    }
  }, [editData]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setImageUrl("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return alert("กรุณากรอกชื่อและราคาอาหาร");
    
    onSubmit({ name, price: Number(price), imageUrl });
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow mb-8 flex flex-wrap gap-3 items-center">
      <input
        className="border p-2 rounded flex-1 min-w-[200px]"
        placeholder="ชื่ออาหาร"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-2 rounded w-32"
        placeholder="ราคา"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        className="border p-2 rounded flex-1 min-w-[250px]"
        placeholder="รูปภาพ URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded font-medium hover:bg-blue-700 transition">
          {editData ? "บันทึกแก้ไข" : "เพิ่มเมนู"}
        </button>
        {editData && (
          <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition">
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}

export default MenuForm;