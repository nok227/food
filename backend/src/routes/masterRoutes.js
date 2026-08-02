// backend/src/routes/masterRoutes.js
const express = require("express");
const router = express.Router();
const masterController = require("../controllers/masterControllers");

// Categories
router.get("/categories", masterController.getCategories);
router.post("/categories", masterController.createCategory);
router.delete("/categories/:id", masterController.deleteCategory);

// Sizes
router.get("/sizes", masterController.getSizes);
router.post("/sizes", masterController.createSize);
router.delete("/sizes/:id", masterController.deleteSize);

// Units
router.get("/units", masterController.getUnits);
router.post("/units", masterController.createUnit);
router.delete("/units/:id", masterController.deleteUnit);

module.exports = router;