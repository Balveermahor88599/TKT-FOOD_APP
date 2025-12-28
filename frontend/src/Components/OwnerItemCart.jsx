import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverURL } from '../App';
import { toast } from 'react-hot-toast';

const OwnerItemCart = ({ item, removeItemFromUI }) => {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  console.log("1. Action Started for ID:", item._id);

  try {
    console.log("2. Sending Axios DELETE request...");
    const res = await axios.delete(`${serverURL}/api/item/delete-item/${item._id}`, {
      withCredentials: true,
    });

    console.log("3. Backend Response:", res.data);

    if (res.data.success) {
      toast.success("Deleted Successfully!");
      if (removeItemFromUI) removeItemFromUI(item._id);
    } else {
      console.error("4. Backend Success False:", res.data.message);
    }
  } catch (error) {
    console.error("5. Axios Catch Error:", error.response?.data || error.message);
    toast.error("Delete Failed!");
  }

  };

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3 relative">
      {/* Image aur Content ko pointer-events-none kar diya hai taaki click buttons tak pahuche */}
      <div className="pointer-events-none">
        <div className="w-full h-40 rounded-2xl overflow-hidden bg-gray-50">
          <img src={item.image || "https://via.placeholder.com/150"} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="px-1 mt-2">
          <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
          <p className="text-[#ff4d2d] font-black text-xl">₹{item.price}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-2" style={{ position: 'relative', zIndex: 9999 }}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/edit-item/${item._id}`, { state: { item } });
          }}
          className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold cursor-pointer border-none"
        >
          Edit
        </button>
        
        {/* Is button ko test karne ke liye humne ek dum simple rakha hai */}
        <button 
          type="button"
          onClick={handleDelete}
          style={{ 
            cursor: 'pointer', 
            backgroundColor: '#fef2f2', 
            color: '#ef4444', 
            width: '50px', 
            borderRadius: '12px',
            border: '1px solid #fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default OwnerItemCart;