import React, { useState } from "react";
import { FaLocationDot, FaPlus, FaXmark } from "react-icons/fa6";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { TbReceipt2 } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../App";
import { clearUserData } from "../redux/userSlice";
import useGetCity from "../hooks/useGetCity";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // States from Redux
  const { userData, currentCity, cartItems} = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);
  
  // Custom Hook to get location
  useGetCity();

  const [showInfo, setShowInfo] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${serverURL}/api/auth/signout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(clearUserData());
        setShowInfo(false);
        navigate("/signin");
      }
    } catch (error) {
      console.error("Logout Error:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="w-full h-20 fixed top-0 z-[999] bg-[#fffcfb] shadow-sm flex justify-center border-b border-gray-100">
      <div className="w-full max-w-7xl h-full flex items-center justify-between px-6 md:px-12">
        
        {/* Brand Logo */}
        {!isSearchOpen && (
          <h1
            className="text-2xl md:text-3xl font-black text-[#ff4d2d] cursor-pointer shrink-0 tracking-tighter italic"
            onClick={() => navigate("/")}
          >
            TKT Food
          </h1>
        )}

        {/* Search Bar (Only for User Role) */}
        {userData?.role === "user" && (
          <div
            className={`${
              isSearchOpen ? "flex w-full" : "hidden md:flex"
            } items-center md:w-[40%] h-12 md:h-14 bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden mx-4 px-4 transition-all`}
          >
            <div className="hidden lg:flex items-center gap-2 pr-4 border-r border-gray-200 min-w-[120px]">
              <FaLocationDot size={14} className="text-[#ff4d2d]" />
              <span className="text-[12px] text-gray-500 font-bold truncate max-w-[80px]">
                {currentCity || "Locating..."}
              </span>
            </div>
            <div className="flex items-center gap-3 w-full ml-2">
              <FaSearch size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search food, restaurants..."
                className="w-full outline-none text-sm text-gray-700 bg-transparent font-medium"
                autoFocus={isSearchOpen}
              />
              {isSearchOpen && (
                <FaXmark
                  className="md:hidden text-gray-400 cursor-pointer"
                  onClick={() => setIsSearchOpen(false)}
                />
              )}
            </div>
          </div>
        )}

        {/* Right Section (Action Icons) */}
        {!isSearchOpen && (
          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            
            {/* --- CUSTOMER (USER) ICONS --- */}
            {userData?.role === "user" && (
              <>
                <button onClick={() => setIsSearchOpen(true)} className="p-2 md:hidden">
                  <FaSearch size={20} className="text-gray-600" />
                </button>

                {/* My Orders (Customer) */}
                <div 
                  className="flex items-center gap-1 cursor-pointer group"
                  onClick={() => navigate("/my-orders")}
                >
                  <TbReceipt2 size={26} className="text-gray-600 group-hover:text-[#ff4d2d] transition-colors" />
                  <span className="hidden lg:inline font-bold text-xs text-gray-500 group-hover:text-gray-800 uppercase tracking-widest">My Order</span>
                </div>

                {/* Shopping Cart */} 
                <div className="relative cursor-pointer group" onClick={() => navigate("/cart")}>
                  <HiOutlineShoppingCart size={28} className="text-gray-600 group-hover:text-[#ff4d2d] transition-colors" />
                  {cartItems?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#ff4d2d] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-black animate-bounce">
                      {cartItems.length}
                    </span>
                  )}
                </div>
              </>
            )}

            {/* --- OWNER ICONS --- */}
            {userData?.role === "owner" && (
              <div className="flex items-center gap-3 md:gap-5">
                {myShopData && (
                  <button 
                    onClick={() => navigate("/add-item")}
                    className="flex items-center gap-2 p-2 px-5 rounded-full bg-[#ff4d2d] text-white font-black text-xs hover:bg-[#e64427] transition-all shadow-lg shadow-orange-100"
                  >
                    <FaPlus size={14} />
                    <span className="hidden md:inline">ADD DISH</span>
                  </button>
                )}

                {/* Shop Incoming Orders */}
                <div 
                  className="flex items-center gap-2 relative cursor-pointer group"
                  onClick={() => navigate("/my-orders")}
                >
                  <TbReceipt2 size={26} className="text-gray-600 group-hover:text-[#ff4d2d]" />
                  <span className="hidden md:inline font-black text-xs text-gray-500 group-hover:text-gray-800 uppercase tracking-widest">
                    Orders
                  </span>
                </div>
              </div>
            )}

            {/* Profile Section */}
            <div className="relative ml-2">
              {userData ? (
                <div
                  className="w-10 h-10 bg-gradient-to-br from-[#ff4d2d] to-[#ff7d2d] text-white flex items-center justify-center rounded-2xl font-black shadow-lg shadow-orange-100 uppercase cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  {userData.Fullname.charAt(0)}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/signin")}
                  className="bg-gray-100 text-gray-800 px-6 py-2 rounded-xl text-sm font-black hover:bg-[#ff4d2d] hover:text-white transition-all"
                >
                  LOGIN
                </button>
              )}

              {/* Profile Dropdown */}
              {showInfo && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setShowInfo(false)}></div>
                  <div className="absolute top-14 right-0 w-56 bg-white shadow-2xl rounded-[1.5rem] p-5 flex flex-col gap-3 border border-gray-50 animate-in fade-in slide-in-from-top-2">
                    <div className="pb-3 border-b border-gray-100">
                      <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Account</p>
                      <p className="text-sm font-black text-gray-800 truncate">{userData?.Fullname}</p>
                      <p className="text-[10px] text-gray-500 font-bold">{userData?.role.toUpperCase()} MODE</p>
                    </div>
                    <div className="p-2 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-600 cursor-pointer transition-colors">
                      Profile Settings
                    </div>
                    <div
                      className="p-3 bg-red-50 hover:bg-red-100 rounded-xl text-sm font-black text-[#ff4d2d] cursor-pointer text-center transition-colors"
                      onClick={handleLogout}
                    >
                      LOG OUT
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;