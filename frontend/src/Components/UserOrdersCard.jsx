import React from "react";

const UserOrdersCard = ({ data }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 hover:shadow-md transition-shadow">
      {/* 1. Header: Order ID & Date */}
      <div className="flex justify-between items-start border-b border-gray-50 pb-3">
        <div>
          <p className="font-black text-gray-800 uppercase tracking-tighter">
            Order <span className="text-[#ff4d2d]">#{data._id.slice(-6)}</span>
          </p>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Date: {formatDate(data.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase">
            {data.paymentMethod}
          </p>
          <p className="font-black text-sm text-green-600 mt-1 uppercase tracking-tight">
            {data.status || "Processing"}
          </p>
        </div>
      </div>

      {/* 2. Shop Orders Section */}
      {data.shopOrders.map((shopOrder, index) => (
        <div className="border border-orange-50 rounded-xl p-4 bg-[#fffcfb] space-y-3" key={index}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff4d2d]"></div>
            <p className="font-black text-sm text-gray-700 uppercase tracking-tight">
              {shopOrder.shop?.name || "Restaurant"}
            </p>
          </div>

          {/* Horizontal Scroll for Items */}
          <div className="flex space-x-3 overflow-x-auto pb-3 scrollbar-hide">
            {shopOrder.shopOrderItems.map((item, itemIdx) => (
              <div key={itemIdx} className="flex-shrink-0 w-36 border border-gray-100 rounded-xl p-2 bg-white shadow-sm">
                <img 
                  src={item.item?.image} 
                  alt={item.name} 
                  className="w-full h-20 object-cover rounded-lg mb-2" 
                />
                <p className="text-[11px] font-bold text-gray-800 truncate">
                  {item.name}
                </p>
                <p className="text-[10px] text-gray-500 font-bold mt-0.5">
                  Qty: {item.quantity} <span className="text-gray-300">|</span> ₹{item.price}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t border-orange-100 pt-2 px-1">
            <p className="text-xs font-black text-gray-500 uppercase">
              Subtotal: <span className="text-gray-800 font-black">₹{shopOrder.subtotal}</span>
            </p>
            <span className="text-[10px] font-black text-[#ff4d2d] bg-white px-3 py-1 rounded-full border border-orange-100">
              {data.status || "CONFIRMED"}
            </span>
          </div>
        </div>
      ))}

      {/* 3. Footer: Total & Actions */}
      <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-2">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grand Total</p>
          <p className="text-2xl font-black text-[#ff4d2d]">₹{data.totalAmount}</p>
        </div>
        <button className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-100 transition-all active:scale-95">
          Track Order
        </button>
      </div>
    </div>
  );
};

export default UserOrdersCard;