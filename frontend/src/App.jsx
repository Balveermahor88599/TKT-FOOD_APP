import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OwnerDashboard from "./Components/OwnerDashboard";
import DeliveryBoyDashboard from "./Components/DeliveryBoyDashboard";
import EditItem from "./pages/EditItem"; // 👈 1. Import EditItem

import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
import useGetCity from "./hooks/useGetCity";
import useGetMyShop from "./hooks/useGetMyShop";
import CreateEditShop from "./pages/CreateEditShop";
import Additem from "./pages/Additem";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemByCity from "./hooks/useGetItemByCity";
import CartPage from "./pages/CartPage";


export const serverURL = "http://localhost:8000";

const App = () => {
  const dispatch = useDispatch();
  const { user, loading } = useGetCurrentUser(); 
  useGetCity();
  useGetMyShop();
  useGetShopByCity()
  useGetItemByCity()
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
      
      {/* Protected Routes (Only for logged in users) */}
      <Route path="/create-edit-shop" element={userData ? <CreateEditShop /> : <Navigate to="/signin" />} />
      <Route path="/add-item" element={userData ? <Additem /> : <Navigate to="/signin" />} />
      <Route path="/cart" element={userData ? <CartPage /> : <Navigate to="/signin" />} />
      
      {/* 👈 2. Add Edit Item Route with Dynamic ID */}
      <Route 
        path="/edit-item/:itemId" 
        element={userData ? <EditItem /> : <Navigate to="/signin" />} 
      />



      {/* Main Home Route: Role-based logic */}
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
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;