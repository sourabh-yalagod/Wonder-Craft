import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
const port = 3000;

const app = express();

app.use(cors({ origin: "*" }));
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
app.use("/api/images", imageHanlder);
app.use("/api/videos", videoHanlder);
app.use("/api/payments", paymentHandlder);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
