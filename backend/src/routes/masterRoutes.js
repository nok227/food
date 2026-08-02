// backend/src/routes/masterRoutes.js
const express = require("express");
const router = express.Router();
const masterController = require("../controllers/masterControllers");

// 1. Material Routes
router.get("/materials", masterController.getMaterials);
router.post("/materials", masterController.createMaterial);
router.delete("/materials/:id", masterController.deleteMaterial);

// 2. Category Routes
router.get("/categories", masterController.getCategories);
router.post("/categories", masterController.createCategory);
router.delete("/categories/:id", masterController.deleteCategory);

// 3. Size Routes
router.get("/sizes", masterController.getSizes);
router.post("/sizes", masterController.createSize);
router.delete("/sizes/:id", masterController.deleteSize);

// 4. Unit Routes
router.get("/units", masterController.getUnits);
router.post("/units", masterController.createUnit);
router.delete("/units/:id", masterController.deleteUnit);

module.exports = router;