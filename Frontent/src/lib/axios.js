import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.MODE === "development" ? "http://localhost:3000/api" : "https://your-blog-4xnf.onrender.com/api",
  withCredentials:true
})

export default axiosInstance;