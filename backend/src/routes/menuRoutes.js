// src/routes/menuRoutes.js
const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuControllers");
const { validateMenu } = require("../middleware/validators"); 

// กำหนดเส้นทาง + เสียบตัวตรวจข้อมูล
router.get("/", menuController.getAllMenus);
router.post("/", validateMenu, menuController.createMenu);    
router.put("/:id", validateMenu, menuController.updateMenu); 
router.delete("/:id", menuController.deleteMenu);

module.exports = router;