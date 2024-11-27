import { motion } from "framer-motion";
import React from "react";

const Description = ({
  heading,
  paragraph,
  img1 = "../images/jerry.png",
  img2 = "../images/shinchan.png",
}) => {
  return (
    <div>
      <motion.div
        className="text-center py-14 mx-auto grid place-content-center px-3"
        initial={{ opacity: 0, y: "20rem" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeInOut", damping: 20 }}
      >
        <motion.h1
          transition={{ duration: 0.5, ease: "backOut", damping: 100 }}
          whileHover={{ scale: 1.1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-semibold"
        >
          {heading}
        </motion.h1>
        <motion.p
          transition={{ duration: 0.5, ease: "backOut", damping: 100 }}
          whileHover={{ scale: 1.1 }}
          className="text-xs py-5"
        >
          {paragraph}
        </motion.p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: "-20rem" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeInOut", damping: 2 }}
        className="flex w-full justify-around"
      >
        <img
          className="size-56 sm:size-60 sm:block hidden md:size-72 animate-icon"
          src={img1}
          alt={img1}
        />
        <motion.img
          animate={{ rotate: [0, -2, 2, -2, 0], x: [0, -3, 3, -4, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.2 }}
          className="size-52 sm:size-56 md:size-64 rounded-2xl"
          src={img2}
          alt={img2}
        />
      </motion.div>
    </div>
  );
};

export default Description;
