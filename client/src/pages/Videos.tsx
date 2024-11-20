import axios from "axios";
import { useState } from "react";
import FileSaver from "file-saver";

const Videos = () => {
  const [videoLink, setVideoLink] = useState<null | string>("");
  const [response, setResponse] = useState<any>();
  const [progress, setProgress] = useState(0);

  const handleLink = async () => {
    setProgress(0); // Reset progress before starting
    let progressInterval;

    try {
      // Start a gradual progress increment every 100ms
      progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 1 : prev)); // Increase progress to 90%
      }, 300);

      const { data } = await axios.post(
        `http://localhost:3000/api/videos/downlaod-yt-video`,
        { link: videoLink }
      );
      setResponse(data);
    } catch (error) {
      console.error("Error downloading video:", error);
    } finally {
      // Clear interval and complete progress bar on response or error
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => setProgress(0), 500); // Optional: Reset progress bar after a short delay
    }
  };

  const handleDownload = async () => {
    try {
      const videoUrl = response?.url;
      const fileName = "downloaded_video.mp4";
      if (!videoUrl) {
        console.error("No video URL found");
        return;
      }

      const { data } = await axios.get(videoUrl, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });
      FileSaver.saveAs(data, fileName);
    } catch (error) {
      console.error("Error downloading video file:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center space-y-4">
      <div className="space-x-2">
        <input
          type="text"
          placeholder="Enter YouTube link"
          onChange={(e) => setVideoLink(e.target.value)}
          className="p-2 border rounded bg-transparent"
        />
        <button
          className="p-2 bg-green-600 rounded-lg text-white"
          onClick={handleLink}
        >
          Get Video
        </button>
      </div>

      {response?.url && (
        <div className="flex flex-col items-center space-y-2">
          <video
            controls
            className="w-64 h-36 rounded-lg"
            autoPlay
            src={response.url}
          />

          {/* Download button */}
          <button
            onClick={() => {
              videoLink && handleDownload();
            }}
            className="p-2 bg-blue-600 rounded-lg text-white text-center"
          >
            Download Video
          </button>
        </div>
      )}
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className={`bg-blue-600 h-4 rounded-full transition-all duration-300 ease-in-out ${progress && 'animate-pulse'}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Videos;
