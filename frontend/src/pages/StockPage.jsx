import React, { useEffect, useState } from "react";
import { stockAPI } from "../services/stockApi";

export default function StockPage() {
  const [stocks, setStocks] = useState([]);
  const [imports, setImports] = useState([]);
  
  // State การนำเข้า
  const [selectedStockId, setSelectedStockId] = useState("");
  const [importQty, setImportQty] = useState("");
  const [importNote, setImportNote] = useState("");

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const [sData, iData] = await Promise.all([stockAPI.getStocks(), stockAPI.getImportHistory()]);
    setStocks(sData || []);
    setImports(iData || []);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!selectedStockId || !importQty) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    await stockAPI.importStock(selectedStockId, importQty, importNote);
    alert("นำเข้าวัตถุดิบสำเร็จ!!");
    setImportQty(""); setImportNote(""); setSelectedStockId("");
    loadAllData();
  };

  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>📦 ระบบจัดการสต็อก ตัดสต็อกอัตโนมัติ & แจ้งเตือนเตือนวัตถุดิบ</h1>

      {/* 🟢 1. บันทึกนำเข้าสต็อก */}
      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "18px", color: "#2563eb", marginBottom: "16px" }}>➕ บันทึกนำเข้าวัตถุดิบ (Stock In)</h2>
        <form onSubmit={handleImport} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <select value={selectedStockId} onChange={(e) => setSelectedStockId(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
            <option value="">-- เลือกรายการวัตถุดิบ --</option>
            {stocks.map((s) => (
              <option key={s.id} value={s.id}>
                {s.materialName} ({s.unitName}) - คงเหลือ: {s.totalQuantity}
              </option>
            ))}
          </select>
          <input type="number" placeholder="จำนวนนำเข้า" value={importQty} onChange={(e) => setImportQty(e.target.value)} style={{ padding: "10px", width: "130px" }} />
          <input type="text" placeholder="หมายเหตุ" value={importNote} onChange={(e) => setImportNote(e.target.value)} style={{ padding: "10px", width: "200px" }} />
          <button type="submit" style={{ backgroundColor: "#16a34a", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            + บันทึกนำเข้า
          </button>
        </form>
      </div>

      {/* 📊 2. ตารางสต็อกทั้งหมด + แถบเตือนวัตถุดิบใกล้หมด */}
      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>📋 ตารางสต็อกวัตถุดิบปัจจุบัน</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9" }}>
              <th style={{ padding: "12px" }}>วัตถุดิบ</th>
              <th style={{ padding: "12px" }}>ประเภท</th>
              <th style={{ padding: "12px" }}>หน่วย</th>
              <th style={{ padding: "12px", color: "#64748b" }}>จำนวนเก่า</th>
              <th style={{ padding: "12px", color: "#2563eb" }}>นำเข้าวันนี้</th>
              <th style={{ padding: "12px" }}>คงเหลือทั้งหมด</th>
              <th style={{ padding: "12px" }}>สถานะสต็อก</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: item.isLowStock ? "#fef2f2" : "transparent" }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{item.materialName}</td>
                <td style={{ padding: "12px" }}>{item.categoryName}</td>
                <td style={{ padding: "12px" }}>{item.unitName}</td>
                <td style={{ padding: "12px", color: "#64748b" }}>{item.oldQuantity}</td>
                <td style={{ padding: "12px", color: "#2563eb", fontWeight: "bold" }}>+{item.todayQuantity}</td>
                <td style={{ padding: "12px", fontWeight: "bold", fontSize: "16px", color: item.isLowStock ? "#dc2626" : "#16a34a" }}>
                  {item.totalQuantity}
                </td>
                <td style={{ padding: "12px" }}>
                  {item.isLowStock ? (
                    <span style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                      ⚠️ ใกล้หมดแล้ว!
                    </span>
                  ) : (
                    <span style={{ backgroundColor: "#dcfce7", color: "#16a34a", padding: "4px 8px", borderRadius: "12px", fontSize: "12px" }}>
                      ✅ ปกติ
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📜 3. ประวัตินำเข้าแยกสีวันนี้ / วันอื่น */}
      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>📜 ประวัตินำเข้าวัตถุดิบ</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9" }}>
              <th style={{ padding: "12px" }}>วันที่ / เวลา</th>
              <th style={{ padding: "12px" }}>วัตถุดิบ</th>
              <th style={{ padding: "12px" }}>จำนวน</th>
              <th style={{ padding: "12px" }}>สถานะ!</th>
            </tr>
          </thead>
          <tbody>
            {imports.map((imp) => {
              const todayFlag = isToday(imp.importDate);
              return (
                <tr key={imp.id} style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: todayFlag ? "#f0fdf4" : "#f8fafc", color: todayFlag ? "#0f172a" : "#94a3b8" }}>
                  <td style={{ padding: "12px" }}>{new Date(imp.importDate).toLocaleString("lo-LA")}</td>
                  <td style={{ padding: "12px", fontWeight: todayFlag ? "bold" : "normal" }}>{imp.stock?.material?.name}</td>
                  <td style={{ padding: "12px", color: todayFlag ? "#16a34a" : "#64748b", fontWeight: "bold" }}>+{imp.quantity}</td>
                  <td style={{ padding: "12px" }}>
                    {todayFlag ? (
                      <span style={{ backgroundColor: "#dcfce7", color: "#15803d", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>🌟 วันนี้</span>
                    ) : (
                      <span style={{ backgroundColor: "#e2e8f0", color: "#64748b", padding: "4px 8px", borderRadius: "12px", fontSize: "12px" }}>📁 วันก่อนหน้า</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}