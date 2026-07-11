require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const menuRoutes = require("./src/routes/menuRoutes");
const { globalErrorHandler } = require("./src/middleware/errorHandler");

const app = express();
const server = http.createServer(app);

// 🟢 ปรับ CORS ให้รองรับ ทุก URL ในโหมดพัฒนา เพื่อป้องกันอาการตัดสาย (Socket Timeout)
app.use(
  cors({
    origin: true, // เปิดรับทราฟฟิกชั่วคราวเพื่อให้ต่อติดง่ายขึ้น หรือเปลี่ยนกลับเป็นอาร์เรย์เดิมได้ครับ
    credentials: true
  })
);

app.use(express.json());

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: true, // อนุญาตให้เชื่อมต่อ Socket ได้สะดวกขึ้น
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// 🟢 1. ดึงข้อความตรวจสอบระบบ (Health Check) ย้ายขึ้นมาไว้บนสุด เพื่อไม่ให้ติด 404
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 🟢 2. เพิ่มการรองรับหน้าแรกสุด (Root path) เพื่อตอบกลับ Render เผื่อโดนยิงเช็คสถานะ
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Food Backend is running smoothly!" });
});

// 3. routes หลักของคุณ
app.use("/menus", menuRoutes);

// 4. 404 Handler (ต้องอยู่ "หลัง" routes ทั้งหมดเสมอ)
app.use((req, res, next) => {
  const error = new Error("ไม่พบเส้นทาง API นี้");
  error.status = 404;
  next(error);
});

// 5. Global Error Handler ตัวสุดท้าย
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
});