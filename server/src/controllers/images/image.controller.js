import { exec } from "child_process";
import { asycnHandler } from "../../utilities/asyncHandler.js";
import { fileURLToPath } from "url";
import path from "path";
import { uploadOnCloudinary } from "../../utilities/cloudinary.js";
import { clearDirectory } from "../../utilities/clearDirectory.js";
import { io } from "../../index.js";

const imageConvert = asycnHandler(async (req, res) => {
  const images = req.files;
  const { imageFormate } = req.body;
  console.log(imageFormate);
  console.log(images);

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

  // Process each image
  const promises = images?.map((image) => {
    return new Promise((resolve, reject) => {
      const fileName = image.originalname.split(".")[0] + imageFormate[0];
      const outputPath = path.join(publicPath, fileName);

      // Convert image to JPEG using ffmpeg
      exec(`ffmpeg -i "${image.path}" "${outputPath}"`, async (error) => {
        if (error) {
          reject(error);
        } else {
          try {
            const uploadImage = await uploadOnCloudinary(outputPath);
            if (uploadImage) {
              const imgObj = {
                name: uploadImage.original_filename,
                extension: uploadImage.format,
                url: uploadImage.secure_url,
              };
              io.emit("image:converted", { image: uploadImage });
              imgUrls.push(imgObj);
            }
            resolve();
          } catch (uploadError) {
            reject(uploadError);
          }
        }
      });
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
