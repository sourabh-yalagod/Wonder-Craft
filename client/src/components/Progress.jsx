import React, { useEffect, useState } from "react";
import { useSocket } from "../providers/Socket";
import { File } from "lucide-react";
import { toast } from "sonner";
const Progress = () => {
  const socket = useSocket();
  const [progress, setProgress] = useState(0);
  const [per, setPer] = useState(0);

  useEffect(() => {
    socket.on("file:reached:valid", (data) => {
      console.log(data);
      setProgress(1);
    });
    socket.on("file:reached:invalid", (data) => {
      setProgress(-1);
    });
    socket.on("process:began", (data) => {
      setProgress(3);
    });
    socket.on("process:progress", (data) => {
      setPer(data.percentage);
    });
    socket.on("process:complete", (data) => {
      console.log(data);
    });
    socket.on("done", (data) => {
      setProgress(4);
      toast("Process successfull.......");
    });
    socket.on("failed", (data) => {
      toast.warning("failed");
      setProgress(0);
    });
  }, [socket]);

  return (
    <div className="flex justify-between text-[9px] text-center py-5">
      <div
        className={`border hover:scale-105 transition-all p-1 rounded-full size-14 grid place-items-center ${
          progress >= 1 ? "bg-blue-600 transition-all duration-700" : ""
        } ${progress == -1 && "bg-red-600 transition-all duration-700"} 
    `}
      >
        <File className="size-3" />
        <h1>File Upload</h1>
      </div>
      <div
        className={`border p-1 hover:scale-105 transition-all  rounded-full size-14 grid place-items-center ${
          progress >= 1 ? "bg-blue-600 transition-all duration-700" : ""
        } ${progress == -2 && "bg-red-600 transition-all duration-700"} 
    `}
      >
        {/* <Process className="size-3" /> */}
        Checking
      </div>
      <div
        className={`border p-1 hover:scale-105 transition-all  rounded-full size-14 grid place-items-center ${
          progress >= 1 ? "bg-blue-600 transition-all duration-700" : ""
        } ${progress == -3 && "bg-red-600 transition-all duration-700"} 
    `}
      >
        <h1>Processing</h1>
        {per ? <p className="text-[13px]">{per.toString().split('.')[0].concat('%')}</p> : ""}
      </div>
      <div
        className={`border p-1 hover:scale-105 transition-all  rounded-full size-14 grid place-items-center  ${
          progress == 4 && "bg-green-600 transition-all duration-700"
        }`}
      >
        Done
      </div>
    </div>
  );
};

export default Progress;
