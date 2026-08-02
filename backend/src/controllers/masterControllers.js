// backend/src/controllers/masterControllers.js
const prisma = require("../config/prisma");
const { catchAsync } = require("../middleware/errorHandler");

// ================= 1. MATERIAL (ວັດຖຸດິບ) =================
exports.getMaterials = catchAsync(async (req, res) => {
  const data = await prisma.material.findMany({ orderBy: { id: "desc" } });
  res.json(data);
});

exports.createMaterial = catchAsync(async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: "ກະລຸນາປ້ອນຊື່ວັດຖຸດິບ" });
  const result = await prisma.material.create({ data: { name: name.trim() } });
  res.json(result);
});

exports.deleteMaterial = catchAsync(async (req, res) => {
  await prisma.material.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "deleted" });
});

// ================= 2. CATEGORY (ປະເພດ) =================
exports.getCategories = catchAsync(async (req, res) => {
  const { materialId } = req.query;
  const where = materialId ? { materialId: Number(materialId) } : {};
  const data = await prisma.category.findMany({
    where,
    include: { material: true },
    orderBy: { id: "desc" },
  });
  res.json(data);
});

exports.createCategory = catchAsync(async (req, res) => {
  const { name, materialId } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: "ກະລຸນາປ້ອນຊື່ປະເພດ" });
  const result = await prisma.category.create({
    data: { name: name.trim(), materialId: materialId ? Number(materialId) : null },
    include: { material: true },
  });
  res.json(result);
});

exports.deleteCategory = catchAsync(async (req, res) => {
  await prisma.category.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "deleted" });
});

// ================= 3. SIZE (ຂະໜາດ) =================
exports.getSizes = catchAsync(async (req, res) => {
  const { categoryId } = req.query;
  const where = categoryId ? { categoryId: Number(categoryId) } : {};
  const data = await prisma.size.findMany({
    where,
    include: { category: true },
    orderBy: { id: "desc" },
  });
  res.json(data);
});

exports.createSize = catchAsync(async (req, res) => {
  const { name, categoryId } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: "ກະລຸນາປ້ອນຊື່ຂະໜາດ" });
  const result = await prisma.size.create({
    data: { name: name.trim(), categoryId: categoryId ? Number(categoryId) : null },
    include: { category: true },
  });
  res.json(result);
});

exports.deleteSize = catchAsync(async (req, res) => {
  await prisma.size.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "deleted" });
});

// ================= 4. UNIT (ໜ່ວຍ) =================
exports.getUnits = catchAsync(async (req, res) => {
  const { categoryId, sizeId } = req.query;
  const where = {};
  if (categoryId) where.categoryId = Number(categoryId);
  if (sizeId) where.sizeId = Number(sizeId);

  const data = await prisma.unit.findMany({
    where,
    include: { category: true, size: true },
    orderBy: { id: "desc" },
  });
  res.json(data);
});

exports.createUnit = catchAsync(async (req, res) => {
  const { name, categoryId, sizeId } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: "ກະລຸນາປ້ອນຊື່ໜ່ວຍ" });
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