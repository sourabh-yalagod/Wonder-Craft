import { exec } from "child_process";
import { asycnHandler } from "../../utilities/asyncHandler.js";
import { fileURLToPath } from "url";
import path from "path";
import { uploadOnCloudinary } from "../../utilities/cloudinary.js";
import { clearDirectory } from "../../utilities/clearDirectory.js";
import { io } from "../../index.js";
import { connectDB } from "../../db/index.js";

const imageConvert = asycnHandler(async (req, res) => {
  const user = req.user;
  const db = await connectDB();
  const images = req.files;
  const { imageFormate } = req.body;
  console.log(imageFormate);
  const formate = images.length == 1 ? imageFormate : imageFormate[0];
  if (!images) {
    return res.status(201).json({
      success: true,
      message: "Images not found.",
    });
  }
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const publicPath = path.join(__dirname, "../../..", "public");

  // To store uploaded image URLs
  const imgUrls = [];
  const processedImages = new Set();
  // Process each image
  const promises = images.map((image) => {
    return new Promise((resolve, reject) => {
      const fileName = image.originalname.split(".")[0] + formate;
      const outputPath = path.join(publicPath, fileName);

      // Convert image to JPEG using ffmpeg
      exec(`ffmpeg -i "${image.path}" ./public/${fileName}`, async (error) => {
        if (error) {
          console.log("error : ", error);
          reject(error);
        } else {
          try {
            if (!user?.id) {
              return res.sendFile(outputPath, (error) => {
                if (!error) {
                  clearDirectory(publicPath);
                }
              });
            } else {
              console.log("hey man");

              const uploadImage = await uploadOnCloudinary(outputPath);
              if (uploadImage) {
                const imgObj = {
                  name: uploadImage.original_filename,
                  extension: uploadImage.format,
                  url: uploadImage.secure_url,
                };
                imgUrls.push(imgObj);
                if (!processedImages.has(imgObj)) {
                  const imageQuery = await db.query('insert into assets(user_id,images) values($1,$2);',[user?.id,uploadImage?.secure_url])
                  console.log("imageQuery : ",imageQuery?.rowCount);
                  
                  processedImages.add(imgObj);
                  io.emit("image:converted", { image: imgObj });
                }
              }
            }
            resolve();
          } catch (uploadError) {
            reject(uploadError);
          }
        }
      });
    });
  });

  // Always use Promise.allSettled to handle array, whether single or multiple images
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
