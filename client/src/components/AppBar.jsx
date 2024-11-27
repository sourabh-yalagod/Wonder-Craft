import { useLocation, useNavigate } from "react-router-dom";
import SideMenuBar from "./SideMenuBar";
import { ArrowBigLeft, ArrowBigRight, Recycle } from "lucide-react";
import { ModeToggle } from "./ModeToggler";
import { auth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AppBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const handleAuth = () => {
    if (isAuthenticated) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      toast("user log-out successfully.", { duration: 1.5 });
    } else {
      navigate("/signin");
    }
  };

  useEffect(() => {
    setIsAuthenticated(auth());
  }, [handleAuth]);

  return (
    <div
      className={`w-full flex justify-between overflow-hidden z-20 ${
        location.pathname == "/"
          ? "bg-none border-none dark:bg-none"
          : "dark:bg-slate-950"
      } border items-center fixed top-0 inset-x-0 p-3 rounded-b-md dark:border-b`}
    >
      <div className="flex gap-3 items-center">
        <SideMenuBar />
        <Recycle
          onClick={() => navigate(0)}
          className="cursor-pointer active:animate-spin"
        />
      </div>
      <div className="flex gap-3 items-center">
        <ArrowBigLeft
          onClick={() => navigate(-1)}
          className="bg-slate-700 text-white rounded-full size-8 hover:size-9 transition-all p-1"
        />
        <ArrowBigRight
          onClick={() => navigate(1)}
          className="bg-slate-700 text-white rounded-full size-8 hover:size-9 transition-all p-1"
        />
      </div>
      <div className="flex gap-3 items-center">
        <ModeToggle />
        <button
          onClick={handleAuth}
          className={`px-2 py-1 rounded-lg text-center text-white ${
            isAuthenticated ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {isAuthenticated ? "Logout" : "LogIn"}
        </button>
      </div>
    </div>
  );
};

export default AppBar;
