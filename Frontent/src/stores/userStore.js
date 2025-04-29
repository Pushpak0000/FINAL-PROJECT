import {create} from 'zustand';
import axioss from '../lib/axios';
import {toast} from 'react-hot-toast';
import  axios  from 'axios';

export const userStore = create((set, get)=>({
  user:null,
  loading:false,
  checkingAuth:true,


  signup: async ({ userName, email, password }, navigate) => {
    set({ loading: true });
  
    try {
      const res = await axioss.post("/auth/signup", { userName, email, password });
  
      // set({ user: res.data, loading: false });
      toast.success(res.data.message);
  
      navigate("/login"); // ✅ Redirects to login page after signup
    } catch (error) {
      set({ loading: false });
  
      const errorMessage =
        error.response?.data?.error?.message || 
        error.response?.data?.message || 
        "Something went wrong, please try again";
      
      toast.error(errorMessage);
    }
  },
  

  login: async ({ email, password})=>{
    set({loading:true});

    try {
      const res = await axioss.post('/auth/login', { email, password});
      // console.log("res:",res.data.user);
      
      set({user: res.data, loading:false})
      toast.success(res.data.message)
      // alert(res.data.message);
      // console.log(res.data.message);
      
    } catch (error) {
      // console.log(error);
      set({loading:false});
      const errorMessage =
        error.response?.data?.error?.message || error.response?.data?.message  || "Something went wrong, please try again";
        // console.log(errorMessage);
        
      // alert(errorMessage)
      toast.error(errorMessage);
    }
  },

  logout: async () => {
    try {
      await axioss.post("/auth/logout", {}, { withCredentials: true }); // Ensure cookies are cleared
      set({ user: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during logout");
    }
  },
  

  checkAuth: async() =>{
    set({checkingAuth: true});

    try {
      const res = await axioss.get('/auth/profile');
      set({user:res.data, checkingAuth:false});
    } catch (error) {
      console.log(error.message);
      set({checkingAuth:false, user:null})
      
    }
  },

  refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
}));


axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Skip retrying the refresh-token endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        refreshPromise = userStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        userStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
