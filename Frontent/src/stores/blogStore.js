import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from 'react-hot-toast';
import axios from "axios";

export const blogStor = create((set, get) => ({
  blogs: [],
  loading: true,
  singleBlog:null,
  setBlogs: ({title,body,image}) => set({ title,body,image }),
  comments:[],

  fetchBlogs: async () => {
    try {
      const res = await axiosInstance.get('/auth'); // adjust the route as per your backend
      set({ blogs: res.data.allBlog || [] , loading: false});
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
      set({ loading: false });
    }
  },

  createBlog: async ({ title, body, image }) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);
      formData.append("image", image); // ✅ the actual File object

      const res = await axiosInstance.post('/auth/post', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // console.log("blogs", res);
  
      set({
        blogs: [...get().blogs, res.data.blog] // ✅ check backend for correct key
      });
  
      toast.success(res.data.message || "Blog created successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Something went wrong, please try again";
  
      toast.error(errorMessage);
    }
  },

  fetchBlogById: async (id) => {
    set({ loading: true });
    try {
      const url =
        import.meta.env.MODE === "development"
          ? `http://localhost:3000/api/auth/single-page/${id}`
          : `https://your-blog-4xnf.onrender.com/api/auth/single-page/${id}`;

      const res = await axios.get(url, { withCredentials: true });
      // console.log("ressss: ",res);
      

      const blog = res.data.blog || res.data;
      const comments = res.data.comments || [];

      set({
        singleBlog: blog,
        comments:  comments, // ✅ correctly set it here
      });
    } catch (error) {
      console.error("Error fetching blog:", error);
      set({ singleBlog: null, comments: [] });
    } finally {
      set({ loading: false });
    }
  },
  

  deleteBlog: async (id) => {
    try {
      // console.log('delete ',id);
      const url =
      import.meta.env.MODE === "development"
        ? `http://localhost:3000/api/auth/${id}`
        : `https://your-blog-4xnf.onrender.com/api/auth/${id}`; // ✅ corrected
      
      
      const res =  await axios.delete(url, {withCredentials:true});
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog._id !== id),
        singleBlog: null,
      }));
      toast.success(res.data.message || "Blog created successfully");
    } catch (err) {
      console.error('Error deleting blog:', err);
      toast.error(res.data.message || "Error while deleting blog");
    }
  },

  addComment: async (id, blogId, message) => {
    try {
      const url = import.meta.env.MODE === "development"
        ? `http://localhost:3000/api/auth/comment`
        : `https://your-blog-4xnf.onrender.com/api/auth/comment`;
  
      const response = await axios.post(
        url,
        { userIdd: id, blogId, message },
        { withCredentials: true }
      );
  
      // console.log("Comment posted:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  },
  
  deleteComment: async (commentId) => {
    try {
      const url =
        import.meta.env.MODE === "development"
          ? `http://localhost:3000/api/auth/comment/${commentId}`
          : `https://your-blog-4xnf.onrender.com/api/auth/comment/${commentId}`;

      const response = await axios.delete(url, {
        withCredentials: true,
      });

      // console.log("✅ Comment deleted:", response.data);

      // Remove deleted comment from state
      set((state) => ({
        comments: state.comments.filter(
          (comment) => comment._id !== commentId
        ),
      }));
    } catch (error) {
      console.error("❌ Error deleting comment:", error.response?.data || error);
    }
  },
}));
