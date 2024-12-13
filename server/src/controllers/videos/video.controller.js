import { asycnHandler } from "../../utilities/asyncHandler.js";
import { exec } from "child_process";
import fs from "fs";
import { uploadOnCloudinary } from "../../utilities/cloudinary.js";
import { io } from "../../../index.js";
import { connectDB } from "../../db/index.js";
import ffmpeg from "fluent-ffmpeg";

const ytUrl = asycnHandler(async (req, res) => {
  const { link } = req.body;
  console.log("YT URL : " + link);

  if (!link) {
    return res
      .status(400)
      .json({ success: false, message: "Video URL required." });
  }

  let videoName = "public/video.mp4";

  exec(`yt-dlp --get-title "${link}"`, (error, title) => {
    if (error) {
      io.emit("ytUrl:url:invalid", {
        message: "Invalid YouTube URL",
        success: false,
      });

      return res.json({ success: false, message: "Invalid YouTube URL" });
    }
    if (!error) {
      io.emit("ytUrl:url:valid", { title, success: true });
    }

    exec(`yt-dlp -f mp4 -o "${videoName}" "${link}"`, async (error) => {
      if (error) {
        io.emit("ytUrl:videoDownlaod:invalid", {
          message: "Video download failed.",
          success: false,
        });
        return res
          .status(500)
          .json({ success: false, message: "Video download failed." });
      }
      io.emit("ytUrl:videoDownlaod:valid", {
        message: "Video downloaded successfully",
        success: true,
      });

      const response = await uploadOnCloudinary(videoName);
      return res.json({
        message: "video processed successfully",
        success: true,
        url: response.secure_url,
      });
    });
  });
});

const videoFormate = asycnHandler(async (req, res) => {
  const user = req?.user;
  const viderFormate = req?.body?.formate || ".mp4";
  const videoFile = req.file;
  if (!videoFile) {
    io.emit("videoFormate:videoFile:invalid", {
      message: "Video File not received by Server . . . !",
      success: false,
    });
    return res.json({
      message: "video not available.",
      success: false,
    });
  }
  if (videoFile.path) {
    io.emit("videoFormate:videoFile:valid", {
      message: "Video File received successfully.",
      success: true,
    });
  }

  const videoName = `${videoFile.filename.split(".")[0]}${viderFormate}`;
  const output = `./public/${videoName}`;
  console.log("OutPut : ", output);

  exec(
    `ffmpeg -i ${videoFile.path} ${output}`,
    async (error, stderr, stdout) => {
      if (stdout) {
        io.emit("videoFormate:process:valid", {
          message: "video formate process under process",
          success: true,
        });
      }

      if (error) {
        io.emit("videoFormate:process:invalid", {
          message: "video formate process failed. . . . . . !",
          success: true,
        });
        console.log(error);

        return res.status(500).json({
          message: "Video format conversion failed",
          success: false,
          error: error.message || stderr,
        });
      } else {
        io.emit("videoFormate:sending:valid", {
          message: "processed video is being sent.",
          success: true,
        });
        fs.unlinkSync(videoFile.path);
        const uploadVideo = await uploadOnCloudinary(output);
        if (user?.id) {
          console.log("Cloudinary URL: ", uploadVideo.secure_url);

          if (uploadVideo?.secure_url || uploadVideo?.url) {
            const db = await connectDB();
            const storeVideos = await db.query(
              `INSERT INTO assets (user_id, videos) VALUES ($1, $2)`,
              [user?.id, uploadVideo?.secure_url]
            );
            console.log("Stored video info: ", storeVideos?.fields);

            io.emit("videoFormate:done:valid", {
              message: "Video formate process Done successfully.",
              success: true,
            });
            return res.status(200).json({
              message: "Video format converted and uploaded successfully.",
              success: true,
              url: uploadVideo.secure_url,
            });
          }
        } else {
          io.emit("videoFormate:sending:valid", {
            message: "Video formate changed successfully.",
            success: true,
          });
          return res.json({
            message: "video processed successfully.",
            success: false,
            url: uploadVideo?.secure_url,
          });
        }
      }
    }
  );
});

