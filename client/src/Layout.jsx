import { Route, Routes } from "react-router-dom";

import App from "./App";
import Home from "./pages/Home";
import Images from "./pages/Images";
import Videos from "./pages/Videos";
import Subscription from "./pages/Subscription";
import VideoFromYTUrl from "./pages/VideoFromYTUrl";
import ResizeVideo from "./pages/ResizeVideo";
import ChangeVideoFormate from "./pages/ChangeVideoFormate";
import ConvertImageFormates from "./pages/ConvertImageFormates";
import AudioFromVideo from "./pages/AudioFromVIdeo";

function Layout() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<Home />} />
      <Route path="/images" element={<Images />} />
      <Route path="/videos" element={<Videos />} />
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
