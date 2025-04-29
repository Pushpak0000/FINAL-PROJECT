import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-2xl font-bold">BlogSphere</h2>
          <p className="text-gray-400 mt-2 max-w-sm">
            Stay updated with the latest articles and insights from our expert writers.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center md:justify-start space-x-6 mb-6 md:mb-0">
          <Link to="/" className="text-gray-400 hover:text-white transition">Home</Link>
          <Link to="/about" className="text-gray-400 hover:text-white transition">About</Link>
          <Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link>
          <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link>
        </nav>

        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaFacebook className="text-2xl" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaTwitter className="text-2xl" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaInstagram className="text-2xl" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaLinkedin className="text-2xl" />
          </a>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-4 text-center">
        <p className="text-gray-400">&copy; {new Date().getFullYear()} BlogSphere. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
