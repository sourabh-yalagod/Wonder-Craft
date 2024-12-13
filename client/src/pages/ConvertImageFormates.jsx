import React, { useEffect, useState } from "react";
import ReadyImage from "@/components/ReadyImage";
import FormateOptions from "@/components/FormateOptions";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Loader } from "lucide-react";
import { useSocket } from "../providers/Socket";
import { auth } from "@/lib/auth";
import { toast } from "sonner";
import Description from "@/components/Description";
import { axiosInstance } from "@/lib/AxiosInstance";

const ConvertImageFormates = () => {
  const socket = useSocket();
  const [imageFormate, setImageFormate] = useState(".jpeg");
  const [images, setImages] = useState(null);
  const [responseUrls, setResponseUrls] = useState();
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const form = new FormData();
  const set = new Set();

  const handleImage = async () => {
    setResponseUrls([]);
    if (images?.length > 1 && !auth()) {
      toast.warning("Log-In to process with more then 2 Images.....!");
      return;
    }
    Array.from(images || []).forEach((image) => {
      form.append("images", image);
      form.append("imageFormate", imageFormate);
      form.append("width", width);
      form.append("height", height);
    });
    setLoading(true);
    const response = await axiosInstance.post(
      "/api/images/change-formate",
      form
    );
    setResponseUrls(response.data.data);
    setLoading(false);
  };

  const handleConvertedImages = (data) => {
    const newImage = {
      name: data?.image?.original_filename,
      extension: data?.image?.formate,
      url: data?.image?.secure_url,
    };
    set.add(newImage);

    setResponseUrls((prev) => {
      if (Array.isArray(prev)) {
        return [set.entries];
      }
      return [set.entries];
    });
  };

  useEffect(() => {
    socket.on("image:converted", (data) => handleConvertedImages(data));
    return () => {
      socket.off("image:converted", (data) => handleConvertedImages(data));
    };
  }, [socket, handleConvertedImages, responseUrls]);

  const handleDownloadAll = async () => {
    console.log(responseUrls);
    if (!responseUrls?.length) return;
    const zip = new JSZip();
    const imagePromises = responseUrls?.map(async (image) => {
      console.log(image.url);

      try {
        const response = await fetch(image?.url);
        const blob = await response.blob();
        const fileName = (image?.name || "image") + imageFormate;
        zip.file(fileName, blob);
      } catch (error) {
        console.error(`Failed to download image from ${image?.url}:`, error);
      }
    });

    await Promise.all(imagePromises);
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "images.zip");
    });
  };

  return (
    <div className="w-full h-full px-5 py-10">
      <div className="border flex items-center justify-around p-4 rounded-xl space-x-2">
        <input
          multiple
          type="file"
          onChange={(e) => setImages(e.target.files)}
          className="file-input"
        />
        <button
          onClick={() => images && handleImage()}
          className="text-white px-2 py-1 transition-all text-[8px] sm:text-xs md:text-sm rounded-lg bg-blue-500 hover:bg-blue-600"
        >
          Upload Images
        </button>
      </div>
      <div className="flex justify-between my-4 border p-2 rounded-xl">
        <p>Total Images: {images?.length}</p>
        {images?.length ? (
          <div className="flex gap-2">
            <button
              onClick={handleDownloadAll}
              className="text-white px-2 py-1 text-[8px] sm:text-sm rounded-lg bg-blue-500 hover:bg-blue-600"
            >
              <p>
                {loading ? <Loader className="animate-spin" /> : "Download All"}
              </p>
            </button>
            {responseUrls?.length ? (
              <button
                onClick={() => {
                  setResponseUrls([]);
                  setImages("");
                }}
                className="text-white px-2 py-1 text-[8px] sm:text-sm rounded-lg bg-red-500 hover:bg-red-600"
              >
                Clear
              </button>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
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
        {responseUrls?.length ? (
          responseUrls?.map((image, index) => {
            console.log(image);

            return (
              <ReadyImage
                imagename={`${image?.name
                  ?.slice(0, 10)
                  .concat("." + image?.extension)}`}
                link={image?.url}
                key={index}
              />
            );
          })
        ) : (
          <Description
            heading={"Covert Image to any Formate"}
            paragraph={
              "Create account for multiple image formate conversion at a time and Public URL.."
            }
            img1="../images/youtubeIcon.png"
          />
        )}
      </div>
    </div>
  );
};

export default ConvertImageFormates;
