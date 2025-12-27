import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../App";
import { toast } from "react-hot-toast";

const AddItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("others");
  const [foodType, setFoodType] = useState("Veg");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = ['others', 'Snacks', 'Main Course', 'Beverages', 'Desserts', 'Pizza', 'Burgers', 'Sanwiches', 'South Indian', 'North Indian', 'Chinese', 'Italian', 'Mexican'];

  // Image Change Handler (Exactly same as your Shop logic)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("foodType", foodType);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post(`${serverURL}/api/item/add-item`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (res.data.success) {
        toast.success("Dish added successfully!");
        navigate("/owner-dashboard");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-6 bg-[#fffcfb] min-h-screen relative">
      {/* Back Button */}
      <div
        className="absolute top-6 left-6 cursor-pointer hover:scale-110 transition-transform"
        onClick={() => navigate(-1)}
      >
        <IoMdArrowRoundBack size={32} className="text-[#ff4d2d]" />
      </div>

      <div className="w-full max-w-lg bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[2.5rem] p-8 md:p-10 border border-gray-50 mt-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#ff4d2d]/10 rounded-full flex items-center justify-center mb-3">
            <FaUtensils className="text-[#ff4d2d] text-2xl" />
          </div>
          <h2 className="text-3xl font-black text-gray-800">Add Item</h2>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-600 ml-1">Dish Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Masala Dosa"
              className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#ff4d2d]"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          {/* Image Input (Same style as Shop) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-600 ml-1">
              Food Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ff4d2d]/10 file:text-[#ff4d2d] border border-gray-200 rounded-xl"
            />
          </div>

          {/* Image Preview Window */}
          <div className="w-full h-52 sm:h-64 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center gap-2">
                <FaUtensils size={30} className="opacity-20" />
                <span className="text-xs font-medium">No image selected</span>
              </div>
            )}
          </div>

          {/* Price and Type Row */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-600 ml-1">Price</label>
              <input
                required
                type="number"
                placeholder="₹"
                className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#ff4d2d]"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-600 ml-1">Food Type</label>
              <select 
                className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#ff4d2d]" 
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
              >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-600 ml-1">Category</label>
            <select 
              className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#ff4d2d]" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#ff4d2d] text-white font-bold py-4 rounded-xl mt-2 shadow-lg shadow-red-200 hover:bg-[#e64427] transition-all disabled:bg-gray-400"
          >
            {loading ? "Adding..." : "Add Item to Menu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;