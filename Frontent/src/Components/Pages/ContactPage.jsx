import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <motion.h1 
        className="text-3xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Contact Us
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center space-x-3">
            <FaMapMarkerAlt className="text-blue-600" size={20} />
            <p>123 Street Name, City, Country</p>
          </div>
          <div className="flex items-center space-x-3">
            <FaPhone className="text-blue-600" size={20} />
            <p>+123 456 7890</p>
          </div>
          <div className="flex items-center space-x-3">
            <FaEnvelope className="text-blue-600" size={20} />
            <p>contact@blogsite.com</p>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form 
          className="space-y-4"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <input 
            type="text" 
            placeholder="Your Name" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="email" 
            placeholder="Your Email" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea 
            rows="4" 
            placeholder="Your Message" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default ContactPage;
