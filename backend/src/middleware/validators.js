// src/middleware/validators.js

exports.validateMenu = (req, res, next) => {
  const { name, price, imageUrl } = req.body;

  // 1. ตรวจสอบชื่ออาหาร
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ 
      error: "กรุณาระบุชื่ออาหาร และต้องเป็นตัวอักษรเท่านั้น" 
    });
  }

  // 2. ตรวจสอบราคา
  const priceNum = Number(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return res.status(400).json({ 
      error: "ราคาอาหารต้องเป็นตัวเลข และมีค่ามากกว่า 0 บาท" 
    });
  }

  // 3. ตรวจสอบรูปแบบ URL (กรณีที่ส่งมา)
  if (imageUrl) {
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))/i;
    // หมายเหตุ: เช็กเบื้องต้น ถ้ารูปแบบไม่ตรง และไม่ได้ขึ้นต้นด้วย http ให้แจ้งเตือนได้ (หรือจะปิดส่วนนี้ถ้าใช้ base64)
    if (typeof imageUrl !== "string") {
      return res.status(400).json({ error: "รูปแบบ URL ของรูปภาพไม่ถูกต้อง" });
    }
  }

  // ข้อมูลผ่านการตรวจสอบ -> ปรับฟอร์แมตให้พร้อมใช้งาน -> ไปขั้นตอนถัดไป
  req.body.name = name.trim();
  req.body.price = priceNum;
  next();
};