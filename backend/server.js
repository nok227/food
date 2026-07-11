// src/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const menuRoutes = require("./src/routes/menuRoutes");
const { globalErrorHandler } = require("./src/middleware/errorHandler");

const app = express();

// สร้าง HTTP Server
const server = http.createServer(app);

// สร้าง Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// ส่ง io ให้ controller ใช้งาน
app.set("io", io);


// Middleware
app.use(cors());
app.use(express.json());


// Socket connection
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});


// Routes
app.use("/menus", menuRoutes);


// บล็อก Route ที่ไม่มีอยู่จริง
app.use((req, res, next) => {
  const error = new Error("ไม่พบเส้นทาง API นี้");
  error.status = 404;
  next(error);
});


// Error Handler
app.use(globalErrorHandler);


console.log("DATABASE_URL:", process.env.DATABASE_URL);


// เปิด server
const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API running on port ${PORT}`);
});