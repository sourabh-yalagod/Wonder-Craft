import React, { useEffect, useState } from "react";
import ReadyImage from "@/components/ReadyImage";

import FormateOptions from "@/components/FormateOptions";

import { axiosInstance } from "@/lib/AxiosInstance";
import { useMutation } from "@tanstack/react-query";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Loader } from "lucide-react";
import { useSocket } from "../providers/Socket";
const Images = () => {
  const socket = useSocket();
  const [imageFormate, setImageFormate] = useState<any>(".jpeg");
  const [images, setImages] = useState<null | FileList>(null);
  const [responseUrls, setResponseUrls] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  console.log(imageFormate);

  const handleImage = async () => {
    setResponseUrls([])
    setLoading(true);
    const form = new FormData();
    Array.from(images || []).forEach((image) => {
      form.append("images", image);
      form.append("imageFormate", imageFormate);
    });

    const response = await axiosInstance.post(
      "/api/images/change-formate",
      form
    );
    setLoading(false);
    return response;
  };

  const handleConvertedImages = (data: any) => {
    const newImage = {
      name: data?.image?.original_filename,
      extension: data?.image?.formate,
      url: data?.image?.secure_url,
    };
    setResponseUrls((prev: any[]) => {
      if (Array.isArray(prev)) {
        return [...prev, newImage];
      }
      return [newImage]; // Initialize as an array if `prev` is undefined or not an array
    });
  };
  useEffect(() => {
    socket.on("image:converted", (data: any) => handleConvertedImages(data));
    return () => {
      socket.off("image:converted", (data: any) => handleConvertedImages(data));
    };
  }, [socket, handleConvertedImages,responseUrls]);

  const mutation = useMutation({
    mutationFn: handleImage,
    mutationKey: ["change-image-format"],
    onSuccess: (response) => {
      setResponseUrls(response.data.data);
      console.log("Image format changed successfully:", response.data.data);
    },
    onError: (error) => {
      console.error("Error changing image format:", error);
    },
  });

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const imagePromises: any = responseUrls?.map(async (image: any) => {
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
    <div className="w-full h-full px-5">
      <div className="border flex items-center justify-center p-4 rounded-xl space-x-2">
        <input
          multiple
          type="file"
          onChange={(e) => setImages(e.target.files)}
          className="file-input"
        />
        <button
          onClick={() => images && mutation.mutate()}
          className="text-white px-2 py-1 text-sm rounded-lg bg-blue-500 hover:bg-blue-600"
        >
          Upload Images
        </button>
      </div>
      <div className="flex justify-between my-4">
        <p>Total Images: {responseUrls?.length}</p>
        <button
          // disabled={responseUrls?.length !== 0}
          onClick={handleDownloadAll}
          className="text-white px-2 py-1 text-sm rounded-lg bg-blue-500 hover:bg-blue-600"
        >
          <p>
            {loading ? <Loader className="animate-spin" /> : "Download All"}
          </p>
        </button>
      </div>
      <FormateOptions setImageFormate={setImageFormate} />
      <div className="py-5 text-xs sm:text-sm md:text-[16px] w-full space-y-2">
        {responseUrls?.map((image: any, index: number) => (
          <ReadyImage
            imagename={`${image?.name
              ?.slice(0, 20)
              .concat("." + image?.extension)}`}
            link={image?.url}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Images;
