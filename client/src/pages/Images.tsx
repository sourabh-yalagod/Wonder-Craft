import { axiosInstance } from "@/lib/AxiosInstance";
import { useState } from "react";

const Images = () => {
  const [images, setImages] = useState<null | string | any>("");
  const handleImage = async () => {
    console.log(images);

    const form = new FormData();
    Array.from(images).forEach((image: any) => {
      form.append("images", image);
    });
    const { data } = await axiosInstance.post(
      "/api/images/change-formate",
      form
    );
    console.log(data);
  };
  return (
    <div>
      <input
        multiple
        type="file"
        onChange={(e: any) => setImages(e?.target?.files)}
      />
      <button onClick={handleImage}>Done</button>
    </div>
  );
};

export default Images;
