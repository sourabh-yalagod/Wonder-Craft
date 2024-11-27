import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSocket } from "../providers/Socket";
import Description from "@/components/Description";
import { motion } from "framer-motion";
import FormateOptions from "@/components/FormateOptions";
import ReactPlayer from "react-player";
const ChangeVideoFormate = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [progress, setProgress] = useState(0);
  const form = new FormData();
  const socket = useSocket();
  const [formate, setFormate] = useState(".mp4");
  console.log(formate);
  const handleVideoUrl = async (e) => {
    e.preventDefault();
    setErrors("");

    if (!videoFile) {
      setErrors("Video File required!");
      return;
    } else {
      form.append("video", videoFile[0]);
      form.append("formate", formate);
    }

    try {
      console.log(form);
      setLoading(true);
      setProgress(0);

      const response = await axios.post(
        `http://localhost:3000/api/videos/video-compressor`,
        form,
        {
          responseType: "blob",
        }
      );

      const blob = response.data;

      const link = URL.createObjectURL(blob);
      setUrl(link);
      localStorage.setItem("urls", link);
    } catch (error) {
      console.error(error);
      setErrors("Something went wrong while processing the video.");
    } finally {
      setLoading(false);
    }
  };
  console.log(progress);

  useEffect(() => {
    socket.on("videoFormate:file:receive:valid", () => setProgress(1));
    socket.on("videoFormate:file:receive:invalid", (data) => {
      setErrors(data.message);
      setProgress(-1);
    });
    socket.on("videoFormate:process:valid", () => setProgress(2));
    socket.on("videoFormate:process:invalid", (data) => {
      setErrors(data.message);
      setProgress(-2);
    });
    socket.on("videoFormate:sending:valid", () => setProgress(3));
    socket.on("videoFormate:sending:invalid", (data) => {
      setProgress(-3);
      setErrors(data.message);
    });
    socket.on("videoFormate:done", () => setProgress(4));

    return () => {
      socket.off("videoFormate:url:valid", () => setProgress(1));
      socket.off("videoFormate:url:invalid", (data) => {
        setErrors(data.message);
        setProgress(-1);
      });
      socket.off("videoFormate:videoDownlaod:valid", () => setProgress(2));
      socket.off("videoFormate:videoDownlaod:invalid", (data) => {
        setErrors(data.message);
        setProgress(-2);
      });
      socket.off("videoFormate:sendingVideo:valid", () => setProgress(3));
      socket.off("videoFormate:sendingVideo:invalid", (data) => {
        setProgress(-3);
        setErrors(data.message);
      });
      socket.off("videoFormate:done", () => setProgress(4));
    };
  }, [socket]);

  return (
    <div className="w-full p-4 sm:py-5">
      <h1 className="text-center font-semibold capitalize text-xl sm:text-2xl md:text-3xl">
        Upload and Video File
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
      <div className="py-5 relative flex items-center gap-4 text-xs sm:text-sm md:text-[15px]">
        <FormateOptions setFormate={setFormate} isVideoFormate={true} />
        {url && (
          <div>
            <p className="text-green-500">
              Your URL is ready Click on downlaod to get the Video.
            </p>
            <p className="absolute -bottom-2 left-3 text-slate-400 text-xs sm:text-sm ">
              Note :
              {
                " Video Fomate may OR may not Support the brower so try to download the video after process"
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
          <ReactPlayer
            // className="h-80 sm:h-[350px] md:h-[400px] rounded-md"
            height={"250px"}
            width={"300px"}
            url={url}
            controls
          />
          <a
            className="bg-blue-500 text-xs px-2 py-1 w-32 sm:text-sm md:text-[15px] text-center rounded-lg"
            download
            href={url}
          >
            Download
          </a>
        </motion.div>
      ) : (
        <Description
          heading={"Upload Video and Choose a formte to change Video Formate."}
          paragraph={
            "By default mp4 if you did'nt choosen any video formate and upload a valid video file."
          }
          img2="../images/youtubeIcon.png"
        />
      )}
    </div>
  );
};

export default ChangeVideoFormate;
