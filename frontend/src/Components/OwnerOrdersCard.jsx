import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MdPhone, MdEmail, MdLocationOn, MdFastfood, MdCheckCircle, MdCancel, MdTimer } from "react-icons/md";
import { FaCalendarAlt, FaShippingFast } from "react-icons/fa";
import axios from "axios";
import { serverURL } from "../App";
import { toast } from "react-hot-toast";

const OwnerOrdersCard = ({ data, reFetch }) => {
  const { userData } = useSelector((state) => state.user);
  const ownerId = userData?._id;

  const [currentStatus, setCurrentStatus] = useState(data?.status || "Pending");
  const [loading, setLoading] = useState(false);

  const orderTime = new Date(data?.createdAt).toLocaleString("en-IN", {
    hour: "2-digit", minute: "2-digit", day: "numeric", month: "short",
  });

  const mySpecificShopOrders = data?.shopOrders?.filter(
    (shop) => (shop.owner?._id || shop.owner) === ownerId
  );

  const handleStatusUpdate = async (nextStatus) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${serverURL}/api/order/update-status/${data._id}`,
        { status: nextStatus },
        { withCredentials: true }
      );

      if (res.data.success) {
        setCurrentStatus(nextStatus);
        toast.success(`Order is now ${nextStatus}`);
        if (reFetch) reFetch(); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed");
    } finally {
      setLoading(false);
    }
  };

  // Status mapping for visual cues
  const statusStyles = {
    Pending: { color: "bg-orange-50 text-orange-600 border-orange-100", icon: <MdTimer /> },
    Preparing: { color: "bg-blue-50 text-blue-600 border-blue-100", icon: <MdFastfood /> },
    "Out for Delivery": { color: "bg-purple-50 text-purple-600 border-purple-100", icon: <FaShippingFast /> },
    Delivered: { color: "bg-green-50 text-green-600 border-green-100", icon: <MdCheckCircle /> },
    Cancelled: { color: "bg-red-50 text-red-600 border-red-100", icon: <MdCancel /> },
  };

  if (!mySpecificShopOrders || mySpecificShopOrders.length === 0) return null;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 mb-8 hover:shadow-xl transition-all duration-300">
      
      {/* 1. Status Bar (Visual Progress) */}
      <div className="flex gap-1 mb-6">
        {["Pending", "Preparing", "Out for Delivery", "Delivered"].map((s, i) => (
          <div 
            key={i} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              ["Pending", "Preparing", "Out for Delivery", "Delivered"].indexOf(currentStatus) >= i 
              ? (currentStatus === "Cancelled" ? "bg-red-200" : "bg-[#ff4d2d]") 
              : "bg-gray-100"
            }`}
          />
        ))}
      </div>

      {/* 2. Customer Header */}
      <div className="flex justify-between items-start border-b border-gray-50 pb-5 mb-5">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-800 tracking-tighter uppercase italic">
            {data?.user?.Fullname}
          </h2>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${data?.user?.mobile}`} className="flex items-center gap-1.5 text-[12px] font-black text-[#ff4d2d] bg-orange-50 px-3 py-1 rounded-full hover:bg-[#ff4d2d] hover:text-white transition-colors">
              <MdPhone size={14}/> {data?.user?.mobile}
            </a>
          </div>
        </div>
        <div className="text-right">
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border mb-2 ${statusStyles[currentStatus]?.color}`}>
            {statusStyles[currentStatus]?.icon} {currentStatus}
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-end gap-1">
            <FaCalendarAlt size={10}/> {orderTime}
          </p>
        </div>
      </div>

      {/* 3. Items with Images */}
      <div className="grid gap-4 mb-6">
        {mySpecificShopOrders.map((shop) => (
          shop.shopOrderItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-50 p-4 rounded-[1.5rem] border border-gray-100 group transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                  <img src={item.item?.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className="font-black text-gray-800 text-base uppercase leading-tight">{item.name}</h4>
                  <p className="text-xs font-black text-[#ff4d2d] mt-1 bg-white inline-block px-2 py-0.5 rounded-lg shadow-sm">QTY: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-gray-800 tracking-tighter">₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))
        ))}
      </div>

      {/* 4. Footer & Actions */}
      <div className="pt-6 border-t-2 border-dashed border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-start gap-3 flex-1 bg-orange-50/30 p-4 rounded-[1.5rem] w-full border border-orange-100/30">
          <MdLocationOn className="text-[#ff4d2d] mt-1 shrink-0" size={24}/>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Deliver to</p>
            <p className="text-xs font-bold text-gray-600 italic leading-relaxed">{data?.deliveryAddress?.text}</p>
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto shrink-0">
          {loading ? (
            <div className="px-12 py-4 rounded-2xl bg-gray-100 text-gray-400 font-black text-xs animate-pulse uppercase tracking-widest">Updating...</div>
          ) : (
            <>
              {currentStatus === "Pending" && (
                <>
                  <button onClick={() => handleStatusUpdate("Cancelled")} className="flex-1 md:flex-none px-6 py-4 rounded-2xl text-[11px] font-black text-gray-400 hover:text-red-500 transition-all uppercase">Reject</button>
                  <button onClick={() => handleStatusUpdate("Preparing")} className="flex-1 md:flex-none px-10 py-4 rounded-2xl text-[11px] font-black bg-[#ff4d2d] text-white shadow-lg shadow-orange-100 hover:shadow-orange-300 uppercase active:scale-95 transition-all">Accept Order</button>
                </>
              )}
              {currentStatus === "Preparing" && (
                <button onClick={() => handleStatusUpdate("Out for Delivery")} className="w-full md:w-auto px-12 py-4 rounded-2xl text-[11px] font-black bg-blue-600 text-white shadow-lg shadow-blue-100 uppercase active:scale-95 transition-all">Ready for Delivery</button>
              )}
              {currentStatus === "Out for Delivery" && (
                <button onClick={() => handleStatusUpdate("Delivered")} className="w-full md:w-auto px-12 py-4 rounded-2xl text-[11px] font-black bg-green-600 text-white shadow-lg shadow-green-100 uppercase active:scale-95 transition-all">Complete Delivery</button>
              )}
              {(currentStatus === "Delivered" || currentStatus === "Cancelled") && (
                <div className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border ${statusStyles[currentStatus].color}`}>
                  {statusStyles[currentStatus].icon} Order {currentStatus}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerOrdersCard;