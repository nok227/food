// 🟢 หน้าตัวอย่าง: ประวัติออเดอร์ (ข้อมูลตัวอย่าง ยังไม่ต่อ backend จริง)
const sampleOrders = [
  { id: "ORD-1042", date: "29 ก.ค. 2569", items: 3, total: 245, status: "จัดส่งแล้ว" },
  { id: "ORD-1041", date: "28 ก.ค. 2569", items: 1, total: 60, status: "กำลังเตรียม" },
  { id: "ORD-1040", date: "27 ก.ค. 2569", items: 5, total: 480, status: "จัดส่งแล้ว" },
];

const statusStyle = {
  "จัดส่งแล้ว": "bg-green-100 text-green-700",
  "กำลังเตรียม": "bg-amber-100 text-amber-700",
};

function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-800">ประวัติออเดอร์</h2>

      <div className="bg-white rounded-xl border border-gray-100 shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">เลขที่ออเดอร์</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">วันที่</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">จำนวนรายการ</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">ยอดรวม</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {sampleOrders.map((order) => (
              <tr key={order.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{order.id}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{order.date}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{order.items} รายการ</td>
                <td className="px-4 py-3 text-gray-800 whitespace-nowrap">{order.total} บาท</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400">
        * หน้านี้เป็นข้อมูลตัวอย่างสำหรับสาธิตการทำงานของระบบ Routing เท่านั้น
      </p>
    </div>
  );
}

export default OrdersPage;