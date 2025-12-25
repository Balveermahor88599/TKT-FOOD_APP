import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// --- Imports Cleaned ---

import Navbar from "./Components/Navbar";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
import useGetCity from "./hooks/useGetCity";

export const serverURL = "http://localhost:8000";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  const { user, loading } = useGetCurrentUser(); 
  useGetCity();
  
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      dispatch(setUserData(user));
    }
  }, [user, dispatch]);

  // Navbar hide karne ka logic
  const authPaths = ["/signin", "/signup", "/forgot-password"];
  const hideNavbar = authPaths.includes(location.pathname) || location.pathname.startsWith("/reset-password");

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#fffcfb]">
        <div className="flex flex-col items-center gap-4">
          {/* Custom Spinner */}
          <div className="w-12 h-12 border-4 border-[#ff4d2d] border-t-transparent rounded-full animate-spin"></div>
          <h1 className="text-xl font-bold text-[#ff4d2d]">TKT Food</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Persistent Navbar - Sirf Auth pages par hide hoga */}
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Protected Routes: Logged-in user yahan nahi ja sakta */}
        <Route path="/signup" element={!userData ? <Signup /> : <Navigate to="/" />} />
        <Route path="/signin" element={!userData ? <Signin /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to="/" />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Public/Home Route */}
        <Route path="/" element={<Home />} />
        
        {/* Redirect if Route not found */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;