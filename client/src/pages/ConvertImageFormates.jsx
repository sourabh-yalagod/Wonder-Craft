import React, { useEffect, useState } from "react";
import ReadyImage from "@/components/ReadyImage";
import FormateOptions from "@/components/FormateOptions";
import { useMutation } from "@tanstack/react-query";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Loader } from "lucide-react";
import { useSocket } from "../providers/Socket";
import axios from "axios";

const ConvertImageFormates = () => {
  const socket = useSocket();
  const [imageFormate, setImageFormate] = useState(".jpeg");
  const [images, setImages] = useState(null);
  const [responseUrls, setResponseUrls] = useState();
  const [loading, setLoading] = useState(false);
  const [inputImageUrls, setInputImageUrls] = useState([]);
  const form = new FormData();
  const set = new Set();
  const rawImages = new Set();
  console.log(imageFormate);

  const handleImage = async () => {
    Array.from(images || []).forEach((image) => {
      form.append("images", image);
      form.append("imageFormate", imageFormate);
    });
    setResponseUrls([]);
    setLoading(true);
    const response = await axios.post("/api/images/change-formate", form);
    setLoading(false);
    return response;
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

  const mutation = useMutation({
    mutationFn: handleImage,
    mutationKey: ["change-image-format"],
    onSuccess: (response) => {
      setResponseUrls(response.data.data);
      console.log("Image format changed successfully:", response.data);
    },
    onError: (error) => {
      console.error("Error changing image format:", error);
    },
  });

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
          onClick={() => images && mutation.mutate()}
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
          ? responseUrls?.map((image, index) => (
              <ReadyImage
                imagename={`${image?.name
                  ?.slice(0, 20)
                  .concat("." + image?.extension)}`}
                link={image?.url}
                key={index}
              />
            ))
          : Array.from(inputImageUrls || [])?.map((image, index) => {
              return (
                <ReadyImage
                  imagename={`Image ${index}`}
                  link={image}
                  key={index}
                />
              );
            })}
      </div>
    </div>
  );
};

export default ConvertImageFormates;
