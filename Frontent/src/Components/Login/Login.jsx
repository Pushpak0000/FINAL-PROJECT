import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Loader } from "lucide-react";
import { userStore } from "../../stores/userStore.js";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = userStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // console.log("Login submitted", formData);
      login(formData);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-600">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" 
            required 
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit" 
            className="w-full bg-purple-500 text-white font-bold py-3 rounded-lg hover:bg-purple-600 transition flex justify-center items-center cursor-pointer"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" size={20} /> : "Login"}
          </motion.button>
        </form>
        <p className="text-center text-gray-600 mt-4">Don't have an account? <Link to="/register" className="text-purple-500 hover:underline">Register</Link></p>
      </motion.div>
    </div>
  );
};

export default Login;