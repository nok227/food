// src/middleware/validators.js

exports.validateMenu = (req, res, next) => {
  let { name, price, imageUrl } = req.body;

  // 1. จัดการชื่ออาหาร (ถ้าไม่ใส่มา หรือไม่ใช่ข้อความ ให้ใช้ค่า Default)
  if (!name || typeof name !== "string" || name.trim() === "") {
    req.body.name = "ไม่ระบุชื่อเมนู";
  } else {
    req.body.name = name.trim();
  }

  // 2. จัดการราคา (ถ้าแปลงเป็นตัวเลขไม่ได้ หรือค่าน้อยกว่า 0 ให้ปรับเป็น 0)
  const priceNum = Number(price);
  if (isNaN(priceNum) || priceNum < 0) {
    req.body.price = 0;
  } else {
    req.body.price = priceNum;
  }

  // 3. จัดการ URL รูปภาพ (ถ้าส่งมาไม่ใช่ string ให้ปรับเป็น null)
  if (imageUrl && typeof imageUrl !== "string") {
    req.body.imageUrl = null;
  } else {
    req.body.imageUrl = imageUrl || null;
  }

  // ปล่อยให้ผ่านไปบันทึกข้อมูลได้ทุกกรณี
  next();
};