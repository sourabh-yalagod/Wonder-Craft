import axios from "axios";

const token: any = localStorage.getItem("token");
export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: token,
});
