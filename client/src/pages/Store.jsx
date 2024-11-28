import Image from "@/components/Image";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const Store = () => {
  const [images, setImages] = useState([null]);
  const [videos, setVideos] = useState([null]);
  const fetchAssets = async () => {
    const { data } = await axiosInstance.get(`/api/users/store`);
    return data;
  };

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
    staleTime: 5 * 60 * 1000,
  });
  useEffect(() => {
    const allImages = response?.assets?.filter((asset) => {
      return asset.images !== null || "";
    });
    const allVideos = response?.assets?.filter((asset) => {
      return asset.videos !== null || "";
    });
    setImages(allImages);
    setVideos(allVideos);
  }, [response]);

  return (
    <div className="w-full min-h-screen px-3">
      <div className="grid place-items-center space-y-2 py-4">
        <div className="w-52 h-52 rounded-full border">
          <h1 className="text-7xl flex justify-center items-center h-full">
            A
          </h1>
        </div>
        <div className="flex justify-between rounded-xl items-center w-full py-5 border p-2">
          <p>Username : sourabh</p>
          <p>UserID : urequoiqt</p>
        </div>
        <div className="grid w-full py-4 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images?.map((image, index) => {
            return (
              <Image
                key={index}
                name={`Image ${index + 1}`}
                url={image?.images}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Store;
