import {  asycnHandler } from "../../utilities/asyncHandler.js";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { uploadOnCloudinary } from "../../utilities/cloudinary.js";

const downloadYtVideo = asycnHandler(async (req, res) => {
  const { link } = req.body;
  console.log("Received link:", link);

  if (!link) {
    return res.json({
      success: false,
      message: "YouTube video link not found!",
    });
  }

  // Resolve __dirname in ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const videoTitle = `video_${Date.now()}`;
  const outputPath = path.join(__dirname, `../../../public/${videoTitle}`);
  const command = `yt-dlp -o "${outputPath}" "${link}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "Failed to download video.",
        error: error.message,
      });
    }
    else{
      
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    
    uploadOnCloudinary(`public/${videoTitle}.webm`)
      .then((resp) => {
        console.log(resp);

        return res.json({
          message: "Video fetched successfully.",
          success: true,
          url: resp.url,
          data: resp,
        });
      })
      .catch((error) => {
        return res.json({
          message: "Something went wrong",
          success: false,
          error,
        });
      });
  });
});

export { downloadYtVideo };
