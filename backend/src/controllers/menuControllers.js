// src/controllers/menuController.js
const prisma = require("../config/prisma");
const { catchAsync } = require("../middleware/errorHandler");

// GET เมนูทั้งหมด
exports.getAllMenus = catchAsync(async (req, res) => {
  const menus = await prisma.menu.findMany({
    orderBy: { id: "desc" }
  });
  res.json(menus);
});

// เพิ่มเมนู (บันทึกได้ทุกกรณี)
exports.createMenu = catchAsync(async (req, res) => {
  const { name, price, imageUrl } = req.body;

  const menu = await prisma.menu.create({
    data: {
      name: name || "ไม่ระบุชื่อเมนู",
      price: typeof price === "number" ? price : 0,
      imageUrl: imageUrl || null
    }
  });

  // ส่งแจ้งเตือน realtime
  const io = req.app.get("io");
  if (io) io.emit("menuUpdated");

  res.json(menu);
});

// แก้ไขเมนู (บันทึกได้ทุกกรณี)
exports.updateMenu = catchAsync(async (req, res) => {
  const { name, price, imageUrl } = req.body;

  const menu = await prisma.menu.update({
    where: { id: Number(req.params.id) },
    data: {
      name: name || "ไม่ระบุชื่อเมนู",
      price: typeof price === "number" ? price : 0,
      imageUrl: imageUrl || null
    }
  });

  // ส่งแจ้งเตือน realtime
  const io = req.app.get("io");
  if (io) io.emit("menuUpdated");

  res.json(menu);
});

// ลบเมนู
exports.deleteMenu = catchAsync(async (req, res) => {
  await prisma.menu.delete({
    where: { id: Number(req.params.id) }
  });

  // ส่งแจ้งเตือน realtime
  const io = req.app.get("io");
  if (io) io.emit("menuUpdated");

  res.json({ message: "deleted" });
});