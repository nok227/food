// src/middleware/errorHandler.js

// ตัวช่วยครอบฟังก์ชัน (Async Wrapper) เพื่อไม่ต้องเขียน try-catch ใน Controller
exports.catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Middleware จัดการ Error ด่านสุดท้าย
exports.globalErrorHandler = (err, req, res, next) => {
  console.error("🔥 เกิดข้อผิดพลาดในระบบ:", err);

  if (err.code === "P2025") {
    return res.status(404).json({ 
      error: "ไม่พบข้อมูลที่ต้องการจัดการในระบบ (Record not found)" 
    });
  }

  res.status(err.status || 500).json({
    error: err.message || "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์"
  });
};