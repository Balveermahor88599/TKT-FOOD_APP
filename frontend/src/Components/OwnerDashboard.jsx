import React from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate()
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Main Container: pt-20 navbar ke liye aur flex-1 screen space bharne ke liye */}
      <div className="flex-1 flex justify-center items-center pt-20 p-4 sm:p-6">
        
        {!myShopData && (
          <div className="w-full max-w-md bg-white shadow-lg rounded-[2.5rem] p-10 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              
              {/* Icon Container with soft background */}
              <div className="w-24 h-24 bg-[#ff4d2d]/10 rounded-full flex items-center justify-center mb-6">
                <FaUtensils className="text-[#ff4d2d] text-4xl" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
                Add Your Restaurant
              </h2>
              
              <p className="text-gray-500 mt-3 font-medium">
                Create your shop profile to start receiving orders.
              </p>

              {/* Add Button Placeholder */}
              <button className="mt-8 w-full bg-[#ff4d2d] text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-200 hover:scale-[1.02] transition-transform" onClick={()=>navigate("/create-edit-shop")}>
                Get Started
              </button>

            </div>
          </div>
        )}

        {myShopData && (
          <div className="w-full max-w-7xl mx-auto pt-10 px-6">
            <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">
               {myShopData.name}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;