var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import cors from "cors";
import { config } from "dotenv";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { upload } from "./middleweres/multer.js";
import { uploadOnCloudinary } from "./middleweres/cloudinary.js";
config({ path: "./.env" });
const port = process.env.PORT;
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static("./public"));
app.get("/", (req, res) => {
    res.send("Hello world.");
});
app.post("/api/image", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const image = req.file.path;
    if (!image) {
        res.json({
            message: "image not found.",
        });
        return;
    }
    try {
        const outputImagePath = path.join("public", `${Date.now()}-converted.jpg`);
        const uploadImage = yield uploadOnCloudinary(image);
        console.log(uploadImage === null || uploadImage === void 0 ? void 0 : uploadImage.url);
        yield sharp(uploadImage === null || uploadImage === void 0 ? void 0 : uploadImage.url).jpeg({ quality: 80 }).toFile(outputImagePath);
        fs.unlinkSync(image);
        res.json({
            message: "Image converted successfully.",
            convertedImagePath: outputImagePath,
        });
    }
    catch (error) {
        console.error("Error converting image:", error);
        res.status(500).json({ error: "Error converting image." });
    }
}));
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
