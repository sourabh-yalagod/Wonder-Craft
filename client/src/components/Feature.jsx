import React from "react";

const videoFeartures = [
  { id: 1, title: "YT URL to Videos", img: "" },
  { id: 2, title: "Change Video Formates", img: "" },
  { id: 3, title: "Video Compressor", img: "" },
];

function Feature({ page = "images" }) {
  return (
    <div className="w-full h-full">
      {page == "images" ? (
        <div>
          {videoFeartures.map((feature) => {
            return (
              <div
                key={feature.id}
                className="w-1/2 h-[250px] rounded-xl border-2"
              >
                <p>{feature.title}</p>
                <img src={feature.img} />
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Feature;
