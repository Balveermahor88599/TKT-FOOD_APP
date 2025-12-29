import React from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { removeCartItem, updateQuantity } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const CartItemCart = ({ data }) => {
  const dispatch = useDispatch();

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow border">
      <div className="flex items-center gap-4">
        <img
          src={data.image}
          alt={data.name}
          className="w-20 h-20 object-cover rounded-lg border"
        />
        <div className="font-bold text-lg text-gray-800">
          <h1>
            {data.name}
            <p className="text-sm text-gray-500">
              ₹{data.price} x {data.quantity}
            </p>
            <p className="font-bold text-gray-800">
              ₹{data.price * data.quantity}
            </p>
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* FIX: onClick mein arrow function use karein */}
        <button
          className="p-2 cursor-pointer rounded-full bg-gray-100 hover:bg-gray-300 transition"
          onClick={() => handleDecrease(data.id, data.quantity)}
        >
          <FaMinus size={12} />
        </button>

        <span>{data.quantity}</span>

        <button
          className="p-2 cursor-pointer rounded-full bg-gray-100 hover:bg-gray-300 transition"
          onClick={() => handleIncrease(data.id, data.quantity)}
        >
          <FaPlus size={12} />
        </button>

        <button
          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
          onClick={()=>dispatch(removeCartItem(data.id))}
        >
          <FaTrash size={15} />
        </button>
      </div>
    </div>
  );
};

export default CartItemCart;
