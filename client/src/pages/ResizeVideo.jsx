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
import Progress from "../components/Progress";
import { handledownload } from "../lib/HandleDownlaods";

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
  const [formate, setFormate] = useState(".mp4");
  const [size, setSize] = useState("1280x?");
  const [videoCodec, setVideoCodec] = useState("libx264");
  const [fps, setFps] = useState(30);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      toast.error("Video File required . . . . !");
      return;
    }
    setLoading(true);
    const form = new FormData();
    form.append("video", videoFile[0]);
    form.append("formate", formate);
    form.append("videoCodec", videoCodec);
    form.append("fps", fps);
    form.append("size", size);
    const { data } = await axiosInstance.post("/api/videos/compress", form, {
      responseType: "blob",
    });
    const link = URL.createObjectURL(data);
    console.log("Link : ", link);
    setLoading(false);
    setUrl(link);
    if (link) {
      toast("Process successfull enjoy.");
    } else {
      toast.warning("Process failed");
    }
  };
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
      <Progress />
      <form onSubmit={handleSubmit} className="relative w-full">
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
          <button
          className="bg-blue-600 p-1 rounded-xl px-2 hover:bg-blue-800 hover:scale-105 transition-all"
            onClick={() =>
              handledownload(
                url,
                videoFile[0]?.name?.split(".")[0]?.concat(formate)
              )
            }
          >
            Download
          </button>
          {/* <a
            className="bg-blue-500 text-xs px-2 py-1 w-32 sm:text-sm md:text-[15px] text-center rounded-lg"
            download
            href={url}
          >
            Download
          </a> */}
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
