import React, { useEffect, useState, useCallback } from "react"; 
import Navbar from "./Navbar";
import { useSelector, useDispatch } from "react-redux";
import { FaUtensils, FaMapMarkerAlt, FaPlus, FaEdit, FaStore } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import OwnerItemCart from "./OwnerItemCart";

const OwnerDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get(`${serverURL}/api/item/get-my-items`, { 
        withCredentials: true 
      });
      if (res.data.success) {
        setItems(res.data.items);
      }
    } catch (error) {
      console.error("Items fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItemFromUI = useCallback((id) => {
    setItems((prevItems) => prevItems.filter((item) => item._id !== id));
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      if (!myShopData) {
        try {
          const res = await axios.get(`${serverURL}/api/shop/get-my`, { 
            withCredentials: true 
          });
          if (res.data.success) {
            dispatch(setMyShopData(res.data.shop));
          } else {
            setLoading(false);
          }
        } catch (error) {
          console.error("Shop fetch error:", error);
          setLoading(false);
        }
      } 
      else {
        fetchItems();
      }
    };
    initializeData();
  }, [myShopData, dispatch, fetchItems]); 

  if (loading && !myShopData) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#ff4d2d] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#ff4d2d] font-bold animate-pulse text-lg tracking-widest uppercase">TKT Food Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#fafafa]">
      <Navbar />
      
      <div className="flex-1 pt-28 pb-20 p-4 sm:p-6 lg:p-12">
        {!myShopData ? (
          <div className="flex justify-center items-center h-[70vh]">
            <div className="text-center bg-white p-16 rounded-[4rem] shadow-2xl shadow-orange-100 border border-gray-50 max-w-lg">
              <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <FaStore className="text-5xl text-[#ff4d2d]" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">Setup Your Shop</h2>
              <p className="text-gray-500 mb-10 leading-relaxed text-lg font-medium">Bechne ke liye pehle apni dukan setup karein. Isme sirf 2 minute lagenge!</p>
              <button 
                onClick={() => navigate("/create-edit-shop")}
                className="w-full bg-gradient-to-r from-[#ff4d2d] to-[#ff7d2d] text-white py-5 rounded-[2rem] font-black text-xl hover:shadow-2xl hover:scale-105 transition-all active:scale-95 shadow-lg shadow-orange-200"
              >
                + Register Shop
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* Header / Hero Section */}
            <div className="relative group overflow-hidden bg-white rounded-[3.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row min-h-[350px]">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>

              <div className="md:w-2/5 h-64 md:h-auto overflow-hidden relative">
                <img 
                  src={myShopData.ImageUrl || "https://via.placeholder.com/600"} 
                  alt={myShopData.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
              
              <div className="p-10 md:p-14 md:w-3/5 flex flex-col justify-center relative z-10">
                <button 
                  onClick={() => navigate("/create-edit-shop")} 
                  className="absolute top-10 right-10 p-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-[#ff4d2d] hover:text-white transition-all duration-300 hover:shadow-xl active:scale-90"
                >
                  <FaEdit size={22} />
                </button>
                
                <div className="space-y-6">
                  <span className="bg-orange-100 text-[#ff4d2d] px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest">Store Profile</span>
                  <h1 className="text-4xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-[0.9]">
                    {myShopData.name}
                  </h1>
                  <div className="flex items-center text-gray-500 gap-3 font-semibold text-lg md:text-xl">
                    <div className="bg-[#ff4d2d] p-2 rounded-lg">
                      <FaMapMarkerAlt className="text-white" />
                    </div>
                    <span>{myShopData.address}, {myShopData.city}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 border-b border-gray-200 pb-8 px-4">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Your Culinary Menu</h2>
                <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">Manage your dishes and prices</p>
              </div>
              <button 
                className="w-full md:w-auto flex items-center justify-center gap-4 bg-black text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-[#ff4d2d] transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-orange-200 active:scale-95 group"
                onClick={() => navigate("/add-item")}
              >
                <FaPlus className="group-hover:rotate-180 transition-transform duration-500" /> Create New Dish
              </button>
            </div>

            {/* Items Grid */}
            {items.length === 0 ? (
              <div className="bg-white rounded-[4rem] p-32 text-center border-4 border-dashed border-gray-100 group">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <FaUtensils className="text-3xl text-gray-300" />
                </div>
                <p className="text-gray-400 text-2xl font-black italic tracking-tight">"A empty menu is a hungry menu."</p>
                <p className="text-gray-300 mt-2 font-bold uppercase text-sm">Add some delicious dishes now</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                 {items.map((item) => (
                    <OwnerItemCart 
                      key={item._id} 
                      item={item} 
                      removeItemFromUI={removeItemFromUI} 
                    />
                 ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;