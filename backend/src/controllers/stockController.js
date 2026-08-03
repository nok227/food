const prisma = require("../config/prisma");

// 🟢 1. ດຶງຂໍ້ມູນສະຕັອກ
exports.getStocks = async (req, res, next) => {
  try {
    const stocks = await prisma.stock.findMany({
      include: { material: true, category: true, size: true, unit: true, imports: true },
      orderBy: { id: "desc" },
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const formatted = stocks.map((s) => {
      const todayQty = s.imports
        .filter((imp) => new Date(imp.importDate) >= startOfToday)
        .reduce((sum, imp) => sum + imp.quantity, 0);

      const oldQty = s.quantity - todayQty;

      return {
        id: s.id,
        materialName: s.material?.name || "-",
        materialImageUrl: s.material?.imageUrl || null, // 🟢 ส่งรูปวัตถุดิบไปให้ frontend แสดงตรงๆ ในตาราง stock/import
        categoryName: s.category?.name || "-",
        sizeName: s.size?.name || "-",
        unitName: s.unit?.name || "-",
        oldQuantity: oldQty < 0 ? 0 : oldQty,
        todayQuantity: todayQty,
        totalQuantity: s.quantity,
      };
    });

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

// 🟢 2. ສ້າງສະຕັອກໃໝ່
exports.createStock = async (req, res, next) => {
  try {
    const { materialId, categoryId, sizeId, unitId, initialQuantity } = req.body;

    const parsedMaterialId = materialId ? Number(materialId) : null;
    const parsedCategoryId = categoryId ? Number(categoryId) : null;
    const parsedSizeId = sizeId ? Number(sizeId) : null;
    const parsedUnitId = unitId ? Number(unitId) : null;
    const parsedQuantity = initialQuantity ? Number(initialQuantity) : 0;

    const newStock = await prisma.stock.create({
      data: {
        materialId: parsedMaterialId,
        categoryId: parsedCategoryId,
        sizeId: parsedSizeId,
        unitId: parsedUnitId,
        quantity: parsedQuantity,
      },
      include: { material: true, category: true, size: true, unit: true }
    });

    if (parsedQuantity > 0) {
      await prisma.stockImport.create({
        data: {
          stockId: newStock.id,
          quantity: parsedQuantity,
          note: "ສ້າງສະຕັອກເລີ່ມຕົ້ນ",
        },
      });
    }

    res.status(201).json(newStock);
  } catch (error) {
    next(error);
  }
};

// 🟢 3. ນຳເຂົ້າສະຕັອກ
exports.importStock = async (req, res, next) => {
  try {
    const { stockId, quantity, note } = req.body;
    const importQty = Number(quantity);

    if (!stockId || !importQty || importQty <= 0) {
      return res.status(400).json({ error: "ຂໍ້ມູນນຳເຂົ້າບໍ່ຖືກຕ້ອງ" });
    }

    const result = await prisma.$transaction(async (tx) => {
      const stockImport = await tx.stockImport.create({
        data: { stockId: Number(stockId), quantity: importQty, note: note || "" },
      });

      const updatedStock = await tx.stock.update({
        where: { id: Number(stockId) },
        data: { quantity: { increment: importQty } },
      });

      return { stockImport, updatedStock };
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// 🟢 4. ປະວັດການນຳເຂົ້າ (ຈຸດນີ້ທີ່ຂາດ ຫຼື ຂຽນຊື່ຟັງຊັນບໍ່ກົງ!)
exports.getImportHistory = async (req, res, next) => {
  try {
    const history = await prisma.stockImport.findMany({
      include: { stock: { include: { material: true, category: true, unit: true } } },
      orderBy: { importDate: "desc" },
    });
    res.json(history);
  } catch (error) {
    next(error);
  }
};

// 🟢 5. ລົບສະຕັອກ
exports.deleteStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.stock.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "ລົບສະຕັອກຮຽບຮ້ອຍ" });
  } catch (error) {
    next(error);
  }
};