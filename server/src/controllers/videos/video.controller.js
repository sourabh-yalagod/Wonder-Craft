import { asycnHandler } from "../../utilities/asyncHandler.js";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { uploadOnCloudinary } from "../../utilities/cloudinary.js";
import { io } from "../../../index.js";
import { clearDirectory } from "../../utilities/clearDirectory.js";
import { connectDB } from "../../db/index.js";

const ytUrl = asycnHandler(async (req, res) => {
  const { link } = req.body;
  console.log(link);

  if (!link) {
    return res
      .status(400)
      .json({ success: false, message: "Video URL required." });
  }

  let videoName = "video.mp4";
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const publicPath = path.join(__dirname, "../../../public");

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

    exec(
      `yt-dlp -f mp4 -o "${publicPath}/${videoName}" "${link}"`,
      async (error) => {
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
        res.sendFile(`${publicPath}/${videoName}`, (error) => {
          if (error) {
            io.emit("ytUrl:sendingVideo:invalid", {
              message: "Failed to send video",
              success: false,
            });
            return res
              .status(500)
              .json({ success: false, message: "Failed to send video" });
          }
          clearDirectory(publicPath);
          if (!error) {
            io.emit("ytUrl:sendingVideo:valid", {
              message: "Video sent successfully",
              success: true,
            });
          }
        });
      }
    );
  });
});

const videoFormate = asycnHandler(async (req, res) => {
  const user = req?.user;
  const viderFormate = req?.body?.formate || ".mp4";
  const videoFile = req.file;
  console.log(videoFile);
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

  const __dirname = fileURLToPath(import.meta.url);
  const publicPath = path.join(__dirname, "../../../../public");
  console.log(publicPath);
  const videoName = `${videoFile.filename.split(".")[0]}${viderFormate}`;
  const output = `./public/${videoName}`;

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
        clearDirectory(publicPath);
        return res.status(500).json({
          message: "Video format conversion failed",
          success: false,
          error: error.message || stderr,
        });
      } else {
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${videoName}"`
        );
        io.emit("videoFormate:sending:valid", {
          message: "processed video is being sent.",
          success: true,
        });
        if (user?.id) {
          try {
            const uploadVideo = await uploadOnCloudinary(output);
            console.log("Cloudinary URL: ", uploadVideo.secure_url);

            if (uploadVideo?.secure_url || uploadVideo?.url) {
              const db = await connectDB();
              const storeVideos = await db.query(
                `INSERT INTO assets (user_id, videos) VALUES ($1, $2)`,
                [user?.id, uploadVideo?.secure_url]
              );
              console.log("Stored video info: ", storeVideos?.fields);
              clearDirectory(publicPath);
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
          } catch (uploadError) {
            console.log("Upload Error : ", uploadError);
            clearDirectory(publicPath);
            io.emit("videoFormate:sending:invalid", {
              message: "Video formate failed.",
              success: false,
            });
            return res.status(500).json({
              message: "Failed to upload video to Cloudinary",
              success: false,
              error: uploadError.message || uploadError,
            });
          }
        } else {
          return res.sendFile(`${publicPath}/${videoName}`, (error) => {
            if (error) {
              console.log("Error sending file: ", error);
              io.emit("videoFormate:sending:invalid", {
                message: "Video formate failed.",
                success: false,
              });
            }
            if (!error) {
              io.emit("videoFormate:done:valid", {
                message: "Video formate process Done successfully.",
                success: true,
              });
            }
            clearDirectory(publicPath);
          });
        }
      }
    }
  );
});

const compressVideo = asycnHandler(async (req, res) => {
  try {
    const videoFile = req.file;

    if (!videoFile) {
      io.emit("resizeVideo:file:receive:invalid", {
        message: "video File failed to sent to server",
        success: false,
      });
      return res.json({
        message: "Video File required.....!",
        success: false,
      });
    }
    if (videoFile.path) {
      console.log(videoFile);

      io.emit("resizeVideo:file:receive:valid", {
        message: "video File received by server.",
        success: true,
      });
    }
    const __dirname = fileURLToPath(import.meta.url);
    const publicPath = path.join(__dirname, "../../../../public");
    console.log("publicPath : ", publicPath);

    const output = `compressed-video.mp4`;
    console.log("output : ", output);
    exec(
      `ffmpeg -i ${videoFile.path} -vcodec libx264 -crf 40 public/${output}`,
      async (error, stderr, stdout) => {
        if (stdout) {
          io.emit("resizeVideo:process:valid", {
            message: "The video process began.",
            success: true,
          });
        }
        console.log("STDOUT : ", stdout);

        if (error) {
          console.log(error);
          io.emit("resizeVideo:process:invalid", {
            message: "resizing the video process failed . . . . !",
            success: false,
          });
          clearDirectory(publicPath);
          return res.json({
            message: "Video Compressing Process failed......!",
            error,
          });
        } else {
          io.emit("resizeVideo:sending:valid", {
            message: "Processed video is being sent.",
            success: true,
          });
          res.sendFile(`${publicPath}/${output}`, (error) => {
            if (error) {
              io.emit("resizeVideo:sending:invalid", {
                message: "resized video failed to send to client . . . . !",
                success: true,
              });
              console.log(`Error : `, error);
            }
            if (!error) {
              io.emit("resizeVideo:done", {
                message: "Processed video sent successfully.",
                success: true,
              });
            }
            clearDirectory(publicPath);
          });
        }
      }
    );
  } catch (error) {
    return res.stauts(400).json({
      message: "something went wrong.",
      success: false,
    });
  }
});

const audioFromVideo = asycnHandler(async (req, res) => {
  console.log(req.user);

  try {
    const videoFile = req.file;

    if (!videoFile) {
      io.emit("audio:videoFile:invalid", {
        message: "Video file not received by server . . . . . . !",
        success: false,
      });
      return res.json({
        message: "Video File required . . . . !",
        success: false,
      });
    }
    if (videoFile.path) {
      io.emit("audio:videoFile:valid", {
        message: "Video file received by server successfully.=",
        success: true,
      });
    }

    const audioName = `audio${Math.random().toString().slice(2, 11)}.mp3`;
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const publicPath = path.join(__dirname, "../../../public");
    const audioPath = path.join(publicPath, audioName);
    const command = `ffmpeg -i "${videoFile.path}" -q:a 0 "./public/${audioName}"`;

    exec(command, (error, stderr, stdout) => {
      if (stdout) {
        io.emit("audio:process:valid", {
          message: "audio is extracting from video File.",
          success: true,
        });
      }
      if (error) {
        io.emit("audio:process:invalid", {
          message: "Audio from videoFile process is failed.....!",
          success: false,
        });
        console.error("ERROR:", error);
        clearDirectory(publicPath);
        return res.json({
          message: "Audio extraction from video failed.",
          error,
          success: false,
        });
      }
      if (!error) {
        io.emit("audio:sending:valid", {
          message: "audio file is sending from server to client.",
          success: true,
        });
        res.sendFile(audioPath, (sendError) => {
          if (sendError) {
            console.error("Send File Error:", sendError);
            io.emit("audio:sending:invalid", {
              message: "audio file failed to transfer file to client",
              success: false,
            });
          }
          if (!sendError) {
            io.emit("audio:done", {
              message: "audio file sent successfully.",
              success: true,
            });
          }
          clearDirectory(publicPath);
        });
      }
    });
  } catch (error) {
    return res.json({
      message: "Someting went wrong please try later or with other File.....!",
      error,
      success: false,
    });
  }
});

export { videoFormate, ytUrl, compressVideo, audioFromVideo };
