import { Route, Routes } from "react-router-dom";

import App from "./App";
import Home from "./pages/Home";
import Subscription from "./pages/Subscription";
import VideoFromYTUrl from "./pages/VideoFromYTUrl";
import ResizeVideo from "./pages/ResizeVideo";
import ChangeVideoFormate from "./pages/ChangeVideoFormate";
import ConvertImageFormates from "./pages/ConvertImageFormates";
import AudioFromVideo from "./pages/AudioFromVIdeo";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Store from "./pages/Store";
import About from "./pages/About";
import Contact from "./pages/Contact";

function Layout() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/create-account" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/home" element={<Home />} />
      <Route path="/store" element={<Store />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/videos/ytURL-to-video" element={<VideoFromYTUrl />} />
      <Route
        path="/videos/change-video-formate"
        element={<ChangeVideoFormate />}
      />
      <Route
        path="/videos/convert-image-formate"
        element={<ConvertImageFormates />}
      />
      <Route path="/videos/audio-from-video" element={<AudioFromVideo />} />
      <Route path="/videos/resize-video" element={<ResizeVideo />} />
      <Route path="/subscription" element={<Subscription />} />
    </Routes>
  );
}

export default Layout;
