import React from "react";
import { Image, Video, Music, Combine } from "lucide-react";

const Section = ({ title, description, icon }) => {
  return (
    <div className="shadow-md dark:bg-slate-900 bg-slate-400 hover:scale-95 transition-all rounded-lg p-6 flex flex-col items-center text-center hover:bg-slate-500 cursor-pointer">
      {icon}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-xs">{description}</p>
    </div>
  );
};
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
        <Section
          title="Image Conversion"
          description="Easily convert images between formats like JPG, PNG, and WebP while
            maintaining quality."
          key={1}
          icon={<Image className="text-blue-500 text-5xl mb-4" />}
        />
        <Section
          title="Video Compression"
          description="Compress videos to reduce file sizes without compromising
            resolution."
          key={2}
          icon={<Combine className="text-blue-500 text-5xl mb-4" />}
        />
        <Section
          title="Video Conversion"
          description="Convert videos to popular formats like MP4, AVI, MOV, and more for
            compatibility."
          key={3}
          icon={<Video className="text-blue-500 text-5xl mb-4" />}
        />
        <Section
          title="Audio Extraction"
          description="Extract high-quality audio tracks from your video files in seconds."
          key={4}
          icon={<Music className="text-blue-500 text-5xl mb-4" />}
        />
      </div>

      {/* Video Demo Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-8">
          See Wonder Craft in Action
        </h2>
        <div className="flex justify-center">
          <img
            controls
            className="rounded-full hover:animate-pulse hover:scale-110 transition-all shadow-lg w-1/2 max-w-4xl border border-gray-200 dark:border-gray-700"
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
