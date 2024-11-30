import Image from "@/components/Image";
import Video from "@/components/Video";
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
    console.log("allVideos : ", allVideos);
    console.log("allImages : ", allImages);

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
        {images && (
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
        )}
        {videos && (
          <div className="w-full border-y py-7">
            <h1 className="font-semibold text-2xl">
              Browsers only support MP4 Videos
            </h1>
            <p className="text-sm text-slate-500">
              If you can't play the video don't worry you can download it.
            </p>
            <div className="grid w-full py-4 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {videos?.map((video, index) => {
                return <Video key={index} url={video?.videos} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
