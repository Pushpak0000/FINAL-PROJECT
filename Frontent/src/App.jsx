import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import Layout from "./Layout.jsx";
import HomePage from "./Components/Pages/HomePage";
import BlogPostPage from "./Components/Pages/BlogPostPage.jsx";
import Login from "./Components/Login/Login.jsx";
import Register from "./Components/Register/Signup.jsx";
import NotFoundPage from "./Components/Pages/NotFoundPage.jsx";
import AboutPage from "./Components/Pages/AboutPage.jsx";
import ContactPage from "./Components/Pages/ContactPage.jsx";
import PrivacyPolicy from "./Components/Pages/PrivacyPolicy.jsx";
import SinglePage from './Components/Pages/SinglePage.jsx'
import { userStore } from "./stores/userStore.js";
import { useEffect } from "react";

function App() {
  const { user , checkAuth} = userStore(); // Get user state

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  return (
    <>
     <Routes>
  {/* Layout wrapper */}
  <Route path="/" element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="/post" element={user ? <BlogPostPage /> : <Navigate to="/login" />} />
    <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
    <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={user ? <ContactPage /> : <Navigate to="/login" />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/single-page/:id" element={user ? <SinglePage /> : <Navigate to="/login" />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
</Routes>

      {/* Toaster Notification */}
      <Toaster position="top" />
    </>
  );
}

export default App;
