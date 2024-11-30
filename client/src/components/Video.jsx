import { Download } from "lucide-react";
import React from "react";

const Video = ({ url }) => {
  return (
    <div className="flex-1 relative border p-1 rounded-lg object-cover object-center">
      <video controls className="w-full" src={url} />
      <a href={url} download={url} className="absolute top-1 right-1">
        <Download />
      </a>
    </div>
  );
};

export default Video;
