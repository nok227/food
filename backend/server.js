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
    origin: "*", // 🟢 เปิดอิสระเพื่อรองรับทุก Domain ของ Vercel
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
  transports: ["polling", "websocket"], // 🟢 เพิ่มให้ตรงกับ Frontend
  allowEIO3: true,
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
app.get("/health", async (req, res) => {
  try {
    // ลองดึงข้อมูลจาก Database 1 รายการเพื่อกระตุ้น Supabase ให้ตื่นตลอดเวลา
    // (เปลี่ยนเป็นคำสั่ง query ของคุณ เช่น prisma.menu.findFirst() หรือ db.query(...))
    await prisma.menu.findFirst(); 

    res.json({ status: "OK", database: "Connected", timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: "ERROR", database: error.message });
  }
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

