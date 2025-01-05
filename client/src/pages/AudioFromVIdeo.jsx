import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSocket } from "../providers/Socket";
import Description from "@/components/Description";
import ProgressBar from "../components/Progress";
import { motion } from "framer-motion";
import { axiosInstance } from "@/lib/AxiosInstance";
import { handledownload } from "../lib/HandleDownlaods.js";
import { toast } from "sonner";
const form = new FormData();
const AudioFromVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      toast.error("Video File required . . . . !");
      return;
    }
    setLoading(true);
    const form = new FormData();
    form.append("video", videoFile[0]);
    const { data } = await axiosInstance.post("/api/videos/audio-test", form, {
      responseType: "blob",
    });
    const link = URL.createObjectURL(data);
    console.log("Link : ", link);
    setLoading(false);
    if (link) {
      toast("Process successfull enjoy.");
    } else {
      toast.warning("Process failed");
    }
    setUrl(link);
  };

  return (
    <div className="w-full p-4 sm:py-5">
      <h1 className="text-center font-semibold capitalize text-xl sm:text-2xl md:text-3xl">
        Upload a Video File
      </h1>

      <ProgressBar />

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
            onClick={() =>
              handledownload(url, videoFile[0]?.name?.split(".")[0])
            }
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
