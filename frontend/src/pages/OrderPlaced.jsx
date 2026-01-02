import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaMapMarkerAlt, FaShoppingBag, FaReceipt } from 'react-icons/fa';
import Navbar from '../Components/Navbar';

const OrderPlaced = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Checkout page se bheja gaya data pakadne ke liye
  const orderSummary = location.state?.items || [];
  const totalAmount = location.state?.total || 0;

  const { address } = useSelector(state => state.map);
  const { userData } = useSelector(state => state.user);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 pt-28 pb-12">
        <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl shadow-orange-100 p-8 md:p-12 text-center border border-gray-50 animate-in fade-in zoom-in duration-700">
          
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
              <FaCheckCircle className="text-7xl text-green-500 relative z-10" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">ORDER SUCCESS!</h1>
          <p className="text-gray-500 text-lg font-medium mb-8">
            Hey {userData?.name}, order confirm ho gaya hai!
          </p>

          {/* --- ORDER SUMMARY SECTION --- */}
          <div className="bg-gray-50 rounded-[2rem] p-6 mb-8 text-left border border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-gray-400">
              <FaReceipt />
              <span className="font-black uppercase text-xs tracking-widest">Order Summary</span>
            </div>
            
            <div className="space-y-3">
              {orderSummary.length > 0 ? (
                orderSummary.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-gray-700 font-medium">
                    <p className="text-sm">
                      <span className="font-black text-[#ff4d2d] mr-2">{item.quantity}x</span> 
                      {item.name}
                    </p>
                    <p className="font-bold">₹{item.price * item.quantity}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic">Items details not available</p>
              )}
              
              <div className="border-t border-dashed border-gray-300 mt-4 pt-4 flex justify-between items-center">
                <span className="font-black text-gray-900 uppercase">Total Paid</span>
                <span className="text-2xl font-black text-[#ff4d2d]">₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
              <div className="flex items-center gap-3 mb-2 text-[#ff4d2d]">
                <FaMapMarkerAlt />
                <span className="font-black uppercase text-xs tracking-widest">Deliver To</span>
              </div>
              <p className="text-gray-600 text-xs font-bold leading-relaxed">
                {address || "Modinagar, UP"}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
              <div className="flex items-center gap-3 mb-2 text-blue-500">
                <FaShoppingBag />
                <span className="font-black uppercase text-xs tracking-widest">Status</span>
              </div>
              <p className="text-gray-600 text-sm font-bold">In Kitchen 👨‍🍳</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => navigate('/')} className="flex-1 bg-black text-white py-5 rounded-2xl font-black hover:bg-gray-800 transition-all">
              Home
            </button>
            <button onClick={() => navigate('/my-orders')} className="flex-1 bg-[#ff4d2d] text-white py-5 rounded-2xl font-black shadow-lg shadow-orange-200 hover:scale-105 transition-all">
              Track Order
            </button>   
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPlaced;