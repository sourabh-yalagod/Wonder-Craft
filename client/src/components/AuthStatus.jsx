// import { jwtDecode  } from "decode-jwt";
export const useAuth = () => {
  const token = localStorage.getItem("token");
  // const isTokenValid = jwtDecode(token);
  const isTokenValid = true;
  return isTokenValid;
};
