import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSocket } from "../providers/Socket";
import Description from "@/components/Description";
import { motion } from "framer-motion";
import FormateOptions from "@/components/FormateOptions";
import ReactPlayer from "react-player";
import { axiosInstance } from "@/lib/AxiosInstance";
import SrcollMenu from "../components/ScrollMenu";
import { toast } from "sonner";

const fpsMenu = [
  { id: 1, value: 24, type: "FPS" },
  { id: 2, value: 30, type: "FPS" },
  { id: 3, value: 60, type: "FPS" },
  { id: 4, value: 120, type: "FPS" },
  { id: 5, value: 240, type: "FPS" },
];

const sizeMenu = [
  { id: 1, value: "426x240", type: "Resolution" },
  { id: 2, value: "640x360", type: "Resolution" },
  { id: 3, value: "854x480", type: "Resolution" },
  { id: 4, value: "1280x720", type: "Resolution" },
  { id: 5, value: "1920x1080", type: "Resolution" },
  { id: 6, value: "2560x1440", type: "Resolution" },
  { id: 7, value: "3840x2160", type: "Resolution" },
  { id: 8, value: "7680x4320", type: "Resolution" },
];

const videoCodecMenu = [
  { id: 1, value: "libx264", type: "Codec" },
  { id: 2, value: "libx265", type: "Codec" },
  { id: 3, value: "vp9", type: "Codec" },
  { id: 4, value: "libvpx", type: "Codec" },
  { id: 5, value: "mpeg4", type: "Codec" },
  { id: 6, value: "hevc", type: "Codec" },
  { id: 7, value: "libaom-av1", type: "Codec" },
  { id: 8, value: "prores", type: "Codec" },
  { id: 9, value: "dnxhd", type: "Codec" },
];

const ResizeVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [progress, setProgress] = useState(0);
  const form = new FormData();
  const socket = useSocket();
  const [formate, setFormate] = useState("mp4");
  const [size, setSize] = useState("1280x?");
  const [videoCodec, setVideoCodec] = useState("libx264");
  const [fps, setFps] = useState(30);
  const [processPercentage, setProcessPercentage] = useState(0);
  console.log("processPercentage : ", processPercentage);

  const handleVideo = async (e) => {
    setUrl("");
    e.preventDefault();
    setErrors("");

    if (!videoFile) {
      setErrors("Video File required!");
      return;
    } else {
      form.append("video", videoFile[0]);
      form.append("formate", formate);
      form.append("size", size);
      form.append("videoCodec", videoCodec);
      form.append("fps", fps);
    }
    console.log(form);
    
    try {
      console.log(form);
      setLoading(true);
      setProgress(0);

      const { data } = await axiosInstance.post(
        `/api/videos/video-compressor`,
        form
      );
      console.log("Reponse : ", data);
      setUrl(data?.url);
      if (data?.url) {
        setProgress(4);
      }
    } catch (error) {
      console.log(error);
      setErrors("Something went wrong while processing the video.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(errors){
      toast("errors");
    }
  }, [errors,setErrors]);
  useEffect(() => {
    socket.on("resizeVideo:file:receive:valid", () => setProgress(1));
    socket.on("resizeVideo:file:receive:invalid", (data) => {
      setErrors(data.message);
      setProgress(-1);
    });
    socket.on("resizeVideo:process:valid", () => setProgress(2));
    socket.on("resizeVideo:process:invalid", (data) => {
      setErrors(data.message);
      setProgress(-2);
    });
    socket.on("resizeVideo:sending:valid", () => setProgress(3));
    socket.on("resizeVideo:sending:invalid", (data) => {
      setProgress(-3);
      setErrors(data.message);
    });
    socket.on("resizeVideo:done", () => setProgress(4));
    socket.on("resizeVideo:process:percentage", (data) =>
      setProcessPercentage(data?.percentage)
    );

    return () => {
      socket.off("resizeVideo:file:receive:valid");
      socket.off("resizeVideo:file:receive:invalid");
      socket.off("resizeVideo:process:valid");
      socket.off("resizeVideo:process:invalid");
      socket.off("resizeVideo:sending:valid");
      socket.off("resizeVideo:sending:invalid");
      socket.off("resizeVideo:done");
      socket.off("resizeVideo:process:percentage");
    };
  }, [socket]);

  return (
    <div className="w-full p-4 sm:py-5">
      <motion.h1
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 2, delay: 1 }}
        className="text-center font-semibold capitalize text-xl sm:text-2xl md:text-3xl"
      >
        Upload and Video File
      </motion.h1>

      <div className="flex justify-between text-[9px] text-center py-5">
        <div
          className={`border p-1 rounded-full size-14 grid place-items-center ${
            progress >= 1 ? "bg-blue-600 transition-all duration-700" : ""
          } ${progress == -1 && "bg-red-600 transition-all duration-700"} 
          `}
        >
          Video Received
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

      <form onSubmit={handleVideo} className="relative w-full">
        <input
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
      <div className="py-5 relative space-y-4 gap-4 text-xs sm:text-sm md:text-[15px]">
        <div className="flex w-full items-center gap-3 flex-wrap">
          <FormateOptions setFormate={setFormate} isVideoFormate={true} />
          <SrcollMenu key="fps-menu" data={fpsMenu} setFormat={setFps} />
          <SrcollMenu key="size-menu" data={sizeMenu} setFormat={setSize} />
          <SrcollMenu
            key="codec-menu"
            data={videoCodecMenu}
            setFormat={setVideoCodec}
          />
          <div>
            {processPercentage != 0 && <p>Process : {processPercentage}%</p>}
          </div>
        </div>
        {url && (
          <div className="space-y-5">
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
          heading={"Upload Video for small video size"}
          paragraph={
            "Upload a video as a input and wait for the process and receive the output which is smaller in size."
          }
          img2="../images/youtubeIcon.png"
        />
      )}
    </div>
  );
};

export default ResizeVideo;
