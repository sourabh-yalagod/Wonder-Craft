import React, { useEffect, useState } from "react";
import ReadyImage from "@/components/ReadyImage";
import FormateOptions from "@/components/FormateOptions";
import { useMutation } from "@tanstack/react-query";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Loader } from "lucide-react";
import { useSocket } from "../providers/Socket";
import axios from "axios";
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
  const [inputImageUrls, setInputImageUrls] = useState([]);
  const form = new FormData();
  const set = new Set();
  console.log(images?.length);

  const handleImage = async () => {
    setResponseUrls([]);
    if (images?.length > 1 && !auth()) {
      toast.warning("Log-In to process with more then 2 Images.....!");
      return;
    }
    Array.from(images || []).forEach((image) => {
      form.append("images", image);
      form.append("imageFormate", imageFormate);
    });
    if (auth()) {
      setLoading(true);
      const response = await axiosInstance.post(
        "/api/images/change-formate",
        form
      );
      setResponseUrls(response.data.data);
      setLoading(false);
    } else {
      setLoading(true);
      const response = await axiosInstance.post(
        "/api/images/change-formate",
        form,
        {
          responseType: "blob",
        }
      );
      const link = URL.createObjectURL(response.data);
      console.log(link);

      setResponseUrls([
        {
          url: link,
          name: "image",
          extension: imageFormate.split(".")[1],
        },
      ]);
      console.log(responseUrls);
      setLoading(false);
    }
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
          className="text-white px-2 py-1 text-[8px] sm:text-xs md:text-sm rounded-lg bg-blue-500 hover:bg-blue-600"
        >
          Upload Images
        </button>
      </div>
      <div className="flex justify-between my-4">
        <p>Total Images: {images?.length}</p>
        {responseUrls && (
          <button
            onClick={handleDownloadAll}
            className="text-white px-2 py-1 text-[8px] sm:text-sm rounded-lg bg-blue-500 hover:bg-blue-600"
          >
            <p>
              {loading ? <Loader className="animate-spin" /> : "Download All"}
            </p>
          </button>
        )}
      </div>
      <FormateOptions setFormate={setImageFormate} />
      <div className="py-5 text-xs sm:text-sm md:text-[16px] w-full space-y-2">
        {responseUrls
          ? responseUrls?.map((image, index) => {
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
          : Array.from(inputImageUrls || [])?.map((image, index) => {
              return (
                <ReadyImage
                  imagename={`Image ${index}`}
                  link={image?.url}
                  key={index}
                />
              );
            })}
      </div>
      <Description
        heading={"Covert Image to any Formate"}
        paragraph={
          "Create account for multiple image formate conversion at a time and Public URL.."
        }
        img1="../images/youtubeIcon.png"
      />
    </div>
  );
};

export default ConvertImageFormates;
