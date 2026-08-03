// backend/src/controllers/stockController.js
const prisma = require("../config/prisma");

// 🟢 1. ດຶງຂໍ້ມູນສະຕັອກ + ຄຳນວນແຍກ ມື້ນີ້ / ເກົ່າ / ທັງໝົດ
exports.getStocks = async (req, res, next) => {
  try {
    const stocks = await prisma.stock.findMany({
      include: { 
        material: true, 
        category: true, 
        size: true, 
        unit: true, 
        imports: true 
      },
      orderBy: { id: "desc" },
    });

    // ຫາເວລາເລີ່ມຕົ້ນຂອງມື້ນີ້ (00:00:00)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const formatted = stocks.map((s) => {
      // ບວກຈຳນວນທີ່ນຳເຂົ້າສະເພາະມື້ນີ້ (importDate >= startOfToday)
      const todayQty = s.imports
        .filter((imp) => new Date(imp.importDate) >= startOfToday)
        .reduce((sum, imp) => sum + imp.quantity, 0);

      // ຈຳນວນເກົ່າ = ຈຳນວນທັງໝົດ - ຈຳນວນທີ່ເພີ່ມມື້ນີ້
      const oldQty = s.quantity - todayQty;

      return {
        id: s.id,
        materialName: s.material?.name || "-",
        categoryName: s.category?.name || "-",
        sizeName: s.size?.name || "-",
        unitName: s.unit?.name || "-",
        oldQuantity: oldQty < 0 ? 0 : oldQty,   // ຈຳນວນເກົ່າ
        todayQuantity: todayQty,                 // ຈຳນວນມື້ນີ້
        totalQuantity: s.quantity,              // ຈຳນວນທັງໝົດ
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
      include: {
        material: true,
        category: true,
        size: true,
        unit: true,
      }
    });

    // ຖ້າມີจำนวนเริ่มต้น ให้ลงบันทึกเป็น Import ของวันนี้ด้วย
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
    console.error("Error creating stock:", error);
    res.status(500).json({ error: error.message || "Cannot create stock" });
  }
};

// 🟢 3. ຟັງຊັນນຳເຂົ້າສະຕັອກ (Import Stock)
exports.importStock = async (req, res, next) => {
  try {
    const { stockId, quantity, note } = req.body;
    const importQty = Number(quantity);

    if (!stockId || !importQty || importQty <= 0) {
      return res.status(400).json({ error: "ຂໍ້ມູນນຳເຂົ້າບໍ່ຖືກຕ້ອງ" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. ບັນທຶກປະວັດການນຳເຂົ້າ (ວັນທີຈະເປັນ Now อัตโนมัติ)
      const stockImport = await tx.stockImport.create({
        data: { stockId: Number(stockId), quantity: importQty, note: note || "" },
      });

      // 2. ອັບເດດຈຳນວນທັງໝົດໃນ Stock (quantity + importQty)
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

// 🟢 4. ລົບສະຕັອກ
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