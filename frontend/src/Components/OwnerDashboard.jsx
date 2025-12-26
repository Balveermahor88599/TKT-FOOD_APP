import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { useSelector, useDispatch } from "react-redux";
import { FaUtensils, FaMapMarkerAlt, FaPlus, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../App";
import { setMyShopData } from "../redux/ownerSlice";

const OwnerDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Data Persistence Logic: Refresh hone par database se data mangwana
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        // Aapka backend route '/get-my' hai, isliye yahan wahi use kiya hai
        const res = await axios.get(`${serverURL}/api/shop/get-my`, {
          withCredentials: true,
        });
        
        if (res.data.success) {
          // Data milte hi Redux mein save karein taaki UI update ho jaye
          dispatch(setMyShopData(res.data.shop));
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
      }
    };

    // Agar Redux mein data nahi hai (refresh hone par), tabhi API call karein
    if (!myShopData) {
      fetchShopData();
    }
  }, [dispatch, myShopData]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 pt-24 p-4 sm:p-6 lg:p-10">
        
        {/* Scenario 1: Agar Shop nahi mil rahi (Sirf tab dikhega jab data load ho raha ho ya shop na ho) */}
        {!myShopData && (
          <div className="flex justify-center items-center h-[70vh]">
            <div className="w-full max-w-md bg-white shadow-lg rounded-[2.5rem] p-10 border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-[#ff4d2d]/10 rounded-full flex items-center justify-center mb-6">
                  <FaUtensils className="text-[#ff4d2d] text-4xl" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-800">Add Your Restaurant</h2>
                <p className="text-gray-500 mt-3 font-medium">Create your shop profile to start receiving orders.</p>
                <button 
                  className="mt-8 w-full bg-[#ff4d2d] text-white font-bold py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform shadow-red-100" 
                  onClick={() => navigate("/create-edit-shop")}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scenario 2: Shop data mil gaya hai (Restaurant Details dikhayein) */}
        {myShopData && (
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            {/* Shop Profile Hero Card */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
                <img 
                  src={myShopData.ImageUrl} 
                  alt={myShopData.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 md:w-2/3 flex flex-col justify-center">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-4xl font-black text-gray-800 uppercase tracking-tight mb-2">
                      {myShopData.name}
                    </h1>
                    <div className="flex items-center text-gray-500 gap-2">
                      <FaMapMarkerAlt className="text-[#ff4d2d]" />
                      <span className="font-medium">{myShopData.address}, {myShopData.city}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate("/create-edit-shop")}
                    className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-[#ff4d2d] hover:text-white transition-all active:scale-90"
                  >
                    <FaEdit size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Food Items Header */}
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-black text-gray-800">Your Menu</h2>
              <button 
                className="flex items-center gap-2 bg-[#ff4d2d] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 shadow-red-200"
                onClick={() => navigate("/add-food-item")}
              >
                <FaPlus /> Add Item
              </button>
            </div>

            {/* Menu Items logic */}
            {!myShopData.items || myShopData.items.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-16 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-medium italic">Your menu is empty. Start adding delicious items!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Map your items here */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;