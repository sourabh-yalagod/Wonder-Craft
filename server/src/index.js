import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";

const port = 3000;

const app = express();
app.use(cookieParser());

app.use(cors({ origin: process.env.CORS_URL, credentials: true }));
app.use(express.json());
app.use(express.static("public"));

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    credentials:true,
    origin:process.env.CORS_URL
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("hi", () => {
    console.log("hi message from the Client");
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


import imageHanlder from "./routes/image.router.js";
import videoHanlder from "./routes/video.router.js";
import paymentHandlder from "./routes/razerPay.router.js";
import userHandler from "./routes/user.router.js";
import { validateAuth } from "./middleweres/auth.js";

app.use("/api/images", imageHanlder);
app.use("/api/videos", videoHanlder);
app.use("/api/payments", paymentHandlder);
app.use("/api/users", userHandler);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
