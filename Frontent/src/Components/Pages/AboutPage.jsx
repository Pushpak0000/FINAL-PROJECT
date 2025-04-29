import React from "react";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 text-center">
      <motion.h1 
        className="text-4xl font-bold mb-4 text-blue-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About Our Blog
      </motion.h1>
      
      <motion.p
        className="text-gray-700 text-lg mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Welcome to our blog! We share insightful articles on various topics, providing quality content to our readers. 
        Our goal is to inform, educate, and entertain with well-researched and engaging posts.
      </motion.p>
      
      <motion.img 
        src="https://media.istockphoto.com/id/618965280/vector/hand-drawn-lettering-word-smile.jpg?s=612x612&w=0&k=20&c=RGM_MxHXJGVMDwgvdvKICjR6ZTLMotokx911EOdgWqg=" 
        alt="Blogging"
        className="rounded-lg shadow-md mb-6 mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      />
      
      <motion.h2
        className="text-2xl font-semibold text-gray-800 mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Meet the Team
      </motion.h2>
      
      <motion.p
        className="text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Our team consists of passionate writers, tech enthusiasts, and creative minds dedicated to bringing you the best content.
      </motion.p>
    </div>
  );
};

export default AboutPage;
