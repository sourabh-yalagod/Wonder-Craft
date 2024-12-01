import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";

const port = 3000;

const app = express();
app.use(cookieParser());
const expiryTime = 1732794992 * 1000;
const currentTime = Date.now();

const timeRemaining = expiryTime - currentTime;

if (timeRemaining > 0) {
  const seconds = Math.floor((timeRemaining / 1000) % 60);
  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
  const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

  console.log(`Time remaining: ${days}d ${hours}h ${minutes}m ${seconds}s`);
} else {
  console.log("The expiry time has passed.");
}

app.use(cors({ origin: process.env.CORS_URL }));
app.use(express.json());

const server = http.createServer(app);
export const io = new Server(server, { cors: true });

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("hi", () => {
    console.log("hi message from the Client");
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use(express.static("public"));

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
