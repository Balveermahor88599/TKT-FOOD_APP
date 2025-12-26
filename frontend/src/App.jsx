import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OwnerDashboard from "./Components/OwnerDashboard";
import DeliveryBoyDashboard from "./Components/DeliveryBoyDashboard";

import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
import useGetCity from "./hooks/useGetCity";

export const serverURL = "http://localhost:8000";

const App = () => {
  const dispatch = useDispatch();
  const { user, loading } = useGetCurrentUser(); 
  useGetCity();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      dispatch(setUserData(user));
    }
  }, [user, dispatch]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#fffcfb]">
        <div className="w-12 h-12 border-4 border-[#ff4d2d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/signup" element={!userData ? <Signup /> : <Navigate to="/" />} />
      <Route path="/signin" element={!userData ? <Signin /> : <Navigate to="/" />} />
      <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to="/" />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Main Home Route: Yahan se role decide hoga */}
      <Route 
        path="/" 
        element={
          !userData ? (
            <Navigate to="/signin" />
          ) : userData.role === "owner" ? (
            <OwnerDashboard /> 
          ) : userData.role === "delivery" ? (
            <DeliveryBoyDashboard />
          ) : (
            <Home /> 
          )
        } 
      />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;