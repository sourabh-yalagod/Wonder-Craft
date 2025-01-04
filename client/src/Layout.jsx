import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import SecureRouters from "./lib/SecureRouters";
import Services from "./pages/Services";

const App = lazy(() => import("./App"));
const Home = lazy(() => import("./pages/Services"));
const Subscription = lazy(() => import("./pages/Subscription"));
const VideoFromYTUrl = lazy(() => import("./pages/VideoFromYTUrl"));
const ResizeVideo = lazy(() => import("./pages/ResizeVideo"));
const ChangeVideoFormate = lazy(() => import("./pages/ChangeVideoFormate"));
const ConvertImageFormates = lazy(() => import("./pages/ConvertImageFormates"));
const AudioFromVideo = lazy(() => import("./pages/AudioFromVideo"));
const SignIn = lazy(() => import("./pages/auth/SignIn"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const Store = lazy(() => import("./pages/Store"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

function Layout() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/services" element={<Services />} />
      <Route path="/create-account" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/home" element={<Home />} />

      <Route element={<SecureRouters />}>
        <Route path="/store" element={<Store />} />
      </Route>
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
