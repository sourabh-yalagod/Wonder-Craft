import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const videoFeatures = [
  {
    id: 1,
    title: "YT URL to Videos",
    img: "./images/video-transcoding.jpg",
    navigateTo: "/videos/ytURL-to-video",
    about:
      "Convert YouTube URLs into downloadable video formats quickly and easily.",
  },
  {
    id: 2,
    title: "Convert Video Formats",
    img: "./images/url-to-video.webp",
    navigateTo: "/videos/change-video-formate",
    about: "Change video formats to suit different devices and platforms.",
  },
  {
    id: 3,
    title: "Resize Video",
    img: "./images/videoCompressor.png",
    navigateTo: "/videos/resize-video",
    about: "Resize videos for optimal storage and playback efficiency.",
  },
  {
    id: 4,
    title: "Convert Image Format",
    img: "./images/shinchan.png",
    navigateTo: "/videos/convert-image-formate",
    about: "Convert images between different file formats seamlessly.",
  },
  {
    id: 5,
    title: "Audio from Video",
    img: "./images/video-transcoding.jpg",
    navigateTo: "/videos/audio-from-video",
    about: "Adjust image sizes for various digital and print requirements.",
  },
];

const Home = () => {
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const aboutTextVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="w-full min-h-screen py-10">
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.2 }}
        className="capitalize text-center font-semibold text-3xl pb-5"
      >
        All Wonder Craft services
      </motion.h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 px-5 w-full max-w-7xl">
        {videoFeatures.map((feature) => (
          <motion.div
            key={feature.id}
            onClick={() => navigate(feature.navigateTo)}
            style={{
              backgroundImage: `url(${feature.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="relative h-[250px] flex items-end transition-all duration-200 rounded-xl overflow-hidden cursor-pointer border border-gray-300 dark:border-gray-700"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              scale: 0.95,
              boxShadow: "0px 10px 15px black",
            }}
          >
            {/* Card Title */}
            <motion.p
              className="text-center font-sans font-semibold text-xl py-3 capitalize text-white bg-black bg-opacity-50 w-full"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {feature.title}
            </motion.p>

            {/* About Text with Slide Animation */}
            <motion.div
              className="absolute inset-y-0 left-0 z-20 bg-black bg-opacity-70 text-white px-4 py-2 rounded-t-lg"
              variants={aboutTextVariants}
              initial="hidden"
              whileHover="visible"
            >
              <p className="text-sm">{feature.about}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
