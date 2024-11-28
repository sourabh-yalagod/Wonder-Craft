import { saveAs } from "file-saver";
import { Download } from "lucide-react";
import React from "react";

const Image = ({ url, name }) => {
  const handleDownload = (url, name) => {
    saveAs(url, name);
  };
  return (
    <div
      style={{ backgroundImage: `url(${url})` }}
      className="flex-1 h-52 bg-center bg-cover relative object-cover rounded-xl p-2 hover:scale-95 transition-all"
    >
      <h2 className="absolute top-1 inset-x-0 text-center">{name}</h2>
      <a
        download={url}
        href={url}
        onClick={() => handleDownload(url, name)}
        className="w-8 h-8 grid place-items-center hover:bg-blue-800 transition-all size-6 rounded-lg bg-blue-700 absolute top-1 right-1"
      >
        <Download />
      </a>
    </div>
  );
};

export default Image;
