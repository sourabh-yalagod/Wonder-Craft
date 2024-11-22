import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Images from "./pages/Images";
import Videos from "./pages/Videos";
import Subscription from "./pages/Subscription";
function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/images" element={<Images />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/subscription" element={<Subscription />} />
    </Routes>
  );
}

export default App;
