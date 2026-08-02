const prisma = require("../config/prisma");

// 1. ดึงข้อมูลสต็อกทั้งหมด (คำนวณ ยอดเก่า / นำเข้าวันนี้ / ยอดรวม)
exports.getStocks = async (req, res) => {
  try {
    const stocks = await prisma.stock.findMany({
      include: {
        material: true,
        category: true,
        size: true,
        unit: true,
        imports: true,
      },
      orderBy: { id: "desc" },
    });

    // วันนี้ เวลา 00:00:00
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const formatted = stocks.map((s) => {
      // คำนวณยอดที่นำเข้าในวันนี้
      const todayQty = s.imports
        .filter((imp) => new Date(imp.importDate) >= startOfToday)
        .reduce((sum, imp) => sum + imp.quantity, 0);

      const oldQty = s.quantity - todayQty;

      return {
        id: s.id,
        materialName: s.material?.name || "-",
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
    res.status(500).json({ error: error.message });
  }
};

// 2. นำเข้าสต็อกวัตถุดิบเพิ่ม (Stock In)
exports.importStock = async (req, res) => {
  try {
    const { stockId, quantity, note } = req.body;
    const importQty = Number(quantity);

    if (!stockId || !importQty || importQty <= 0) {
      return res.status(400).json({ error: "ข้อมูลนำเข้าไม่ถูกต้อง" });
    }

    // ทำงานใน Transaction
    const result = await prisma.$transaction(async (tx) => {
      // บันทึกประวัตินำเข้า
      const stockImport = await tx.stockImport.create({
        data: {
          stockId: Number(stockId),
          quantity: importQty,
          note: note || "",
        },
      });

      // บวกยอดสะสมเข้าตาราง Stock
      const updatedStock = await tx.stock.update({
        where: { id: Number(stockId) },
        data: {
          quantity: { increment: importQty },
        },
      });

      return { stockImport, updatedStock };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. ดึงประวัติการนำเข้าทั้งหมด
exports.getImportHistory = async (req, res) => {
  try {
    const history = await prisma.stockImport.findMany({
      include: {
        stock: {
          include: { material: true, category: true, unit: true },
        },
      },
      orderBy: { importDate: "desc" },
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};