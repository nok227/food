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
    origin: [
      "https://frontend-1wb1yblwp-np14.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// ส่ง io ให้ controller ใช้งาน
app.set("io", io);


// Middleware
app.use(cors({
  origin: [
    "https://frontend-1wb1yblwp-np14.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));

app.use(express.json());


// Socket connection
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});


// ทดสอบ API
app.get("/", (req, res) => {
  res.json({
    status: "API running",
    message: "Food Ordering Backend"
  });
});


// Routes
app.use("/menus", menuRoutes);


// Route ไม่พบ
app.use((req, res, next) => {
  const error = new Error("ไม่พบเส้นทาง API นี้");
  error.status = 404;
  next(error);
});


// Error Handler
app.use(globalErrorHandler);


console.log("DATABASE_URL:", process.env.DATABASE_URL);


// เปิด Server
const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API running on port ${PORT}`);
});