const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

router.get("/", stockController.getStocks);
router.post("/", stockController.createStock); // สร้างรายการสต็อกใหม่
router.post("/import", stockController.importStock);
router.get("/imports", stockController.getImportHistory);

module.exports = router;