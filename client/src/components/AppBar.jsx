import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthStatus";
import SideMenuBar from "./SideMenuBar";
import { ArrowBigLeft, ArrowBigRight, Recycle } from "lucide-react";
import { ModeToggle } from "./ModeToggler";

const AppBar = () => {
  const isAuthenticated = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.pathname);

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
          onClick={() => navigate(isAuthenticated ? "/signout" : "/signin")}
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
