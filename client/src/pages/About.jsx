import React from "react";
import { Image, Video, Music, Combine } from "lucide-react";

const About = () => {
  return (
    <section className="py-12 px-4 md:px-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          About Wonder Craft
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Wonder Craft helps you convert images, change video formats, compress
          videos, and extract audio from your videos with ease.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Feature 1: Image Conversion */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col items-center text-center">
          <Image className="text-blue-500 text-5xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Image Conversion
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Easily convert images between formats like JPG, PNG, and WebP while
            maintaining quality.
          </p>
        </div>

        {/* Feature 2: Video Compression */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col items-center text-center">
          <Combine className="text-green-500 text-5xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Video Compression
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Compress videos to reduce file sizes without compromising
            resolution.
          </p>
        </div>

        {/* Feature 3: Video Conversion */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col items-center text-center">
          <Video className="text-red-500 text-5xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Video Conversion
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Convert videos to popular formats like MP4, AVI, MOV, and more for
            compatibility.
          </p>
        </div>

        {/* Feature 4: Audio Extraction */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col items-center text-center">
          <Music className="text-purple-500 text-5xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Audio Extraction
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Extract high-quality audio tracks from your video files in seconds.
          </p>
        </div>
      </div>

      {/* Video Demo Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-8">
          See Wonder Craft in Action
        </h2>
        <div className="flex justify-center">
          <img
            controls
            className="rounded-lg shadow-lg w-1/2 max-w-4xl border border-gray-200 dark:border-gray-700"
            src="./images/0id0xes8.png"
          />
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Experience seamless multimedia conversions with{" "}
          <span className="font-semibold">Wonder Craft</span>.
        </p>
      </div>
    </section>
  );
};

export default About;
