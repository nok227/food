// frontend/src/pages/MasterDataPage.jsx
import { useState, useEffect } from "react";
import { masterAPI } from "../services/masterApi";

function MasterDataPage() {
  const [activeTab, setActiveTab] = useState("category"); // 'category' | 'size' | 'unit'
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Filter & Form States
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputCategory, setInputCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 1. โหลดข้อมูล Category ทั้งหมดไว้เสมอ เพื่อเอาไปใส่ใน Dropdown
  const fetchAllCategories = async () => {
    try {
      const data = await masterAPI.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // 2. ดึงข้อมูลตาม Tab และตาม Filter Category ที่เลือก
  const fetchTabData = async () => {
    setLoading(true);
    try {
      let data = [];
      if (activeTab === "category") {
        data = await masterAPI.getCategories();
      } else if (activeTab === "size") {
        data = await masterAPI.getSizes(selectedFilterCategory);
      } else if (activeTab === "unit") {
        data = await masterAPI.getUnits(selectedFilterCategory);
      }
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  useEffect(() => {
    setShowForm(false);
    setInputName("");
    setInputCategory("");
    fetchTabData();
  }, [activeTab, selectedFilterCategory]);

  // 3. บันทึกข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    setSubmitting(true);
    try {
      if (activeTab === "category") {
        await masterAPI.createCategory(inputName);
        fetchAllCategories(); // อัปเดต Category List ใน Dropdown ด้วย
      } else if (activeTab === "size") {
        await masterAPI.createSize(inputName, inputCategory || null);
      } else if (activeTab === "unit") {
        await masterAPI.createUnit(inputName, inputCategory || null);
      }

      setInputName("");
      setInputCategory("");
      setShowForm(false);
      fetchTabData();
    } catch (err) {
      alert("ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ");
    } finally {
      setSubmitting(false);
    }
  };

  // 4. ลบข้อมูล
  const handleDelete = async (id) => {
    if (!confirm("ທ່ານຕ້ອງການລົບລາຍການນີ້ແມ່ນບໍ່?")) return;
    try {
      if (activeTab === "category") {
        await masterAPI.deleteCategory(id);
        fetchAllCategories();
      } else if (activeTab === "size") {
        await masterAPI.deleteSize(id);
      } else if (activeTab === "unit") {
        await masterAPI.deleteUnit(id);
      }
      fetchTabData();
    } catch (err) {
      alert("ບໍ່ສາມາດລົບຂໍ້ມູນໄດ້");
    }
  };

  const getTabTitle = () => {
    if (activeTab === "category") return "ປະເພດ";
    if (activeTab === "size") return "ຂະໜາດ";
    return "ໜ່ວຍ";
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">ຈັດການຂໍ້ມູນ</h2>

      {/* 🟢 1. แท็บเลือกระหว่าง Category / Size / Unit */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab("category");
            setSelectedFilterCategory("");
          }}
          className={`py-3 px-6 font-semibold text-sm transition border-b-2 ${
            activeTab === "category"
              ? "border-amber-500 text-amber-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          🏷️ ປະເພດ (Category)
        </button>
        <button
          onClick={() => setActiveTab("size")}
          className={`py-3 px-6 font-semibold text-sm transition border-b-2 ${
            activeTab === "size"
              ? "border-amber-500 text-amber-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          📐 ຂະໜາດ (Size)
        </button>
        <button
          onClick={() => setActiveTab("unit")}
          className={`py-3 px-6 font-semibold text-sm transition border-b-2 ${
            activeTab === "unit"
              ? "border-amber-500 text-amber-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          📦 ໜ່ວຍ (Unit)
        </button>
      </div>

      {/* 🟢 2. Filter เลือกประเภท (เฉพาะแท็บ Size และ Unit) */}
      {activeTab !== "category" && (
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center gap-3">
          <span className="text-sm font-semibold text-amber-800 whitespace-nowrap">
            🔍 ກັ່ນກອງຕາມປະເພດ:
          </span>
          <select
            value={selectedFilterCategory}
            onChange={(e) => setSelectedFilterCategory(e.target.value)}
            className="w-full sm:w-64 border border-amber-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">-- ສະແດງທັງໝົດ --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 🟢 3. ส่วนหัวข้อ + ปุ่มเปิดฟอร์ม */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-700">
          ລາຍການ {getTabTitle()}
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition"
        >
          {showForm ? "✕ ປິດຟອມ" : `+ ບັນທຶກ${getTabTitle()}`}
        </button>
      </div>

      {/* 🟢 4. ฟอร์มบันทึก (มี Dropdown เลือก Category สำหรับ Size และ Unit) */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* เลือก Category (แสดงเฉพาะเมื่อบันทึก Size หรือ Unit) */}
            {activeTab !== "category" && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">
                  ເລືອກປະເພດ (ກ່ຽວຂ້ອງ)
                </label>
                <select
                  value={inputCategory}
                  onChange={(e) => setInputCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">-- ບໍ່ມີຂະໜາດ/ໜ່ວຍ ຫຼື ທຸກປະເພດ --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ช่องกรอกชื่อ */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">
                ຊື່ {getTabTitle()}
              </label>
              <input
                type="text"
                required
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder={`ປ້ອນຊື່ ${getTabTitle()}...`}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="self-end px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {submitting ? "ກໍາລັງບັນທຶກ..." : `ບັນທຶກ${getTabTitle()}`}
          </button>
        </form>
      )}

      {/* 🟢 5. ตารางแสดงรายการข้อมูล */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">ກໍາລັງໂຫລດຂໍ້ມູນ...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">ບໍ່ມີຂໍ້ມູນ {getTabTitle()}</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">ຊື່ {getTabTitle()}</th>
                {activeTab !== "category" && <th className="px-6 py-3">ປະເພດ</th>}
                <th className="px-6 py-3 text-right">ຈັດການ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  {activeTab !== "category" && (
                    <td className="px-6 py-4">
                      {item.category ? (
                        <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium">
                          {item.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">ບໍ່ໄດ້ລະບຸ</span>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 font-medium transition"
                    >
                      ລົບ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MasterDataPage;