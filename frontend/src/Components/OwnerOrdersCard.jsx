import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdPhone, MdLocationOn } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { serverURL } from "../App";
import { toast } from "react-hot-toast";
import { updateOrderStatus } from "../redux/userSlice"; 

const OwnerOrdersCard = ({ data, reFetch }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const ownerId = userData?._id;

  // 1. Specific Shop Order nikalna
  const mySpecificShopOrder = data?.shopOrders?.find(
    (shop) => (shop.owner?._id || shop.owner) === ownerId
  );

  // 2. State ko Specific Shop ke status se initialize karein (data.status se nahi)
  const [currentStatus, setCurrentStatus] = useState(mySpecificShopOrder?.status || "pending");
  const [loading, setLoading] = useState(false);

  // Sync state if props change (Extra safety for re-fetch)
  useEffect(() => {
    if (mySpecificShopOrder?.status) {
      setCurrentStatus(mySpecificShopOrder.status);
    }
  }, [mySpecificShopOrder?.status]);

  const statusStyles = {
    pending: "border-black text-black",
    preparing: "border-blue-500 text-blue-600 bg-blue-50",
    "out for delivery": "border-purple-500 text-purple-600 bg-purple-50",
    delivered: "border-green-500 text-green-600 bg-green-50",
    cancelled: "border-red-500 text-red-600 bg-red-50",
  };

  const handleStatusChange = async (e) => {
    const nextStatus = e.target.value;
    const shopId = mySpecificShopOrder?.shop?._id || mySpecificShopOrder?.shop;

    try {
        setLoading(true);
        const res = await axios.put(
            `${serverURL}/api/order/update-status/${data._id}`,
            { status: nextStatus, shopId: shopId },
            { withCredentials: true }
        );

        if (res.data.success) {
            setCurrentStatus(nextStatus);
            // Redux store update
            dispatch(updateOrderStatus({
                orderId: data._id,
                shopId: shopId,
                status: nextStatus
            }));
            toast.success(`Status updated: ${nextStatus}`);
            // Agar reFetch pass kiya hai toh call karein
            if(reFetch) reFetch();
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Error updating status");
        console.error(error);
    } finally {
        setLoading(false);
    }
};

  if (!mySpecificShopOrder) return null;

  return (
    <div className="bg-white rounded-[2.2rem] shadow-md border border-gray-100 p-6 mb-8 max-w-2xl mx-auto transition-all">
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">
            {data?.user?.Fullname}
          </h2>
          <div className="bg-[#fff5f2] text-[#ff4d2d] px-3 py-1 rounded-full inline-flex items-center gap-2">
            <MdPhone size={14}/> 
            <span className="text-[11px] font-black tracking-widest">{data?.user?.mobile}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border-2 transition-all ${statusStyles[currentStatus] || 'border-gray-200'}`}>
            {currentStatus}
          </div>
          <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase flex items-center justify-end gap-1">
             <FaCalendarAlt size={10}/> {new Date(data?.createdAt).toLocaleString('en-IN', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit', hour12: true})}
          </p>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4 mb-6">
        {mySpecificShopOrder.shopOrderItems?.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between bg-[#f8fafc] p-4 rounded-[1.8rem] border border-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                <img src={item.item?.image} className="w-full h-full object-cover" alt={item.name}/>
              </div>
              <div>
                <h4 className="font-black text-gray-800 text-sm uppercase leading-tight">{item.name}</h4>
                <div className="bg-white px-2 py-0.5 rounded-lg text-[10px] font-black text-[#ff4d2d] border border-gray-100 shadow-sm mt-1 inline-block uppercase">
                  Qty: {item.quantity}
                </div>
              </div>
            </div>
            <p className="text-xl font-black text-gray-800 italic">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      {/* Delivery Address */}
      <div className="border-t border-dashed border-gray-200 pt-4 mb-6">
        <div className="flex items-start gap-2">
           <MdLocationOn className="text-[#ff4d2d] shrink-0 mt-0.5" size={18}/>
           <div>
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Deliver to</p>
             <p className="text-[11px] font-bold text-gray-600 italic leading-snug">{data?.deliveryAddress?.text}</p>
           </div>
        </div>
      </div>

      {/* Status Selector Dropdown */}
      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Current: <span className="text-[#ff4d2d]">{currentStatus}</span>
        </span>

        <select 
          value={currentStatus} 
          onChange={handleStatusChange}
          disabled={loading}
          className="rounded-lg border-2 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 ring-orange-100 border-[#ff4d2d] text-[#ff4d2d] font-black bg-white cursor-pointer disabled:opacity-50 transition-all uppercase tracking-tight"
        >
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out for delivery">Out Of Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
};

export default OwnerOrdersCard;