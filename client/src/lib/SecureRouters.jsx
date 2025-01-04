import React from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
const SecureRouters = () => {
    const token = localStorage.getItem("token");
  //   const decoded = jwtDecode(token);
  //   const userId = decoded?.id;
  const userId = true;

  if (token) {
    return <Outlet />;
  } else {
    return <Navigate to={'/signin'} />
  }
};

export default SecureRouters;
