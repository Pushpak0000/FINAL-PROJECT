import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.mode === "development" ? "http://localhost:3000/api" : `${import.meta.env.VITE_mode}/api`,
  withCredentials:true
})

export default axiosInstance;