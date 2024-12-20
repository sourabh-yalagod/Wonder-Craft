import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSocket } from "../providers/Socket";
import Description from "@/components/Description";
import { axiosInstance } from "@/lib/AxiosInstance";
import { handledownload } from "../lib/HandleDownlaods";
const VideoFromYTUrl = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [progress, setProgress] = useState(0);

  const socket = useSocket();

  const handleVideoUrl = async (e) => {
    e.preventDefault();
    setErrors("");

    if (!videoUrl) {
      setErrors("YouTube URL required!");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      const response = await axiosInstance.post(`/api/videos/yt-url`, {
        link: videoUrl,
      });
      console.log("URL : ", response.data);

      const link = response?.data?.url;
      setUrl(link);
      if (link) {
        setProgress(4);
      }
    } catch (error) {
      console.error(error);
      setErrors("Something went wrong while processing the video.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.on("ytUrl:url:valid", () => setProgress(1));
    socket.on("ytUrl:url:invalid", (data) => {
      setErrors(data.message);
      setProgress(-1);
    });
    socket.on("ytUrl:videoDownlaod:valid", () => setProgress(2));
    socket.on("ytUrl:videoDownlaod:invalid", (data) => {
      setErrors(data.message);
      setProgress(-2);
    });
    socket.on("ytUrl:sendingVideo:valid", () => setProgress(4));
    socket.on("ytUrl:sendingVideo:invalid", (data) => {
      setProgress(-3);
      setErrors(data.message);
    });

    return () => {
      socket.off("ytUrl:url:valid", () => setProgress(1));
      socket.off("ytUrl:url:invalid", (data) => {
        setErrors(data.message);
        setProgress(-1);
      });
      socket.off("ytUrl:videoDownlaod:valid", () => setProgress(2));
      socket.off("ytUrl:videoDownlaod:invalid", (data) => {
        setErrors(data.message);
        setProgress(-2);
      });
      socket.off("ytUrl:sendingVideo:valid", () => setProgress(4));
      socket.off("ytUrl:sendingVideo:invalid", (data) => {
        setProgress(-3);
        setErrors(data.message);
      });
    };
  }, [socket]);

  return (
    <div className="w-full px-4">
      <h1 className="text-center font-semibold capitalize text-xl">
        YouTube Video URL
      </h1>

      <div className="flex justify-between text-[9px] text-center py-5">
        <div
          className={`border p-1 rounded-full size-14 grid place-items-center ${
            progress >= 1 ? "bg-blue-600 transition-all duration-700" : ""
          } ${progress == -1 && "bg-red-600 transition-all duration-700"} 
          `}
        >
          Validate URL
        </div>
        <div
          className={`border p-1 rounded-full size-14 grid place-items-center ${
            progress >= 1 ? "bg-blue-600 transition-all duration-700" : ""
          } ${progress == -2 && "bg-red-600 transition-all duration-700"} 
          `}
        >
          Fetching Video
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
