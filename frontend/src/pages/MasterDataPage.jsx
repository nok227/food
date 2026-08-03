// frontend/src/pages/MasterDataPage.jsx
import { useState, useEffect } from "react";
import { masterAPI } from "../services/masterApi";
import { stockAPI } from "../services/stockApi";

function MasterDataPage() {
  const [activeTab, setActiveTab] = useState("material");
  const [items, setItems] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Master Lists สำหรับ Dropdown
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableUnits, setAvailableUnits] = useState([]);

  // Form Inputs
  const [inputName, setInputName] = useState("");
  const [imageMode, setImageMode] = useState("url");
  const [inputImageUrl, setInputImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [initialQuantity, setInitialQuantity] = useState("0");

  // Form Inputs สำหรับ Tab Import
  const [importStockId, setImportStockId] = useState("");
  const [importQuantity, setImportQuantity] = useState("");
  const [importNote, setImportNote] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const loadMaterials = async () => {
    const data = await masterAPI.getMaterials();
    setMaterials(Array.isArray(data) ? data : []);
  };

  const loadStocksList = async () => {
    try {
      const data = await stockAPI.getStocks();
      setStockList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedMaterial) {
      masterAPI.getCategories(selectedMaterial).then((data) => {
        setCategories(Array.isArray(data) ? data : []);
      });
    } else {
      setCategories([]);
      setSelectedCategory("");
    }
  }, [selectedMaterial]);

  useEffect(() => {
    if (selectedCategory) {
      masterAPI.getSizes(selectedCategory).then((data) => {
        setAvailableSizes(Array.isArray(data) ? data : []);
      });
    } else {
      setAvailableSizes([]);
      setSelectedSize("");
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      masterAPI.getUnits(selectedCategory, selectedSize).then((data) => {
        setAvailableUnits(Array.isArray(data) ? data : []);
      });
    } else {
      setAvailableUnits([]);
      setSelectedUnit("");
    }
  }, [selectedCategory, selectedSize]);

  const fetchTabData = async () => {
    setLoading(true);
    try {
      let data = [];
      if (activeTab === "material") data = await masterAPI.getMaterials();
      else if (activeTab === "category") data = await masterAPI.getCategories();
      else if (activeTab === "size") data = await masterAPI.getSizes();
      else if (activeTab === "unit") data = await masterAPI.getUnits();
      else if (activeTab === "stock") data = await stockAPI.getStocks();
      else if (activeTab === "import") {
        data = await stockAPI.getStocks();
        loadStocksList();
      }
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  useEffect(() => {
    setShowForm(false);
    resetForm();
    fetchTabData();
  }, [activeTab]);

  const resetForm = () => {
    setInputName("");
    setInputImageUrl("");
    setImageFile(null);
    setImageMode("url");
    setSelectedMaterial("");
    setSelectedCategory("");
    setSelectedSize("");
    setSelectedUnit("");
    setInitialQuantity("0");
    setImportStockId("");
    setImportQuantity("");
    setImportNote("");
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === "stock") {
      if (!selectedMaterial || !selectedCategory || !selectedUnit) {
        alert("ກະລຸນາເລືອກ ວັດຖຸດິບ, ປະເພດ, ແລະ ໜ່ວຍ ໃຫ້ຄົບຖ້ວນ");
        return;
      }
    }

    if (activeTab === "import") {
      if (!importStockId || !importQuantity || parseFloat(importQuantity) <= 0) {
        alert("ກະລຸນາເລືອກລາຍການສະຕັອກ ແລະ ປ້ອນຈຳນວນນຳເຂົ້າໃຫ້ຖືກຕ້ອງ");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (activeTab === "material") {
        let finalImageUrl = inputImageUrl;
        if (imageMode === "file" && imageFile) {
          finalImageUrl = await convertBase64(imageFile);
        }
        await masterAPI.createMaterial(inputName, finalImageUrl);
        loadMaterials();
      } else if (activeTab === "category") {
        await masterAPI.createCategory(inputName, selectedMaterial);
      } else if (activeTab === "size") {
        await masterAPI.createSize(inputName, selectedCategory);
      } else if (activeTab === "unit") {
        await masterAPI.createUnit(inputName, selectedCategory, selectedSize);
      } else if (activeTab === "stock") {
        await stockAPI.createStock({
          materialId: selectedMaterial,
          categoryId: selectedCategory,
          sizeId: selectedSize || null,
          unitId: selectedUnit,
          initialQuantity: parseFloat(initialQuantity) || 0,
        });
      } else if (activeTab === "import") {
        await stockAPI.importStock(
          importStockId,
          parseFloat(importQuantity),
          importNote
        );
      }

      resetForm();
      setShowForm(false);
      fetchTabData();
    } catch (err) {
      console.error("Save Error:", err);
      alert(err.message || "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("ທ່ານຕ້ອງການລົບລາຍການນີ້ແມ່ນບໍ່?")) return;
    try {
      if (activeTab === "material") {
        await masterAPI.deleteMaterial(id);
        loadMaterials();
      } else if (activeTab === "category") await masterAPI.deleteCategory(id);
      else if (activeTab === "size") await masterAPI.deleteSize(id);
      else if (activeTab === "unit") await masterAPI.deleteUnit(id);
      else if (activeTab === "stock" || activeTab === "import") await stockAPI.deleteStock(id);
      fetchTabData();
    } catch (err) {
      alert("ບໍ່ສາມາດລົບຂໍ້ມູນໄດ້");
    }
  };

  const getTabTitle = () => {
    if (activeTab === "material") return "ຊື່ວັດຖຸດິບ";
    if (activeTab === "category") return "ປະເພດ";
    if (activeTab === "size") return "ຂະໜາດ";
    if (activeTab === "unit") return "ໜ່ວຍ";
    if (activeTab === "stock") return "ສະຕັອກ (Stock)";
    return "ນຳເຂົ້າວັດຖຸດິບ";
  };

  // 🟢 ฟังก์ชันสำหรับ render รูปภาพ
  const renderImage = (imageUrl, name) => {
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={name}
          className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg border border-gray-200"
        />
      );
    }
    return <span className="text-gray-400 text-[10px] sm:text-xs">ບໍ່ມີຮູບ</span>;
  };

  // 🟢 ฟังก์ชัน render Mobile Card View
  const renderMobileCard = (item) => {
    if (activeTab === "stock" || activeTab === "import") {
      return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-3 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-400">#{item.id}</span>
                <span className="font-semibold text-gray-800">{item.materialName}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <span className="text-gray-500">ປະເພດ:</span>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-center">
                  {item.categoryName}
                </span>
                <span className="text-gray-500">ຂະໜາດ:</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-center">
                  {item.sizeName}
                </span>
                <span className="text-gray-500">ໜ່ວຍ:</span>
                <span className="text-purple-700 font-medium">{item.unitName}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 mt-3 text-xs">
                <div className="bg-amber-50 p-2 rounded-lg text-center">
                  <div className="text-amber-600 font-bold">{item.oldQuantity ?? 0}</div>
                  <div className="text-[10px] text-gray-400">ເກົ່າ</div>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg text-center">
                  <div className="text-blue-600 font-bold">+{item.todayQuantity ?? 0}</div>
                  <div className="text-[10px] text-gray-400">ມື້ນີ້</div>
                </div>
                <div className="bg-emerald-50 p-2 rounded-lg text-center">
                  <div className="text-emerald-600 font-bold">{item.totalQuantity ?? 0}</div>
                  <div className="text-[10px] text-gray-400">ທັງໝົດ</div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(item.id)} 
              className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
            >
              ລົບ
            </button>
          </div>
        </div>
      );
    }

    // Master Data Mobile Card
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-3 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {activeTab === "material" && (
              <div className="flex-shrink-0">
                {renderImage(item.imageUrl, item.name)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">#{item.id}</span>
                <span className="font-semibold text-gray-800">{item.name}</span>
              </div>
              {activeTab === "category" && item.material && (
                <span className="text-xs text-purple-600">{item.material.name}</span>
              )}
              {activeTab === "size" && item.category && (
                <span className="text-xs text-amber-600">{item.category.name}</span>
              )}
              {activeTab === "unit" && (
                <div className="flex gap-2 text-xs">
                  {item.category && <span className="text-amber-600">{item.category.name}</span>}
                  {item.size && <span className="text-blue-600">{item.size.name}</span>}
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={() => handleDelete(item.id)} 
            className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
          >
            ລົບ
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 max-w-6xl mx-auto px-2 sm:px-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">ຈັດການຂໍ້ມູນ Master Data & Stock</h2>

      {/* 🟢 1. Tabs Bar - ปรับให้เลื่อนแนวนอนได้ */}
      <div className="flex border-b border-gray-200 overflow-x-auto pb-1 gap-0.5 sm:gap-0">
        {[
          { key: "material", label: "🥩 1. ວັດຖຸດິບ", color: "amber" },
          { key: "category", label: "🏷️ 2. ປະເພດ", color: "amber" },
          { key: "size", label: "📐 3. ຂະໜາດ", color: "amber" },
          { key: "unit", label: "📦 4. ໜ່ວຍ", color: "amber" },
          { key: "stock", label: "📊 5. ສະຕັອກ", color: "emerald" },
          { key: "import", label: "📥 6. ນຳເຂົ້າ", color: "blue" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-2 px-2.5 sm:px-4 md:px-5 font-semibold text-[11px] sm:text-xs md:text-sm whitespace-nowrap border-b-2 transition flex-shrink-0 ${
              activeTab === tab.key 
                ? tab.color === "emerald" 
                  ? "border-emerald-500 text-emerald-600" 
                  : tab.color === "blue"
                  ? "border-blue-600 text-blue-600"
                  : "border-amber-500 text-amber-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🟢 2. Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-700 truncate">
          {activeTab === "import" ? "ລາຍການສະຕັອກ & ຟອມນຳເຂົ້າ" : `ລາຍການ ${getTabTitle()}`}
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`w-full sm:w-auto px-4 py-2 text-white rounded-lg text-sm font-semibold transition ${
            activeTab === "import" ? "bg-blue-600 hover:bg-blue-700" : "bg-amber-500 hover:bg-amber-600"
          }`}
        >
          {showForm ? "✕ ປິດຟອມ" : `+ ${activeTab === "import" ? "ນຳເຂົ້າ" : `ບັນທຶກ${getTabTitle()}`}`}
        </button>
      </div>

      {/* 🟢 3. Dynamic Form - ปรับ responsive */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-3 sm:p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
          {activeTab === "import" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">ເລືອກສະຕັອກ</label>
                <select
                  required
                  value={importStockId}
                  onChange={(e) => setImportStockId(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">-- ເລືອກ --</option>
                  {stockList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.materialName} - {s.categoryName} ({s.sizeName !== "-" ? s.sizeName : ""} {s.unitName})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">ຈຳນວນ</label>
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  required
                  placeholder="0.00"
                  value={importQuantity}
                  onChange={(e) => setImportQuantity(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">ໝາຍເຫດ</label>
                <input
                  type="text"
                  placeholder="ເຊັ່ນ: ຊື້ເພີ່ມ..."
                  value={importNote}
                  onChange={(e) => setImportNote(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(activeTab === "category" || activeTab === "size" || activeTab === "unit" || activeTab === "stock") && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">1. ວັດຖຸດິບ</label>
                  <select
                    required
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="">-- ເລືອກ --</option>
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {(activeTab === "size" || activeTab === "unit" || activeTab === "stock") && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">2. ປະເພດ</label>
                  <select
                    required
                    disabled={!selectedMaterial}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100"
                  >
                    <option value="">{!selectedMaterial ? "-- ເລືອກວັດຖຸດິບກ່ອນ --" : "-- ເລືອກ --"}</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {(activeTab === "unit" || activeTab === "stock") && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">3. ຂະໜາດ</label>
                  <select
                    required={activeTab === "unit"}
                    disabled={!selectedCategory}
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100"
                  >
                    <option value="">{!selectedCategory ? "-- ເລືອກປະເພດກ່ອນ --" : "-- ເລືອກ --"}</option>
                    {availableSizes.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === "stock" && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">4. ໜ່ວຍ</label>
                    <select
                      required
                      disabled={!selectedCategory}
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100"
                    >
                      <option value="">{!selectedCategory ? "-- ເລືອກປະເພດກ່ອນ --" : "-- ເລືອກ --"}</option>
                      {availableUnits.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">5. ຈຳນວນເລີ່ມຕົ້ນ</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={initialQuantity}
                      onChange={(e) => setInitialQuantity(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </>
              )}

              {activeTab !== "stock" && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">
                    {activeTab === "material" && "ຊື່ວັດຖຸດິບ"}
                    {activeTab === "category" && "ຊື່ປະເພດ"}
                    {activeTab === "size" && "ຊື່ຂະໜາດ"}
                    {activeTab === "unit" && "ຊື່ໜ່ວຍ"}
                  </label>
                  <input
                    type="text"
                    required
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder={`ປ້ອນຊື່...`}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              )}

              {activeTab === "material" && (
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-gray-600">ຮູບພາບ</label>
                    <div className="flex gap-1 text-xs bg-gray-100 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setImageMode("url")}
                        className={`px-2 py-0.5 rounded-md font-medium transition ${
                          imageMode === "url" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500"
                        }`}
                      >
                        🔗 URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode("file")}
                        className={`px-2 py-0.5 rounded-md font-medium transition ${
                          imageMode === "file" ? "bg-white text-amber-600 shadow-sm" : "text-gray-500"
                        }`}
                      >
                        📁 ໄຟລ໌
                      </button>
                    </div>
                  </div>
                  {imageMode === "url" ? (
                    <input
                      type="url"
                      value={inputImageUrl}
                      onChange={(e) => setInputImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400"
                    />
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-sm file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                    />
                  )}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full sm:w-auto px-6 py-2 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50 ${
              activeTab === "import" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {submitting ? "ກໍາລັງບັນທຶກ..." : activeTab === "import" ? "ບັນທຶກການນຳເຂົ້າ" : `ບັນທຶກ${getTabTitle()}`}
          </button>
        </form>
      )}

      {/* 🟢 4. Table Display - Responsive Desktop + Mobile Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-400 text-sm">ກໍາລັງໂຫລດຂໍ້ມູນ...</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">ບໍ່ມີຂໍ້ມູນ {getTabTitle()}</div>
        ) : (
          <>
            {/* 🟢 Desktop Table - ซ่อนบนจอเล็ก */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="px-3 py-2.5">ID</th>
                    {activeTab === "material" && <th className="px-3 py-2.5">ຮູບພາບ</th>}
                    {(activeTab === "stock" || activeTab === "import") ? (
                      <>
                        <th className="px-3 py-2.5">ວັດຖຸດິບ</th>
                        <th className="px-3 py-2.5">ປະເພດ</th>
                        <th className="px-3 py-2.5">ຂະໜາດ</th>
                        <th className="px-3 py-2.5">ໜ່ວຍ</th>
                        <th className="px-3 py-2.5 text-amber-700 bg-amber-50">ເກົ່າ</th>
                        <th className="px-3 py-2.5 text-blue-700 bg-blue-50">ມື້ນີ້</th>
                        <th className="px-3 py-2.5 text-emerald-700 bg-emerald-50">ທັງໝົດ</th>
                      </>
                    ) : (
                      <th className="px-3 py-2.5">ຊື່</th>
                    )}
                    {activeTab === "category" && <th className="px-3 py-2.5">ວັດຖຸດິບ</th>}
                    {activeTab === "size" && <th className="px-3 py-2.5">ປະເພດ</th>}
                    {activeTab === "unit" && (
                      <>
                        <th className="px-3 py-2.5">ປະເພດ</th>
                        <th className="px-3 py-2.5">ຂະໜາດ</th>
                      </>
                    )}
                    <th className="px-3 py-2.5 text-right">ຈັດການ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-3 py-2.5 font-medium text-gray-900">{item.id}</td>
                      {activeTab === "material" && (
                        <td className="px-3 py-2.5">{renderImage(item.imageUrl, item.name)}</td>
                      )}
                      {(activeTab === "stock" || activeTab === "import") ? (
                        <>
                          <td className="px-3 py-2.5 font-semibold text-gray-800">{item.materialName}</td>
                          <td className="px-3 py-2.5">
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                              {item.categoryName}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                              {item.sizeName}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-medium text-purple-700">{item.unitName}</td>
                          <td className="px-3 py-2.5 font-bold text-amber-600 bg-amber-50/50">{item.oldQuantity ?? 0}</td>
                          <td className="px-3 py-2.5 font-bold text-blue-600 bg-blue-50/50">+{item.todayQuantity ?? 0}</td>
                          <td className="px-3 py-2.5 font-bold text-emerald-600 bg-emerald-50/50">{item.totalQuantity ?? 0}</td>
                        </>
                      ) : (
                        <td className="px-3 py-2.5 font-semibold text-gray-800">{item.name}</td>
                      )}
                      {activeTab === "category" && (
                        <td className="px-3 py-2.5">
                          {item.material ? <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">{item.material.name}</span> : "-"}
                        </td>
                      )}
                      {activeTab === "size" && (
                        <td className="px-3 py-2.5">
                          {item.category ? <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">{item.category.name}</span> : "-"}
                        </td>
                      )}
                      {activeTab === "unit" && (
                        <>
                          <td className="px-3 py-2.5">
                            {item.category ? <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">{item.category.name}</span> : "-"}
                          </td>
                          <td className="px-3 py-2.5">
                            {item.size ? <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{item.size.name}</span> : "-"}
                          </td>
                        </>
                      )}
                      <td className="px-3 py-2.5 text-right">
                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 font-medium transition text-sm">
                           ລົບ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 🟢 Mobile Card View - แสดงบนจอเล็ก */}
            <div className="md:hidden p-3">
              {items.map((item) => renderMobileCard(item))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MasterDataPage;