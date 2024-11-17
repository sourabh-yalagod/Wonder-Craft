import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthStatus";
import SideMenuBar from "./SideMenuBar";

const AppBar = () => {
  const isAuthenticated = useAuth();
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-between items-center fixed top-0 inset-x-0 p-3 rounded-b-md border-b">
      <SideMenuBar />
      <button
        onClick={() => navigate(isAuthenticated ? "/signout" : "/signin")}
        className={`px-2 py-1 rounded-lg text-center text-white ${
          isAuthenticated ? "bg-red-500" : "bg-blue-500"
        }`}
      >
        {isAuthenticated ? "Logout" : "LogIn"}
      </button>
    </div>
  );
};

export default AppBar;
