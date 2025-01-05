import React, { useEffect, useState } from "react";
import ReadyImage from "@/components/ReadyImage";
import FormateOptions from "@/components/FormateOptions";
import { Loader } from "lucide-react";
import { useSocket } from "../providers/Socket";
import { auth } from "@/lib/auth";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/AxiosInstance";
import Progress from "../components/Progress";

const ConvertImageFormates = () => {
  const [url, setUrl] = useState("");
  const [imageFormate, setImageFormate] = useState(".jpeg");
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const form = new FormData();

  const handleImage = async (e) => {
    e.preventDefault();
    if (!images) {
      toast.error("Image not Selected . . . . !");
      return;
    }
    setLoading(true);
    if (!images) {
      toast.warning("Log-In to process with more then 2 Images.....!");
      return;
    }
    form.append("image", images[0]);
    form.append("imageFormate", imageFormate);
    form.append("width", width);
    form.append("height", height);
    console.log(form);

    const { data } = await axiosInstance.post(
      "/api/images/change-formate",
      form,
      {
        responseType: "blob",
      }
    );
    const link = URL.createObjectURL(data);
    setUrl(link);
    setLoading(false);
  };

  return (
    <div className="w-full h-full px-5 py-10">
      <form
        onSubmit={handleImage}
        className="border flex items-center justify-around p-4 rounded-xl space-x-2"
      >
        <input
          type="file"
          onChange={(e) => setImages(e.target.files)}
          className="file-input"
        />
        <button
          type="submit"
          className="text-white px-2 py-1 transition-all text-[8px] sm:text-xs md:text-sm rounded-lg bg-blue-500 hover:bg-blue-600"
        >
          {loading ? <Loader className="animate-spin" /> : "Upload Images"}
        </button>
      </form>
      <Progress />
      <div>
        <div className="w-full sm:flex sm:space-y-0 space-y-3 p-2 gap-4 items-center border rounded-xl">
          <div className="flex w-full items-center gap-2 text-sm">
            <label>width </label>
            <input
              className="outline-none w-full"
              onChange={(e) => setWidth(e.target.value)}
              min={0}
              max={100}
              defaultValue={0}
              type="range"
            />
            <label>{width + "%"}</label>
          </div>
          <div className="flex w-full items-center gap-2 text-sm">
            <label>Height</label>
            <input
              defaultValue={0}
              className="outline-none w-full"
              onChange={(e) => setHeight(e.target.value)}
              min={0}
              max={100}
              type="range"
            />
            <label>{height}%</label>
          </div>
        </div>
        <FormateOptions setFormate={setImageFormate} />
      </div>
      <div className="py-5 text-xs sm:text-sm md:text-[16px] w-full space-y-2">
        {url && (
          <ReadyImage
            imagename={`${images[0]?.name?.split('.')[0].slice(0, 10).concat(imageFormate)}`}
            link={url}
            key={Math.random()}
          />
        )}
      </div>
    </div>
  );
};

export default ConvertImageFormates;
