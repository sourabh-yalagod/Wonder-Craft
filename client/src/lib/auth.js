import { jwtDecode } from "jwt-decode";
export const auth = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false
  }
  const currentTime = Date.now();
  const decodeToken = jwtDecode(token);
  const expiryTime = decodeToken?.exp * 1000;
  if (currentTime < expiryTime) {
    return true;
  } else {
    return false;
  }
};
