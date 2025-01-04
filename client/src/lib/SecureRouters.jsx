import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const SecureRouters = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Outlet />;
  } else {
    return <Navigate to={"/signin"} />;
  }
};

export default SecureRouters;
