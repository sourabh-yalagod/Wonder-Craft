import { asycnHandler } from "../../utilities/asyncHandler.js";
import { uploadOnCloudinary } from "../../utilities/cloudinary.js";
import { io } from "../../../index.js";
import { connectDB } from "../../db/index.js";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

const dirname = path.join(import.meta.dirname, "../../../public");

const imageConvert = asycnHandler(async (req, res) => {
  const user = req.user;
  const image = req.file;
  const { imageFormate, height, width, brightness } = req.body;
  const imgHeight = height || 100;
  const imgWidht = width || 100;
  const imgBrightness = brightness || 0;
  if (!image) {
    return res.status(400).json({
      success: false,
      message: "Images not found.",
    });
  }

  const scale = `-vf scale=iw*${imgWidht / 100}:ih*${imgHeight / 100}`;
  const outputFileName = `${image.originalname
    .split(".")[0]
    .concat(imageFormate || ".jpeg")}`;
  const outputFile = `public/${outputFileName}`;
  ffmpeg(image.path)
    .output(outputFile)
    .outputOptions([scale, "-vf", `eq=brightness=${imgBrightness}`])
    .on("progress", (e) => {
      console.log(e.percent);
    })
    .on("end", async () => {
      return res.sendFile(`${dirname}/${outputFileName}`, async () => {
        if (user) {
          const response = await uploadOnCloudinary(outputFile);
          console.log(response?.url);
        }
        if (fs.existsSync(image.path)) fs.unlinkSync(image.path);
        if (fs.existsSync(`${dirname}/${outputFileName}`)) fs.unlinkSync(`${dirname}/${outputFileName}`);
      });
    })
    .on("error", (err) => {
      console.error("FFmpeg Error:", err.message);
      // reject(err);
    })
    .run();
});

export { imageConvert };
