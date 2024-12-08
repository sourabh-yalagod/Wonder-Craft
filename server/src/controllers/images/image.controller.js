import { asycnHandler } from "../../utilities/asyncHandler.js";
import { fileURLToPath } from "url";
import path from "path";
import { uploadOnCloudinary } from "../../utilities/cloudinary.js";
import { clearDirectory } from "../../utilities/clearDirectory.js";
import { io } from "../../index.js";
import { connectDB } from "../../db/index.js";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs";

ffmpeg.setFfmpegPath(ffmpegStatic);

const imageConvert = asycnHandler(async (req, res) => {
  const user = req.user;
  const db = await connectDB();
  const images = req.files;
  const { imageFormate, height, width } = req.body;
  console.log(height, width);
  
  const scale = `${height}:${width}`;
  console.log(scale);

  const format = images.length === 1 ? imageFormate : imageFormate[0];

  if (!images || images.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Images not found.",
    });
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const publicPath = path.join(__dirname, "../../..", "public");

  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  const imgUrls = [];
  const processedImages = new Set();

  const promises = images?.map((image) => {
    return new Promise((resolve, reject) => {
      const inputPath = image.path;
      const fileName = image.originalname.split(".")[0] + `${format}`;
      const outputPath = path.join(publicPath, fileName);
      console.log("outputPath : ", outputPath);

      ffmpeg(inputPath)
        .output(outputPath)
        .outputOptions([width && `-vf scale=${scale}`])
        .on("end", async () => {
          try {
            if (!user?.id) {
              return res.sendFile(outputPath, (error) => {
                if (!error) {
                  clearDirectory(publicPath);
                }
              });
            }
            const uploadImage = await uploadOnCloudinary(outputPath);

            if (uploadImage) {
              const imgObj = {
                name: uploadImage.original_filename,
                extension: uploadImage.format,
                url: uploadImage.secure_url,
              };

              imgUrls.push(imgObj);
              if (!processedImages.has(imgObj.url)) {
                await db.query(
                  "INSERT INTO assets(user_id, images) VALUES($1, $2);",
                  [user?.id, uploadImage.secure_url]
                );

                console.log("Image uploaded to DB:", uploadImage.secure_url);

                processedImages.add(imgObj.url);
                io.emit("image:converted", { image: imgObj });
              }
            }
            resolve();
          } catch (uploadError) {
            reject(uploadError);
          }
        })
        .on("error", (err) => {
          console.error("FFmpeg Error:", err.message);
          reject(err);
        })
        .run();
    });
  });

  await Promise.allSettled(promises);
  clearDirectory(publicPath);
  return res.json({
    success: true,
    images: imgUrls.length,
    message: "Images processed and uploaded successfully.",
    data: imgUrls,
  });
});

export { imageConvert };
