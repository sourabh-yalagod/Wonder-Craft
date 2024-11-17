import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import imageHanlder from "./routes/image.router.js";

const app = express();
const port = 3000;

app.use(cors({origin:"*"}));
app.use(express.json());
// app.use(express.static('/src/uploads'))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "uploads")));

app.use("/api/images", imageHanlder);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
