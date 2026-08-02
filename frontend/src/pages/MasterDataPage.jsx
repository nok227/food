// frontend/src/pages/MasterDataPage.jsx
import { useState, useEffect } from "react";
import { masterAPI } from "../services/masterApi";

function MasterDataPage() {
  const [activeTab, setActiveTab] = useState("category"); // 'category' | 'size' | 'unit'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [inputName, setInputName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ດຶງຂໍ້ມູນຕາມ Tab ທີ່ເລືອກ
  const fetchTabData = async () => {
    setLoading(true);
    try {
      let data = [];
      if (activeTab === "category") data = await masterAPI.getCategories();
      else if (activeTab === "size") data = await masterAPI.getSizes();
      else if (activeTab === "unit") data = await masterAPI.getUnits();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setShowForm(false);
    setInputName("");
    fetchTabData();
  }, [activeTab]);

  // ບັນທຶກຂໍ້ມູນໃໝ່
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    setSubmitting(true);
    try {
      if (activeTab === "category") await masterAPI.createCategory(inputName);
      else if (activeTab === "size") await masterAPI.createSize(inputName);
      else if (activeTab === "unit") await masterAPI.createUnit(inputName);

      setInputName("");
      setShowForm(false);
      fetchTabData(); // ໂຫລດລາຍການໃໝ່
    } catch (err) {
      alert("ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ");
    } finally {
      setSubmitting(false);
    }
  };

  // ລົບຂໍ້ມູນ
  const handleDelete = async (id) => {
    if (!confirm("ທ່ານຕ້ອງການລົບລາຍການນີ້ແມ່ນບໍ່?")) return;
    try {
      if (activeTab === "category") await masterAPI.deleteCategory(id);
      else if (activeTab === "size") await masterAPI.deleteSize(id);
      else if (activeTab === "unit") await masterAPI.deleteUnit(id);
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

      {/* 🟢 1. ແທັບດ້ານເທິງ (Tabs) */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("category")}
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

      {/* 🟢 2. ສ່ວນຫົວຂໍ້ + ປຸ່ມສະແດງຟອມບັນທຶກ */}
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

      {/* 🟢 3. ຟອມບັນທຶກ (ສະແດງເມື່ອກົດປຸ່ມບັນທຶກ) */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center"
        >
          <input
            type="text"
            required
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder={`ປ້ອນຊື່ ${getTabTitle()}...`}
            className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {submitting ? "ກໍາລັງບັນທຶກ..." : "ບັນທຶກ"}
          </button>
        </form>
      )}

      {/* 🟢 4. ຕາຕະລາງ / ລາຍການຂໍ້ມູນ */}
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
                <th className="px-6 py-3 text-right">ຈັດການ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4">{item.name}</td>
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