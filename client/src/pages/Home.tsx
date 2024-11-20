import React, { useEffect, useState } from "react";
import { useSocket } from "../providers/Socket.jsx";
// Connect to your server's Socket.io instance

const Home = () => {
  const socket = useSocket();
  const [imageProgress, setImageProgress] = useState<any>([]);

  console.log("socket");
  useEffect(() => {
    socket.on("imageProgress", (data: any) => {
      console.log(data);

      setImageProgress((prevProgress: any) => [...prevProgress, data]);
    });
    return () => {
      socket.off("imageProgress");
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Real-Time Image Processing</h1>
      <ul className="list-disc pl-5">
        {imageProgress.length === 0 ? (
          <p>No images processed yet.</p>
        ) : (
          imageProgress.map((item: any, index: number) => (
            <li key={index} className="mb-2">
              <strong>Image:</strong> {item.image} - <strong>Status:</strong>{" "}
              {item.status}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Home;