const compressVideo = asycnHandler(async (req, res) => {
  try {
    const videoFile = req.file;
    const size = req.body.size || "1280x?";
    const fps = req.body.fps || 30;
    const videoCodec = req.body.videoCodec || "libx264";
    const format = req.body.format || ".mp4";

    // Validate video file
    if (!videoFile) {
      io.emit("resizeVideo:file:receive:invalid", {
        message: "Video file failed to send to the server",
        success: false,
      });
      return res.status(400).json({
        message: "Video file is required!",
        success: false,
      });
    }

    // Emit valid file event
    io.emit("resizeVideo:file:receive:valid", {
      message: "Video file received by server.",
      success: true,
    });
    const outputFile = `./public/compressed-video${format}`;

    ffmpeg(videoFile.path)
      .size(size)
      .fps(fps)
      .videoCodec(videoCodec)
      .outputOptions("-crf 26")
      .on("start", () => {
        io.emit("resizeVideo:process:valid", {
          message: "The video processing has started.",
          success: true,
        });
      })
      .on("progress", (load) => {
        io.emit("resizeVideo:process:percentage", {
          percentage: load?.percent,
        });
      })
      .on("end", async () => {
        const response = await uploadOnCloudinary(outputFile);
        console.log("URL : ", response.secure_url);

        io.emit("resizeVideo:done", {
          message: "Video successfully compressed.",
          success: true,
        });
        // res.sendFile(outputFile, (err) => {
        //   if (err) {
        //     io.emit("resizeVideo:sending:invalid", {
        //       message: "Failed to send the resized video to the client.",
        //       success: false,
        //     });
        //     console.error("Error sending file:", err.message);
        //   } else {
        //     io.emit("resizeVideo:sending:valid", {
        //       message: "Processed video sent successfully.",
        //       success: true,
        //     });
        //   }
        // });
        if (!response.secure_url) {
          io.emit("resizeVideo:sending:invalid", {
            message: "Failed to send the resized video to the client.",
            success: false,
          });
          return res.json({
            message: "video resize processed successfully.",
            success: false,
          });
        } else {
          io.emit("resizeVideo:sending:valid", {
            message: "Processed video sent successfully.",
            success: true,
          });
          return res.json({
            message: "video resize processed successfully.",
            success: true,
            url: response.secure_url,
          });
        }
      })
      .on("error", (err) => {
        io.emit("resizeVideo:process:invalid", {
          message: "Resizing the video process failed.",
          success: false,
        });
        console.error("Error processing video:", err.message);
        return res.status(500).json({
          message: "Video compressing process failed!",
          success: false,
          error: err.message,
        });
      })
      .save(outputFile);
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(400).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
});

const audioFromVideo = asycnHandler(async (req, res) => {
  try {
    const videoFile = req.file;

    if (!videoFile) {
      io.emit("audio:videoFile:invalid", {
        message: "Video file not received by server.",
        success: false,
      });
      return res.status(400).json({
        message: "Video file is required.",
        success: false,
      });
    }

    io.emit("audio:videoFile:valid", {
      message: "Video file received by server successfully.",
      success: true,
    });
    const audioPath = "public/audio.mp3";
    ffmpeg(videoFile.path)
      .noVideo()
      .audioCodec("libmp3lame")
      .output(audioPath)
      .on("start", () => {
        io.emit("audio:process:valid", {
          message: "Audio extraction process started.",
          success: true,
        });
      })
      .on("end", async () => {
        console.log("Audio extraction completed successfully.");
        fs.unlinkSync(videoFile.path);
        const response = await uploadOnCloudinary(audioPath);
        console.log(response);
        io.emit("audio:done", {
          message: "Audio extraction completed successfully.",
          success: true,
        });
        return res.json({
          message: "Audio from video processed successfully.",
          success: true,
          url: response.secure_url,
        });
      })
      .on("error", (err) => {
        fs.unlinkSync(videoFile.path);
        io.emit("audio:sending:invalid", {
          message: "Failed to send audio file to client.",
          success: false,
        });
        console.error("Error extracting audio:", err.message);
        io.emit("audio:process:invalid", {
          message: "Audio extraction process failed.",
          success: false,
        });

        return res.status(500).json({
          message: "Audio extraction failed.",
          error: err.message,
          success: false,
        });
      })
      .run();
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
      success: false,
    });
  }
});

export { videoFormate, ytUrl, compressVideo, audioFromVideo };
