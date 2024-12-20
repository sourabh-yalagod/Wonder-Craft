import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSocket } from "../providers/Socket";
import Description from "@/components/Description";
import { motion } from "framer-motion";
import { axiosInstance } from "@/lib/AxiosInstance";
import { handledownload } from "../lib/HandleDownlaods.js";
const form = new FormData();
const AudioFromVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [progress, setProgress] = useState(0);
  const socket = useSocket();
  const [processPercentage, setProcessPercentage] = useState(0);

  const handleVideoUrl = async (e) => {
    setUrl("");
    e.preventDefault();
    setErrors("");

    if (!videoFile) {
      setErrors("Video File required!");
      return;
    } else {
      form.append("video", videoFile[0]);
    }

    try {
      console.log(form);
      setLoading(true);
      setProgress(0);
      const response = await axiosInstance.post(
        `/api/videos/audio-from-video`,
        form
      );
      console.log(response.data.url);
      setUrl(response?.data?.url);
    } catch (error) {
      console.error(error);
      setErrors("Something went wrong while processing the video.");
    } finally {
      setLoading(false);
    }
  };
  // const handledownload = async (url) => {
  //   try {
  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch the file");
  //     }
  //     const audioBlob = await response.blob();
  //     saveAs(audioBlob, "audio.mp3");
  //   } catch (error) {
  //     console.error("Error downloading the file:", error);
  //   }
  // };

  useEffect(() => {
    socket.on("audio:videoFile:valid", () => setProgress(1));
    socket.on("audio:videoFile:invalid", (data) => {
      setErrors(data.message);
      setProgress(-1);
    });
    socket.on("audio:process:valid", () => setProgress(2));
    socket.on("audio:process:invalid", (data) => {
      setErrors(data.message);
      setProgress(-2);
    });
    socket.on("audio:sending:valid", () => setProgress(3));
    socket.on("audio:sending:invalid", (data) => {
      setProgress(-3);
      setErrors(data.message);
    });
    socket.on("audio:done", () => setProgress(4));
    socket.on("audio:process:percentage", (data) =>
      setProcessPercentage(data?.percentage)
    );

    return () => {
      socket.off("audio:videoFile:valid", () => setProgress(1));
      socket.off("audio:videoFile:invalid", (data) => {
        setErrors(data.message);
        setProgress(-1);
      });
      socket.off("audio:process:valid", () => setProgress(2));
      socket.off("audio:process:invalid", (data) => {
        setErrors(data.message);
        setProgress(-2);
      });
      socket.off("audio:sending:valid", () => setProgress(3));
      socket.off("audio:sending:invalid", (data) => {
        setProgress(-3);
        setErrors(data.message);
      });
      socket.off("audio:done", () => setProgress(4));
    };
  }, [socket]);
  
  return (
    <div className="w-full p-4 sm:py-5">
      <h1 className="text-center font-semibold capitalize text-xl sm:text-2xl md:text-3xl">
        Upload a Video File
      </h1>

      <div className="flex justify-between text-[9px] text-center py-5">
        <div
          className={`border p-1 rounded-full size-14 grid place-items-center ${
            progress >= 1 ? "bg-blue-600 transition-all duration-700" : ""
          } ${progress == -1 && "bg-red-600 transition-all duration-700"} 
          `}
        >
          Valid Video
        </div>
        <div
          className={`border p-1 rounded-full size-14 grid place-items-center ${
            progress >= 1 ? "bg-blue-600 transition-all duration-700" : ""
          } ${progress == -2 && "bg-red-600 transition-all duration-700"} 
          `}
        >
          Checking
        </div>
        <div
          className={`border p-1 rounded-full size-14 grid place-items-center ${
            progress >= 1 ? "bg-blue-600 transition-all duration-700" : ""
          } ${progress == -3 && "bg-red-600 transition-all duration-700"} 
          `}
        >
          Processing
        </div>
        <div
          className={`border p-1 rounded-full size-14 grid place-items-center  ${
            progress == 4 && "bg-green-600 transition-all duration-700"
          }`}
        >
          Done
        </div>
      </div>

      <form onSubmit={handleVideoUrl} className="relative w-full">
        <input
          placeholder="YouTube URL"
          className="bg-transparent border p-2 rounded-lg w-full outline-none"
          type="file"
          onChange={(e) => {
            setErrors("");
            setVideoFile(e.target.files);
          }}
        />
        <button
          className="absolute right-0 inset-y-0 bg-blue-600 text-white px-2 rounded-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Uplaod"}
        </button>
        {errors && (
          <p className="text-red-500 text-xs sm:text-sm absolute left-2 mt-2">
            {errors}
          </p>
        )}
      </form>
      {processPercentage != 0 && (
        <div className="text-center flex items-center gap-3 font-semibold text-sm p-3">
          Audio Processing : {processPercentage} %
        </div>
      )}
      <div className="py-5 relative flex items-center gap-4 text-xs sm:text-sm md:text-[15px]">
        {url && (
          <div>
            <p className="text-green-500">
              Your URL is ready Click on downlaod to get the Audio.
            </p>
            <p className="absolute -bottom-2 left-3 text-slate-400 text-xs sm:text-sm ">
              Note :
              {
                " Audio Fomate may OR may not Support the brower so try to download the audio after process completion."
              }
            </p>
          </div>
        )}
      </div>
      {url ? (
        <motion.div
          transition={{ bounce: 5 }}
          className="w-full grid place-items-center gap-4 sm:grid-cols-2 px-3 sm:py-8 py-12"
        >
          <audio src={url} controls loop />
          <button
            className="bg-blue-500 text-xs px-2 py-1 w-32 sm:text-sm md:text-[15px] text-center rounded-lg"
            onClick={() => handledownload(url, videoFile[0]?.name?.split(".")[0])}
          >
            Download
          </button>
        </motion.div>
      ) : (
        <Description
          heading={"Upload Video and get The Audio File"}
          paragraph={
            "By default mp4 audio file you get after process and make sure to upload video which had audio....!"
          }
          img2="../images/youtubeIcon.png"
        />
      )}
    </div>
  );
};

export default AudioFromVideo;
