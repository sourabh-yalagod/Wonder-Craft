import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Description from "@/components/Description";
import { axiosInstance } from "@/lib/AxiosInstance";
import { handledownload } from "../lib/HandleDownlaods";
import Progress from "../components/Progress";
const VideoFromYTUrl = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [progress, setProgress] = useState(0);

  const handleVideoUrl = async (e) => {
    e.preventDefault();
    setErrors("");

    if (!videoUrl) {
      setErrors("YouTube URL required!");
      toast.error("YouTube URL required!");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      const { data } = await axiosInstance.post(
        `/api/videos/url`,
        {
          link: videoUrl,
        },
        {
          responseType: "blob",
        }
      );
      console.log("URL : ", data);
      const link = URL.createObjectURL(data);
      console.log(link);
      setUrl(link);
    } catch (error) {
      console.error(error);
      setErrors("Something went wrong while processing the video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4">
      <h1 className="text-center py-10 font-semibold capitalize text-xl sm:text-2xl md:text-3xl">
        YouTube Video URL
      </h1>
      <Progress />
      <form onSubmit={handleVideoUrl} className="relative w-full">
        <input
          placeholder="YouTube URL"
          className="bg-transparent border p-2 rounded-lg w-full outline-none"
          type="text"
          onChange={(e) => {
            setErrors("");
            setVideoUrl(e.target.value);
          }}
        />
        <button
          className="absolute right-0 inset-y-0 bg-blue-600 text-white px-2 rounded-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Send"}
        </button>
        {errors && (
          <p className="text-red-500 text-xs sm:text-sm absolute left-2 mt-2">
            {errors}
          </p>
        )}
      </form>

      {url ? (
        <div className="w-full grid place-items-center gap-4 sm:grid-cols-2 px-3 sm:py-8 py-12">
          <video
            className="h-80 sm:h-[350px] md:h-[400px] rounded-md"
            controls
            src={url}
          />
          <button
            className="bg-blue-500 text-xs px-2 py-1 w-32 sm:text-sm md:text-[15px] text-center rounded-lg"
            onClick={() => handledownload(url)}
          >
            Download
          </button>
        </div>
      ) : (
        <Description
          heading={"Input the YouTube Video link"}
          paragraph={
            "copy and paste the youtube video link and wait for process."
          }
        />
      )}
    </div>
  );
};

export default VideoFromYTUrl;
