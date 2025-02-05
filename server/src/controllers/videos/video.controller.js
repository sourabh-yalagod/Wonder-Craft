import { asycnHandler } from "../../utilities/asyncHandler.js";
import { exec } from "child_process";
import fs from "fs";
import { uploadOnCloudinary } from "../../utilities/cloudinary.js";
import { io } from "../../../index.js";
import { connectDB } from "../../db/index.js";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import ytdl from "ytdl-core";

const ytUrl = asycnHandler(async (req, res) => {
  const user = req.user;
  const { link } = req.body;
  console.log("YT URL : " + link);

  if (!link) {
    return res
      .status(400)
      .json({ success: false, message: "Video URL required." });
  }

  const videoName = `./public/video${Math.random().toString().slice(1, 9)}.mp4`;

  exec(`yt-dlp -j "${link}"`, async (error, info) => {
    if (error) {
      io.emit("ytUrl:url:invalid", {
        message: "Invalid YouTube URL",
        success: false,
      });
      return res.json({ success: false, message: "Invalid YouTube URL" });
    }
    if (!error) {
      console.log(info);
      io.emit("ytUrl:url:valid", { info, success: true });
    }
    console.log("videoName : ", videoName);

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
      console.log("URL : ", response?.url);
      console.log(response);

      if (user?.id && response?.secure_url) {
        const db = await connectDB();
        const assetsDB = await db.query(
          "INSERT INTO assets(user_id, images) VALUES($1, $2);",
          [user?.id, response.secure_url]
        );
        console.log(assetsDB.rows);
      }

      return res.json({
        message: "video processed successfully",
        success: true,
        url: response.secure_url,
      });
    });
  });
});

const videoFormate = asycnHandler(async (req, res) => {
  const userId = req?.user?.id;
  const videoFormat = req?.body?.formate;

  const videoFile = req?.file;
  if (!videoFile) {
    io.emit("videoFormate:videoFile:invalid", {
      message: "Video file not received by the server.",
      success: false,
    });
    return res.status(400).json({
      message: "No video file provided.",
      success: false,
    });
  }
  io.emit("videoFormate:videoFile:valid", {
    message: "Video file received successfully.",
    success: true,
  });

  const videoName = `${videoFile.originalname.split(".")[0]}.${videoFormat}`;
  const outputPath = `./public/${videoName}`;

  console.log("Output Path: ", outputPath);

  ffmpeg(videoFile.path)
    .output(outputPath)
    .on("end", async () => {
      try {
        console.log("Video processing complete.");
        io.emit("videoFormate:sending:valid", {
          message: "Processed video is being sent.",
          success: true,
        });
        console.log("outputPath : ", outputPath);

        const uploadVideo = await uploadOnCloudinary(outputPath);
        console.log("Cloudinary URL: ", uploadVideo);

        if (userId) {
          const db = await connectDB();
          await db.query(
            `INSERT INTO assets (user_id, videos) VALUES ($1, $2)`,
            [userId, uploadVideo?.secure_url]
          );
        }
        io.emit("videoFormate:done:valid", {
          message: "Video format process completed successfully.",
          success: true,
        });

        // fs.unlinkSync(videoFile.path);

        return res.status(200).json({
          message: "Video format converted and uploaded successfully.",
          success: true,
          url: uploadVideo.secure_url,
        });
      } catch (error) {
        console.error("Processing Error: ", error.message);

        io.emit("videoFormate:process:invalid", {
          message: "Video format process failed.",
          success: false,
        });
        if (fs.existsSync(videoFile.path)) fs.unlinkSync(videoFile.path);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

        return res.status(500).json({
          message: "Video format conversion failed.",
          success: false,
          error: error.message,
        });
      } finally {
        if (fs.existsSync(videoFile.path)) fs.unlinkSync(videoFile.path);
      }
    })
    .on("error", (error) => {
      console.error("FFmpeg Error: ", error.message);

      io.emit("videoFormate:process:invalid", {
        message: "Video format process failed.",
        success: false,
      });

      if (fs.existsSync(videoFile.path)) fs.unlinkSync(videoFile.path);

      return res.status(500).json({
        message: "FFmpeg processing failed.",
        success: false,
        error: error.message,
      });
    })
    .run();
});

