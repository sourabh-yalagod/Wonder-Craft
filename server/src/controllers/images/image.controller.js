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
  const formate = imageFormate || ".jpeg";
  const imgHeight = height || 100;
  const imgWidht = width || 100;
  const imgBrightness = brightness || 0;

  if (image) {
    io.emit("file:reached:valid", {
      message: "File uploaded successfully.",
      success: true,
    });
  } else {
    io.emit("file:reached:invalid", {
      message: "File upload failed.",
      success: false,
    });
    return res.status(400).json({
      message: "Video file is required!",
      success: false,
    });
  }

  const scale = `-vf scale=iw*${imgWidht / 100}:ih*${imgHeight / 100}`;
  const outputFileName = `${image.originalname
    .split(".")[0]
    .concat(formate)}`;
  const outputFile = `public/${outputFileName}`;
  ffmpeg(image.path)
    .output(outputFile)
    .outputOptions([scale, "-vf", `eq=brightness=${imgBrightness}`])
    .on("start", () => {
      io.emit("process:began", {
        message: "Process Began with uplaoded resporces please wait......!",
        success: true,
      });
    })
    .on("progress", (e) => {
      io.emit("process:progress", { success: true, percentage: e.percent });
      console.log(e.percent);
    })
    .on("end", async () => {
      return res.sendFile(`${dirname}/${outputFileName}`, async () => {
        io.emit("done", { success: true, message: "File Sent Successfully." });
        if (user) {
          const response = await uploadOnCloudinary(outputFile);
          if (response?.url) {
            io.emit("upload:on:cloud", {
              success: true,
              message: "File Uploaded on Cloud",
              url: response?.secure_url,
            });
          }
        }
        if (fs.existsSync(image.path)) fs.unlinkSync(image.path);
        if (fs.existsSync(`${dirname}/${outputFileName}`))
          fs.unlinkSync(`${dirname}/${outputFileName}`);
      });
    })
    .on("error", (err) => {
      io.emit("failed", { success: false, message: "Process failed" });
      console.error("FFmpeg Error:", err.message);
    })
    .run();
});

export { imageConvert };
