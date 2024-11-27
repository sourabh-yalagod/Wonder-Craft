import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth } from "./lib/auth.js";
export default function App() {
  const navigate = useNavigate();
  const autha =  auth();
  console.log(autha);

  return (
    <div className="flex flex-col items-center justify-center h-max bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-400 dark:from-gray-800 dark:via-gray-900 dark:to-blac p-4 absolute inset-0">
      {/* Header Section */}
      <motion.div
        className="text-center py-14"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.8, ease: "easeOut", damping: 20 }}
      >
        <h1 className="text-5xl font-bold tracking-wide mb-4">
          Welcome to Wonder Craft
        </h1>
        <p className="text-lg font-medium">
          The ultimate platform for seamless image and video conversion.
        </p>
      </motion.div>

      {/* Call-to-Action Section */}
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0.3,
          duration: 0.6,
          ease: "easeOut",
          delayChildren: 3,
        }}
      >
        <p className="text-center mb-6 text-lg flex-wrap">
          Explore the magic of Wonder Craft and transform your multimedia
          effortlessly.
        </p>
        <div className="flex justify-center gap-2 flex-wrap sm:gap-4 w-full">
          <motion.button
            onClick={() => navigate("/home")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-3 rounded-lg transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
          <motion.button
            onClick={() => navigate("/create-account")}
            className="bg-green-600 hover:bg-green-700 text-black font-semibold px-5 py-3 rounded-lg transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Account
          </motion.button>
          <motion.button
            onClick={() => navigate("/subscription")}
            className="bg-blue-600 hover:bg-blue-700 text-black font-semibold px-5 py-3 rounded-lg transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Subscription
          </motion.button>
        </div>
      </motion.div>

      {/* Animation Section */}
      <motion.div
        className="flex w-full items-center justify-around py-10"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <motion.img
          src="./images/shinchan.png"
          alt="Image and Video Conversion Graphic"
          className="w-64 h-64 md:w-80 md:h-80 object-contain rounded-full shadow-xl"
          whileHover={{ rotate: 10, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        />
        <motion.img
          src="./images/jerry.png"
          alt="Image and Video Conversion Graphic"
          className="w-64 h-64 md:w-80 md:h-80 sm:block hidden object-contain rounded-full shadow-xl"
          whileHover={{ rotate: 10, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        />
      </motion.div>
    </div>
  );
}
