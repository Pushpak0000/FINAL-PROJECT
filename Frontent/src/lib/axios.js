import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `https://final-project-z6j6.onrender.com/api`,
  withCredentials:true,
})

export default axiosInstance;