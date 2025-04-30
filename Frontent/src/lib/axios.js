import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `https://your-blog-yhz0.onrender.com/api`,
  withCredentials:true
})

export default axiosInstance;