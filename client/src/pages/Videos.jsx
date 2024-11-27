import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const videoFeatures = [
  {
    id: 1,
    title: "YT URL to Videos",
    img: "./images/video-transcoding.jpg",
    navigateTo: "ytURL-to-video",
  },
  {
    id: 2,
    title: "Change Video Formats",
    img: "./images/url-to-video.webp",
    navigateTo: "video-formate",
  },
  {
    id: 3,
    title: "Video Compressor",
    img: "./images/videoCompressor.png",
    navigateTo: "compress-video",
  },
];

function Video() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-full py-8">
      {location.pathname === "/videos" ? (
        <div className="w-full grid sm:grid-cols-2 gap-6 md:grid-cols-3 relative py-16 md:py-20 px-10 sm:px-0">
          <h1 className="text-center font-semibold text-2xl absolute inset-x-0 sm:text-3xl md:text-4xl">
            Video Options in Wonder Craft
          </h1>
          {videoFeatures.map((feature) => (
            <div
              onClick={() => navigate(feature.navigateTo)}
              key={feature.id}
              style={{
                backgroundImage: `url(${feature.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundBlendMode: "darken",
              }}
              className="h-[250px] mx-3 flex-1 rounded-xl border-2 hover:scale-95 transition-all hover:shadow-[0.1px_0.1px_15px_1px_black] hover:dark:shadow-[0.1px_0.1px_15px_1px_yellow] flex justify-center items-end"
            >
              <p className="text-center font-sans font-semibold flex-1 text-xl py-3 capitalize text-white bg-black bg-opacity-50 rounded-md px-4">
                {feature.title}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}

export default Video;
