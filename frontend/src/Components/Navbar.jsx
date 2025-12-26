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
  const { userData, city } = useSelector((state) => state.user);
  useGetCity();
  const { myShopData } = useSelector((state) => state.owner);

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
      console.error(
        "Logout Error:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="w-full h-20 fixed top-0 z-[999] bg-[#fffcfb] shadow-sm flex justify-center">
      {/* Centered Container */}
      <div className="w-full max-w-7xl h-full flex items-center justify-between px-6 md:px-12">
        {/* Brand Logo */}
        {!isSearchOpen && (
          <h1
            className="text-2xl md:text-3xl font-extrabold text-[#ff4d2d] cursor-pointer shrink-0"
            onClick={() => navigate("/")}
          >
            TKT Food
          </h1>
        )}

        {/* Search Bar (Only for User) */}
        {userData?.role === "user" && (
          <div
            className={`${
              isSearchOpen ? "flex w-full" : "hidden md:flex"
            } items-center md:w-[45%] h-12 md:h-14 bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden mx-4`}
          >
            <div className="hidden lg:flex items-center gap-2 px-4 border-r border-gray-300 min-w-[140px]">
              <FaLocationDot size={16} className="text-[#ff4d2d]" />
              <span className="text-[13px] text-gray-600 font-bold truncate max-w-[100px]">
                {city || "Locating..."}
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 w-full">
              <FaSearch size={18} className="text-[#ff4d2d]" />
              <input
                type="text"
                placeholder="search delicious food..."
                className="w-full outline-none text-sm text-gray-700 bg-transparent"
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

        {/* Right Section */}
        {!isSearchOpen && (
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            {/* User Specific Icons */}
            {userData?.role === "user" && (
              <>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 md:hidden"
                >
                  <FaSearch size={20} className="text-gray-600" />
                </button>
                <div
                  className="relative cursor-pointer"
                  onClick={() => navigate("/cart")}
                >
                  <HiOutlineShoppingCart size={28} className="text-gray-700" />
                  <span className="absolute -top-1 -right-1 bg-[#ff4d2d] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    0
                  </span>
                </div>
              </>
            )}

            {/* Owner Specific Section */}
            {userData?.role === "owner" && (
              <div className="flex items-center gap-3">
                {/* 1. Add Food Item Button: Sirf tab dikhega jab shop create ho chuki ho */}
                {myShopData && (
                  <button className="flex items-center gap-2 p-2 px-4 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] font-bold text-sm hover:bg-[#ff4d2d]/20 transition-all">
                    <FaPlus size={18} />
                    <span className="hidden md:inline">Add food Item</span>
                  </button>
                )}

                {/* 2. My Orders Icon (Receipt) */}
                <div className="flex items-center gap-2 relative px-3 py-1 rounded-lg cursor-pointer text-gray-600 hover:text-[#ff4d2d] transition-colors">
                  <TbReceipt2 size={24} />
                  <span className="hidden md:inline font-bold text-sm">
                    My order
                  </span>
                  <span className="absolute -top-1 -right-1 bg-[#ff4d2d] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    0
                  </span>
                </div>
              </div>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              {userData ? (
                <div
                  className="w-10 h-10 bg-[#ff4d2d] text-white flex items-center justify-center rounded-full font-bold shadow-md uppercase cursor-pointer"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  {userData.Fullname.charAt(0)}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/signin")}
                  className="text-sm font-bold text-[#ff4d2d] hover:underline"
                >
                  Login
                </button>
              )}

              {showInfo && (
                <>
                  <div
                    className="fixed inset-0 z-[-1]"
                    onClick={() => setShowInfo(false)}
                  ></div>
                  <div className="absolute top-14 right-0 w-52 bg-white shadow-2xl rounded-2xl p-4 flex flex-col gap-3 border border-gray-50">
                    <div className="pb-2 border-b border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        Logged in as
                      </p>
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {userData?.Fullname}
                      </p>
                    </div>
                    <div className="p-2 hover:bg-gray-50 rounded-lg text-sm font-semibold text-gray-600 cursor-pointer">
                      Profile Settings
                    </div>
                    <div
                      className="p-2 hover:bg-red-50 rounded-lg text-sm font-bold text-[#ff4d2d] cursor-pointer"
                      onClick={handleLogout}
                    >
                      Log Out
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
