import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: 'https://wonder-craft-server.onrender.com',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
