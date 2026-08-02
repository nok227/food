// backend/src/controllers/masterControllers.js
const prisma = require("../config/prisma");
const { catchAsync } = require("../middleware/errorHandler");

// ================= CATEGORY =================
exports.getCategories = catchAsync(async (req, res) => {
  const data = await prisma.category.findMany({ orderBy: { id: "desc" } });
  res.json(data);
});

exports.createCategory = catchAsync(async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "กะລຸນາປ້ອນຊື່ປະເພດ" });
  }
  const result = await prisma.category.create({ data: { name: name.trim() } });
  res.json(result);
});

exports.deleteCategory = catchAsync(async (req, res) => {
  await prisma.category.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "deleted" });
});

// ================= SIZE =================
exports.getSizes = catchAsync(async (req, res) => {
  const { categoryId } = req.query;
  const where = categoryId ? { categoryId: Number(categoryId) } : {};

  const data = await prisma.size.findMany({
    where,
    include: { category: true }, // 🟢 ดึงข้อมูล Category มาด้วย
    orderBy: { id: "desc" },
  });
  res.json(data);
});

exports.createSize = catchAsync(async (req, res) => {
  const { name, categoryId } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "กະລຸນາປ້ອນຊື່ຂະໜາດ" });
  }

  const result = await prisma.size.create({
    data: {
      name: name.trim(),
      categoryId: categoryId ? Number(categoryId) : null,
    },
    include: { category: true },
  });
  res.json(result);
});

exports.deleteSize = catchAsync(async (req, res) => {
  await prisma.size.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "deleted" });
});

// ================= UNIT =================
exports.getUnits = catchAsync(async (req, res) => {
  const { categoryId, sizeId } = req.query;
  const where = {};
  if (categoryId) where.categoryId = Number(categoryId);
  if (sizeId) where.sizeId = Number(sizeId);

  const data = await prisma.unit.findMany({
    where,
    include: { category: true, size: true }, // 🟢 ດຶງຂໍ້ມູນ Category ແລະ Size ມາພ້ອມ
    orderBy: { id: "desc" },
  });
  res.json(data);
});

exports.createUnit = catchAsync(async (req, res) => {
  const { name, categoryId, sizeId } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "ກະລຸນາປ້ອນຊື່ໜ່ວຍ" });
  }

  const result = await prisma.unit.create({
    data: {
      name: name.trim(),
      categoryId: categoryId ? Number(categoryId) : null,
      sizeId: sizeId ? Number(sizeId) : null,
    },
    include: { category: true, size: true },
  });
  res.json(result);
});

exports.deleteUnit = catchAsync(async (req, res) => {
  await prisma.unit.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "deleted" });
});