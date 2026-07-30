require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const menuRoutes = require("./src/routes/menuRoutes");
const { globalErrorHandler } = require("./src/middleware/errorHandler");

const app = express();
const server = http.createServer(app);

// 🟢 บอกให้ Express เชื่อถือ Proxy ของ Render (ป้องกันการหลุดเชื่อมต่อของ Socket)
app.enable("trust proxy");

// 🟢 1. ตั้งค่า CORS
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// 🟢 2. ตั้งค่า Socket.IO ให้เสถียรบน Render
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
  transports: ["polling", "websocket"],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000
});

// แชร์ตัวแปร io เข้าไปใน Express App
app.set("io", io);

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", (reason) => {
    console.log(`🔴 Client disconnected: ${socket.id} (Reason: ${reason})`);
  });
});

// 🟢 3. Health Check & Root Path
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`
  });
});

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Food Backend is running smoothly!" });
});

// 🟢 4. Routes หลักของ API
app.use("/menus", menuRoutes);

// 🟢 5. 404 Handler
app.use((req, res, next) => {
  const error = new Error("ไม่พบเส้นทาง API นี้");
  error.status = 404;
  next(error);
});

// 🟢 6. Global Error Handler
app.use(globalErrorHandler);

// 🟢 7. Start Server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
});

// 🟢 8. ดักจับ Error ระดับ Process
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception thrown:", err);
});