const compressVideo = asycnHandler(async (req, res) => {
  const videoFile = req.file;
  console.log(fs.existsSync(videoFile.path));

  try {
    const size = req.body.size || "1280x?";
    const fps = req.body.fps || 30;
    const videoCodec = req.body.videoCodec || "libx264";
    const formate = req.body.formate || "mp4";

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
    io.emit("resizeVideo:file:receive:valid", {
      message: "Video file received by server.",
      success: true,
    });
    const outputFile = `./public/compressed-video.${formate}`;

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
        console.log("URL : ", response?.secure_url);
        fs.existsSync(videoFile.path);
        fs.unlinkSync(videoFile.path);
        io.emit("resizeVideo:done", {
          message: "Video successfully compressed.",
          success: true,
        });
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
        console.error("Error : ", err);
        return res.status(500).json({
          message: "Video compressing process failed!",
          success: false,
          error: err.message,
        });
      })
      .save(outputFile);
  } catch (error) {
    console.error("Error:", error.message);
    fs.existsSync(videoFile.path);
    fs.unlinkSync(videoFile.path);
    return res.status(400).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
  // finally {
  //   fs.unlinkSync(videoFile.path);
  // }
});

const audioFromVideo = asycnHandler(async (req, res) => {
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
  const audioPath = `public/${videoFile.originalname.split(".")[0]}.mp3`;
  console.log(audioPath);

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
    .on("progress", (load) => {
      io.emit("audio:process:percentage", {
        percentage: load?.percent,
      });
    })
    .on("end", async () => {
      console.log("Audio extraction completed successfully.");
      // fs.unlinkSync(videoFile.path);
      const response = await uploadOnCloudinary(audioPath);
      console.log(response?.secure_url);
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
});

const dirname = path.join(import.meta.dirname, "../../../public");

const fetchaudio = asycnHandler(async (req, res) => {
  const user = req.user;
  const videoFile = req.file;
  if (videoFile) {
    io.emit("file:reached:valid", {
      message: "File uploaded successfully.",
      success: true,
    });
  } else {
    io.emit("file:reached:invalid", {
      message: "File upload failed.",
      success: false,
    });
  }
  const audioFormate = req.body.audioFormate || ".mp3";
  const outputFileName = `${videoFile?.originalname
    .split(".")[0]
    .concat(audioFormate)}`;
  const outputFile = `public/${outputFileName}`;
  ffmpeg(videoFile.path)
    .noVideo()
    .output(outputFile)
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
      io.emit("process:complete", {
        success: true,
        message: "File converted.",
      });
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
        if (fs.existsSync(videoFile.path)) fs.unlinkSync(videoFile.path);
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

const compress = asycnHandler(async (req, res) => {
  const user = req.user;
  const videoFile = req.file;
  const size = req.body.size || "1280x?";
  const fps = req.body.fps || 30;
  const videoCodec = req.body.videoCodec || "libx264";
  const formate = req.body.formate || ".mp3";

  // Validate video file
  if (videoFile) {
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
  const outputFileName = `${videoFile.originalname
    .split(".")[0]
    .concat(formate)}`;
  const localFile = `public/${outputFileName}`;
  const outputFile = `${dirname}/${outputFileName}`;
  ffmpeg(videoFile.path)
    .size(size)
    .fps(fps)
    .videoCodec(videoCodec)
    .outputOptions("-crf 26")
    .output(outputFile)
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
      io.emit("process:complete", {
        success: true,
        message: "File converted.",
      });
      res.sendFile(outputFile, async () => {
        io.emit("done", { success: true, message: "File Sent Successfully." });
        if (user) {
          const response = await uploadOnCloudinary(localFile);
          if (response.url) {
            io.emit("upload:on:cloud", {
              success: true,
              message: "File Uploaded on Cloud",
              url: response?.secure_url,
            });
          }
        }
        if (fs.existsSync(localFile)) fs.unlinkSync(localFile);
        if (fs.existsSync(videoFile.path)) fs.unlinkSync(videoFile.path);
      });
    })
    .on("error", (error) => {
      io.emit("failed", { success: false, message: "Process failed" });
      console.log(error);
    })
    .run();
});

const convertVideo = asycnHandler(async (req, res) => {
  const user = req.user;
  const videoFile = req.file;
  const formate = req.body.formate || ".mp4";

  if (videoFile) {
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
  const outputFileName = `${videoFile.originalname
    .split(".")[0]
    .concat(formate)}`;
  const localFile = `public/${outputFileName}`;
  const outputFile = `${dirname}/${outputFileName}`;
  ffmpeg(videoFile.path)
    .output(outputFile)
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
      return res.sendFile(outputFile, async () => {
        io.emit("done", { success: true, message: "File Sent Successfully." });
        if (user) {
          const response = await uploadOnCloudinary(localFile);
          if (response?.url) {
            io.emit("upload:on:cloud", {
              success: true,
              message: "File Uploaded on Cloud",
              url: response?.secure_url,
            });
          }
          console.log(response.url);
        }
        if (fs.existsSync(localFile)) fs.unlinkSync(localFile);
        if (fs.existsSync(videoFile.path)) fs.unlinkSync(videoFile.path);
      });
    })
    .on("error", (err) => {
      io.emit("failed", { success: false, message: "Process failed" });
      console.error("FFmpeg Error:", err.message);
    })
    .run();
});

const ytVideo = asycnHandler(async (req, res) => {
  const { link } = req.body;
  if (link) {
    io.emit("file:reached:valid", {
      message: "Link received.",
      success: true,
    });
  } else {
    io.emit("file:reached:invalid", {
      message: "Link Not received.",
      success: false,
    });
    return res.status(400).json({
      message: "Link file is required!",
      success: false,
    });
  }
  const outputDir = "./public";
  const command = `yt-dlp --print-json -o "${outputDir}/%(title)s.%(ext)s" ${link}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Error downloading video:", stderr);
      return res.status(500).json({ message: "Error downloading video" });
    }

    try {
      // Parse the JSON output to get the video title and extension
      const videoDetails = JSON.parse(stdout);
      const videoFilename = `${videoDetails.title}.${videoDetails.ext}`;
      const videoPath = path.join(dirname, videoFilename);

      console.log("Video downloaded:", videoPath);

      io.emit("process:began", {
        message: "Process Began with uplaoded resporces please wait......!",
        success: true,
      });
      res.sendFile(videoPath, async (err) => {
        io.emit("done", { success: true, message: "File Sent Successfully." });
        const response = await uploadOnCloudinary(
          `${outputDir}/${videoFilename}`
        );
        if (response?.url) {
          io.emit("upload:on:cloud", {
            success: true,
            message: "File Uploaded on Cloud",
            url: response?.secure_url,
          });
        }
        if (fs.existsSync(`./public/${videoFilename}`))
          fs.unlinkSync(`./public/${videoFilename}`);
        if (err) {
          res.status(500).json({ message: "Error sending video file" });
          io.emit("failed", { success: false, message: "Process failed" });
        }
      });
    } catch (parseError) {
      io.emit("failed", { success: false, message: "Process failed" });
      if (fs.existsSync(`./public/${videoDetails.title}.${videoDetails.ext}`))
        fs.unlinkSync(`./public/${videoDetails.title}.${videoDetails.ext}`);
      console.error("Error parsing JSON:", parseError);
      res.status(500).json({ message: "Error processing video details" });
    }
  });
});

export {
  videoFormate,
  ytUrl,
  compressVideo,
  audioFromVideo,
  fetchaudio,
  compress,
  convertVideo,
  ytVideo,
};
