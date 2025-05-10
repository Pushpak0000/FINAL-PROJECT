import { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { userStore } from "../../stores/userStore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = userStore(); // `logout` function should be in `userStore`

  return (
    <nav className="bg-emerald-50 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold cursor-pointer">
          <img src="/logo.png" className="w-full h-10 md:h-10 object-cover rounded-lg"/>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center mx-auto">
          <NavLink to="/" className="text-black hover:text-amber-950">
            Home
          </NavLink>
          <NavLink to="/about" className="text-black hover:text-amber-950">
            About
          </NavLink>
          {user && (
            <>
              <NavLink to="/post" className="text-black hover:text-amber-950">
                Blog Post
              </NavLink>
              <NavLink to="/contact" className="text-black hover:text-amber-950">
                Contact
              </NavLink>
            </>
          )}
        </div>

        {/* Login / User Dropdown */}
        <div className="hidden md:flex items-center space-x-4 relative">
          {!user ? (
            <button className="px-4 py-2 bg-yellow-300 text-blue-600 font-bold rounded-lg hover:bg-yellow-400 transition cursor-pointer">
              <Link to="/login">Login</Link>
            </button>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="flex items-center space-x-2 cursor-pointer">
                <User size={28} className="text-black" />
              </div>

              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-0 w-40 bg-white shadow-md rounded-lg"
                >
                  <div className="p-3 text-center border-b">
                    <span className="font-semibold">{user.userName}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-red-600 hover:bg-red-100 transition"
                  >
                    <LogOut size={20} className="inline-block mr-2 cursor-pointer" />
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden flex flex-col space-y-4 bg-emerald-50 p-4 text-center"
          >
            <Link to="/" className="text-black hover:text-amber-950">
              Home
            </Link>
            <Link to="/about" className="text-black hover:text-amber-950">
              About
            </Link>
            {user && (
              <>
                <Link to="/post" className="text-black hover:text-amber-950">
                  Post
                </Link>
                <Link to="/contact" className="text-black hover:text-amber-950">
                  Contact
                </Link>
              </>
            )}
            {!user ? (
              <button className="mt-4 px-4 py-2 bg-yellow-300 text-blue-600 font-bold rounded-lg hover:bg-yellow-400 transition cursor-pointer">
                <Link to="/login">Login</Link>
              </button>
            ) : (
              <button
                onClick={logout}
                className="mt-4 text-white hover:text-gray-200 flex items-center justify-center"
              >
                <LogOut size={24} />
                <span className="ml-2">Logout</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
