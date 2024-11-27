import React, { useState } from "react";
import { saveAs } from "file-saver";
import { Edit } from "lucide-react";

const ReadyImage = ({ imagename = "image-1", link }) => {
  const handleDownload = () => {
    saveAs(link, rename ? rename : imagename);
    setInputBox(false);
  };
  const [rename, setRename] = useState();
  const [inputBox, setInputBox] = useState();
  return (
    <div
      key={Math.random()}
      className="flex-1 relative border flex w-full justify-between items-center p-2 rounded-lg hover:border-2"
    >
      {inputBox && (
        <input
          autoFocus
          value={rename || ""}
          className="left-[10%] w-[50%] sm:w-[30%] absolute bg-transparent outline-none border rounded-lg pl-2 p-1 px-3 text-sm -bottom-[60%]"
          type="text"
          placeholder="file name"
          onChange={(e) => setRename(e.target.value)}
        />
      )}
      <div className="flex items-center gap-3">
        <img
          className="w-10 h-6 sm:w-12 sm:h-8 md:w-14 md:h-10 lg:w-20 lg:h-14"
          src={link}
          alt="Image"
        />
        <p>{rename ? rename : imagename}</p>
        <div
          onClick={() => setInputBox(!inputBox)}
          className="flex items-center gap-1 border p-[2px] rounded-lg cursor-pointer"
        >
          <Edit className="size-4" />
          <p className="text-xs">Rename</p>
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="text-white text-[8px] sm:text-xs md:text-sm px-2 text-sm py-1 rounded-lg bg-blue-500"
      >
        Download
      </button>
    </div>
  );
};

export default ReadyImage;
