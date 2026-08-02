// frontend/src/pages/MasterDataPage.jsx
import { useState, useEffect } from "react";
import { masterAPI } from "../services/masterApi";
import { stockAPI } from "../services/stockApi"; // 🟢 นำเข้า stockAPI เพื่อสร้าง/ดึงข้อมูลสต็อก

function MasterDataPage() {
    const [activeTab, setActiveTab] = useState("material"); // 'material' | 'category' | 'size' | 'unit' | 'stock'
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Master Lists สำหรับ Dropdown ในฟอร์ม
    const [materials, setMaterials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [availableUnits, setAvailableUnits] = useState([]); // 🟢 เพิ่ม state หน่วย สำหรับ Tab Stock

    // Form Inputs
    const [inputName, setInputName] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedUnit, setSelectedUnit] = useState(""); // 🟢 เพิ่มสำหรับ Stock
    const [initialQuantity, setInitialQuantity] = useState("0"); // 🟢 จำนวนเริ่มต้นของ Stock
    const [submitting, setSubmitting] = useState(false);

    // 1. โหลดข้อมูลวัตถุดิบทั้งหมด
    const loadMaterials = async () => {
        const data = await masterAPI.getMaterials();
        setMaterials(Array.isArray(data) ? data : []);
    };

    // 2. เมื่อเลือก Material ในฟอร์ม -> โหลด Category ของ Material นั้น
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

    // 3. เมื่อเลือก Category ในฟอร์ม -> โหลด Size ของ Category นั้น
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

    // 🟢 3.5 เมื่อเลือก Size (หรือ Category) -> โหลด Unit
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

    // 4. โหลดข้อมูลของ Tab ที่เปิดอยู่
    const fetchTabData = async () => {
        setLoading(true);
        try {
            let data = [];
            if (activeTab === "material") data = await masterAPI.getMaterials();
            else if (activeTab === "category") data = await masterAPI.getCategories();
            else if (activeTab === "size") data = await masterAPI.getSizes();
            else if (activeTab === "unit") data = await masterAPI.getUnits();
            else if (activeTab === "stock") data = await stockAPI.getStocks(); // 🟢 ดึงข้อมูล Stock
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
        setSelectedMaterial("");
        setSelectedCategory("");
        setSelectedSize("");
        setSelectedUnit("");
        setInitialQuantity("0");
    };

    // 5. Submit บันทึกข้อมูล
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (activeTab !== "stock" && !inputName.trim()) return;

        setSubmitting(true);
        try {
            if (activeTab === "material") {
                await masterAPI.createMaterial(inputName);
                loadMaterials();
            } else if (activeTab === "category") {
                await masterAPI.createCategory(inputName, selectedMaterial);
            } else if (activeTab === "size") {
                await masterAPI.createSize(inputName, selectedCategory);
            } else if (activeTab === "unit") {
                await masterAPI.createUnit(inputName, selectedCategory, selectedSize);
            } else if (activeTab === "stock") {
                // 🟢 สร้างรายการ Stock
                await stockAPI.createStock({
                    materialId: selectedMaterial,
                    categoryId: selectedCategory,
                    sizeId: selectedSize,
                    unitId: selectedUnit,
                    initialQuantity: parseFloat(initialQuantity) || 0,
                });
            }

            resetForm();
            setShowForm(false);
            fetchTabData();
        } catch (err) {
            alert("ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ");
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
            else if (activeTab === "stock") await stockAPI.deleteStock(id); // 🟢 เพิ่มลบ Stock
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
        return "ສະຕັອກ (Stock)";
    };

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800">ຈັດການຂໍ້ມູນ Master Data</h2>

            {/* 🟢 1. Tabs Bar */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab("material")}
                    className={`py-3 px-6 font-semibold text-sm whitespace-nowrap border-b-2 transition ${activeTab === "material" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    🥩 1. ຊື່ວັດຖຸດິບ (Material)
                </button>
                <button
                    onClick={() => setActiveTab("category")}
                    className={`py-3 px-6 font-semibold text-sm whitespace-nowrap border-b-2 transition ${activeTab === "category" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    🏷️ 2. ປະເພດ (Category)
                </button>
                <button
                    onClick={() => setActiveTab("size")}
                    className={`py-3 px-6 font-semibold text-sm whitespace-nowrap border-b-2 transition ${activeTab === "size" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    📐 3. ຂະໜາດ (Size)
                </button>
                <button
                    onClick={() => setActiveTab("unit")}
                    className={`py-3 px-6 font-semibold text-sm whitespace-nowrap border-b-2 transition ${activeTab === "unit" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    📦 4. ໜ່ວຍ (Unit)
                </button>

                {/* 🟢 เพื่ม Tab Stock */}
                <button
                    onClick={() => setActiveTab("stock")}
                    className={`py-3 px-6 font-semibold text-sm whitespace-nowrap border-b-2 transition ${activeTab === "stock" ? "border-emerald-500 text-emerald-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    📊 5. ສະຕັອກ (Stock)
                </button>
            </div>

            {/* 🟢 2. Action Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-700">ລາຍການ {getTabTitle()}</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition"
                >
                    {showForm ? "✕ ປິດຟອມ" : `+ ບັນທຶກ${getTabTitle()}`}
                </button>
            </div>

            {/* 🟢 3. Dynamic Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                        {/* Step 1: เลือก Material (แสดงตอนอยู่ Category, Size, Unit, Stock) */}
                        {(activeTab === "category" || activeTab === "size" || activeTab === "unit" || activeTab === "stock") && (
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-600">1. ເລືອກວັດຖຸດິບ</label>
                                <select
                                    required
                                    value={selectedMaterial}
                                    onChange={(e) => setSelectedMaterial(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400"
                                >
                                    <option value="">-- ເລືອກວັດຖຸດິບ --</option>
                                    {materials.map((m) => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Step 2: เลือก Category (แสดงตอน Size, Unit, Stock) */}
                        {(activeTab === "size" || activeTab === "unit" || activeTab === "stock") && (
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-600">2. ເລືອກປະເພດ</label>
                                <select
                                    required
                                    disabled={!selectedMaterial}
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100"
                                >
                                    <option value="">{!selectedMaterial ? "-- ເລືອກວັດຖຸດິບກ່ອນ --" : "-- ເລືອກປະເພດ --"}</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Step 3: เลือก Size (แสดงตอน Unit, Stock) */}
                        {(activeTab === "unit" || activeTab === "stock") && (
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-600">3. ເລືອກຂະໜາດ</label>
                                <select
                                    required={activeTab === "unit"}
                                    disabled={!selectedCategory}
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100"
                                >
                                    <option value="">{!selectedCategory ? "-- ເລືອກປະເພດກ່ອນ --" : "-- ເລືອກຂະໜາດ --"}</option>
                                    {availableSizes.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Step 4: เลือก Unit (แสดงเฉพาะตอนอยู่ Stock) */}
                        {activeTab === "stock" && (
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-600">4. ເລືອກໜ່ວຍ</label>
                                <select
                                    required
                                    disabled={!selectedCategory}
                                    value={selectedUnit}
                                    onChange={(e) => setSelectedUnit(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100"
                                >
                                    <option value="">{!selectedCategory ? "-- ເລືອກປະເພດກ່ອນ --" : "-- ເລືອກໜ່ວຍ --"}</option>
                                    {availableUnits.map((u) => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Step 5: จำนวนเริ่มต้น (แสดงเฉพาะตอน Stock) */}
                        {activeTab === "stock" && (
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-600">5. ຈຳນວນເລີ່ມຕົ້ນ</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={initialQuantity}
                                    onChange={(e) => setInitialQuantity(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-amber-400"
                                />
                            </div>
                        )}

                        {/* Step Final: ช่องป้อนชื่อ Item (ซ่อนเมื่ออยู่ Tab Stock) */}
                        {activeTab !== "stock" && (
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-600">
                                    {activeTab === "material" && "ຊື່ວັດຖຸດິບ (ເຊັ່ນ: ເບຍ)"}
                                    {activeTab === "category" && "ຊື່ປະເພດ (ເຊັ່ນ: ນ້ຳ)"}
                                    {activeTab === "size" && "ຊື່ຂະໜາດ (ເຊັ່ນ: ໃຫຍ່, ກາງ, ນ້ອຍ)"}
                                    {activeTab === "unit" && "ຊື່ໜ່ວຍ (ເຊັ່ນ: ລັງ, ແກັດ)"}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={inputName}
                                    onChange={(e) => setInputName(e.target.value)}
                                    placeholder={`ປ້ອນຊື່ ${getTabTitle()}...`}
                                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-amber-400"
                                />
                            </div>
                        )}
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

            {/* 🟢 4. Table Display */}
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
                                {activeTab !== "stock" ? (
                                    <th className="px-6 py-3">ຊື່ {getTabTitle()}</th>
                                ) : (
                                    <>
                                        <th className="px-6 py-3">ວັດຖຸດິບ</th>
                                        <th className="px-6 py-3">ປະເພດ</th>
                                        <th className="px-6 py-3">ຂະໜາດ</th>
                                        <th className="px-6 py-3">ໜ່ວຍ</th>
                                        <th className="px-6 py-3">ຈຳນວນຄົງເຫຼືອ</th>
                                    </>
                                )}

                                {activeTab === "category" && <th className="px-6 py-3">ວັດຖຸດິບ</th>}
                                {activeTab === "size" && <th className="px-6 py-3">ປະເພດ</th>}
                                {activeTab === "unit" && (
                                    <>
                                        <th className="px-6 py-3">ປະເພດ</th>
                                        <th className="px-6 py-3">ຂະໜາດ</th>
                                    </>
                                )}
                                <th className="px-6 py-3 text-right">ຈັດການ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>

                                    {/* Standard Name */}
                                    {activeTab !== "stock" && (
                                        <td className="px-6 py-4 font-semibold text-gray-800">{item.name}</td>
                                    )}

                                    {/* Stock Details */}
                                    {activeTab === "stock" && (
                                        <>
                                            <td className="px-6 py-4 font-semibold text-gray-800">{item.materialName || item.material?.name || "-"}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium">
                                                    {item.categoryName || item.category?.name || "-"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">
                                                    {item.sizeName || item.size?.name || "-"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-purple-700">
                                                {item.unitName || item.unit?.name || "-"}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-emerald-600">
                                                {item.totalQuantity ?? item.quantity ?? 0}
                                            </td>
                                        </>
                                    )}

                                    {activeTab === "category" && (
                                        <td className="px-6 py-4">
                                            {item.material ? <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-medium">{item.material.name}</span> : "-"}
                                        </td>
                                    )}

                                    {activeTab === "size" && (
                                        <td className="px-6 py-4">
                                            {item.category ? <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium">{item.category.name}</span> : "-"}
                                        </td>
                                    )}

                                    {activeTab === "unit" && (
                                        <>
                                            <td className="px-6 py-4">
                                                {item.category ? <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium">{item.category.name}</span> : "-"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.size ? <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">{item.size.name}</span> : "-"}
                                            </td>
                                        </>
                                    )}

                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 font-medium transition">
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