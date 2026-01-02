import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserOrdersCard from "../Components/UserOrdersCard";
import OwnerOrdersCard from "../Components/OwnerOrdersCard";
import Navbar from "../Components/Navbar"; // Navbar zaroori hai

const MyOrder = () => {
  const { userData, myOrders } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 p-4 md:p-8 mt-20 flex justify-center font-sans">
        <div className="w-full max-w-[800px]">
          
          {/* Header */}
          <div className="flex items-center gap-[20px] mb-8">
            <div
              className="cursor-pointer bg-white p-2 rounded-full shadow-sm hover:scale-110 transition-transform border border-gray-100"
              onClick={() => navigate(-1)}
            >
              <IoMdArrowRoundBack size={24} className="text-[#ff4d2d]" />
            </div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">
              My Orders
            </h1>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {myOrders && myOrders.length > 0 ? (
              myOrders.map((order, index) => {
                // FIX: Yahan 'return' keyword add kiya gaya hai
                if (userData?.role === "user") {
                  return <UserOrdersCard data={order} key={order._id || index} />;
                } else if (userData?.role === "owner") {
                  return <OwnerOrdersCard data={order} key={order._id || index} />;
                }
                return null;
              })
            ) : (
              <div className="bg-white p-12 rounded-[2.5rem] text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">Koi orders nahi mile!</p>
                <button 
                  onClick={() => navigate("/")}
                  className="mt-4 text-[#ff4d2d] font-black text-sm uppercase tracking-widest hover:underline"
                >
                  Order Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrder;