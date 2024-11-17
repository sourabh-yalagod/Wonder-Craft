import { exec } from "child_process";
import { asycnHandler } from "../../utilities/asyncHandler.js";
import { fileURLToPath } from "url";
import path from "path";
import { uploadOnCloudinary } from "../../utilities/cloudinary.js";

const imageConvert = asycnHandler(async (req, res) => {
  const images = req?.files;
  if (!images) {
    return res.status(201).json({
      success: true,
      message: "Images not found.",
    });
  }
  const numberOfImages = images.length;
  const imgUrls = [];
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const publicPath = path.join(__dirname, "../../..", "public");

  console.log(publicPath);
  images.map((image) => {
    const fileName = image.originalname.split(".")[0] + ".jpeg";

    const joinedPath = `./public/${fileName}`;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    exec(`ffmpeg -i ${image.path} ${joinedPath}`, async (error) => {
      console.log(joinedPath);
      if (error) {
        return res.json({
          message: "Image formate changing process failed.",
          success: false,
          error,
        });
      }
      if (!error) {
        const uploadImage = await uploadOnCloudinary(joinedPath);
        console.log(`inside`);

        console.log("uploadImage?.url : ", uploadImage?.url);
        imgUrls.push(uploadImage?.url);
        if (imgUrls.length == numberOfImages) {
          res.json({
            url: imgUrls,
          });
        }
      }
    });
    console.log(`Outside`);
  });
});

export { imageConvert };
