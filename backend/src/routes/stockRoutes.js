const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

router.get("/", stockController.getStocks);
router.post("/", stockController.createStock); // 👈 ตัวนี้จะมีฟังก์ชันมารองรับแล้ว
router.post("/import", stockController.importStock);
router.get("/imports", stockController.getImportHistory);

module.exports = router;