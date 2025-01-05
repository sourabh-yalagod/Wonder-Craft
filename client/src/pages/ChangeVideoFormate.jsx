import React, { useEffect, useState } from "react";
import axios from "axios";
import { AwardIcon, Loader2 } from "lucide-react";
import { useSocket } from "../providers/Socket";
import Description from "@/components/Description";
import { motion } from "framer-motion";
import FormateOptions from "@/components/FormateOptions";
import ReactPlayer from "react-player";
import { axiosInstance } from "@/lib/AxiosInstance";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import Progress from "../components/Progress";
const ChangeVideoFormate = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [progress, setProgress] = useState(0);
  const form = new FormData();
  const socket = useSocket();
  const [formate, setFormate] = useState("mp4");
  console.log(formate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      toast.error("Video File required . . . . !");
      return;
    }
    try {
      setLoading(true);
      const form = new FormData();
      form.append("video", videoFile[0]);
      form.append("formate", formate);
      const { data } = await axiosInstance.post("/api/videos/convertVideo", form, {
        responseType: "blob",
      });
      const link = URL.createObjectURL(data);
      console.log("Link : ", link);
      setUrl(link);
      if (link) {
        toast("Process successfull enjoy.");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.warning("Process failed");
    }
  };
  const handleVideoDownload = (url) => {
    saveAs(url, "Video");
  };
  return (
    <div className="w-full p-4 sm:py-5">
      <h1 className="text-center font-semibold capitalize text-xl sm:text-2xl md:text-3xl">
        Upload and Video File
      </h1>
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
          <button
            className="bg-blue-500 text-xs px-2 py-1 w-32 sm:text-sm md:text-[15px] text-center rounded-lg"
            onClick={() => handleVideoDownload(url)}
          >
            Download
          </button>
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
