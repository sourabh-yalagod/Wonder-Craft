import React, { useState } from "react";
import ReadyImage from "@/components/ReadyImage";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useMutation } from "@tanstack/react-query";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Images = () => {
  const [images, setImages] = useState<null | FileList>(null);
  const [responseUrls, setResponseUrls] = useState<null | string[]>();
  // Function to handle image upload
  const handleImage = async () => {
    const form = new FormData();
    Array.from(images || []).forEach((image) => {
      form.append("images", image);
    });

    const response = await axiosInstance.post(
      "/api/images/change-formate",
      form
    );
    return response;
  };

  // Mutation for uploading images
  const mutation = useMutation({
    mutationFn: handleImage,
    mutationKey: ["change-image-format"],
    onSuccess: (data) => {
      setResponseUrls(data.data.url);
      console.log("Image format changed successfully:", data.data.url);
    },
    onError: (error) => {
      console.error("Error changing image format:", error);
    },
  });

  // Function to download all images as a ZIP file
  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const imagePromises: any = responseUrls?.map(async (url) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const fileName = url.split("/").pop() || "image";
        zip.file(fileName, blob);
      } catch (error) {
        console.error(`Failed to download image from ${url}:`, error);
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
          onClick={handleDownloadAll}
          className="text-white px-2 py-1 text-sm rounded-lg bg-blue-500 hover:bg-blue-600"
        >
          Download All
        </button>
      </div>
      <div className="py-5 w-full space-y-2">
        {responseUrls?.map((url, index) => (
          <ReadyImage imagename={`Image ${index + 1}`} link={url} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Images;
