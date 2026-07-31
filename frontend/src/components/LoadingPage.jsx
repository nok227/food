// 🟢 หน้า/สถานะ "กำลังโหลด" ใช้เป็น fallback ของ React.lazy + Suspense
// (เด้งขึ้นระหว่างรอโหลดโค้ดของแต่ละหน้า) และนำไปใช้ที่อื่นได้ด้วยเช่นระหว่างรอ fetch ข้อมูล
function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 sm:py-28 gap-4 text-gray-400">
      <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
      <p className="text-sm font-medium">กำลังโหลดข้อมูล...</p>
    </div>
  );
}

export default LoadingPage;