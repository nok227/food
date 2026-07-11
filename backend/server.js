require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const menuRoutes = require("./src/routes/menuRoutes");
const { globalErrorHandler } = require("./src/middleware/errorHandler");

const app = express();

const server = http.createServer(app);


// CORS
app.use(
  cors({
    origin: [
      "https://frontend-1wb1yblwp-np14.vercel.app",
      "http://localhost:5173"
    ],
    credentials: true
  })
);


app.use(express.json());


// Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "https://frontend-1wb1yblwp-np14.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST"],
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




// routes
app.use("/menus", menuRoutes);


// 404
app.use((req, res, next) => {

  const error = new Error("ไม่พบเส้นทาง API นี้");
  error.status = 404;
  next(error);

});


// error
app.use(globalErrorHandler);



const PORT = process.env.PORT || 3000;


server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API running on port ${PORT}`);
});