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

// เพิ่มเมนู (ไม่ต้องแปลง Number ซ้ำ เพราะทำที่ Validator แล้ว)
exports.createMenu = catchAsync(async (req, res) => {
  const menu = await prisma.menu.create({
    data: {
      name: req.body.name,
      price: req.body.price,
      imageUrl: req.body.imageUrl || null
    }
  });

  // ส่งแจ้งเตือน realtime
  const io = req.app.get("io");
  io.emit("menuUpdated");

  res.json(menu);
});

// แก้ไขเมนู
exports.updateMenu = catchAsync(async (req, res) => {
  const menu = await prisma.menu.update({
    where: { id: Number(req.params.id) },
    data: {
      name: req.body.name,
      price: req.body.price,
      imageUrl: req.body.imageUrl || null
    }
  });

  // ส่งแจ้งเตือน realtime
  const io = req.app.get("io");
  io.emit("menuUpdated");

  res.json(menu);
});

// ลบเมนู
exports.deleteMenu = catchAsync(async (req, res) => {
  await prisma.menu.delete({
    where: { id: Number(req.params.id) }
  });

  // ส่งแจ้งเตือน realtime
  const io = req.app.get("io");
  io.emit("menuUpdated");

  res.json({ message: "deleted" });
});