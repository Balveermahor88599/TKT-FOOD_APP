import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverURL } from "../App";
import { setMyShopData } from "../redux/ownerSlice";

const CreateEditShop = () => {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  const { currentCity, currentState, currentAddress } = useSelector(
    (state) => state.user
  );

  // Form States
  const [name, setName] = useState(myShopData?.name || "");
  const [address, setAddress] = useState(
    myShopData?.address || currentAddress || ""
  );
  const [city, setCity] = useState(myShopData?.city || currentCity || "");
  const [state, setState] = useState(myShopData?.state || currentState || "");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    myShopData?.ImageUrl || null
  );
  const dispatch=useDispatch()
  const [loading, setLoading] = useState(false);
  // const handleImage=(e)=>{
  //     const file=e.target.files[0]
  //     setImage(file)
  //     setImagePreview(URL.createObjectURL(file))
  // }
  // Image Change Handler
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
    formData.append("city", city);
    formData.append("state", state);
    formData.append("address", address);
    // CreateEditShop.jsx mein 
if (image) {
    formData.append("image", image);
} else if (myShopData?.ImageUrl) {
    // Agar nayi image nahi hai toh purani ImageUrl bhej dein
    formData.append("ImageUrl", myShopData.ImageUrl);
}

    try {
      const res = await axios.post(
        `${serverURL}/api/shop/create-edit`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // ✅ 'result' ko 'res' se replace kiya aur shop data dispatch kiya
      if (res.data.success) {
        dispatch(setMyShopData(res.data.shop)); 
        console.log("Shop Data:", res.data.shop);
        alert(res.data.message);
        navigate("/owner-dashboard");
      }
    } catch (error) {
      console.error(
        "Error saving shop:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Failed to save shop details");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center p-6 bg-[#fffcfb] min-h-screen relative">
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
          <h2 className="text-3xl font-black text-gray-800">
            {myShopData ? "Edit Shop" : "Add Shop"}
          </h2>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-600 ml-1">Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Raja Restaurant"
              className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#ff4d2d]"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-600 ml-1">
              Shop Image
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

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-600 ml-1">
                City
              </label>
              <input
                required
                type="text"
                placeholder="City"
                className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#ff4d2d]"
                onChange={(e) => setCity(e.target.value)}
                value={city}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-600 ml-1">
                State
              </label>
              <input
                required
                type="text"
                placeholder="State"
                className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#ff4d2d]"
                onChange={(e) => setState(e.target.value)}
                value={state}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-600 ml-1">
              Address
            </label>
            <textarea
              required
              rows="2"
              placeholder="Complete Address...."
              className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#ff4d2d] resize-none"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            ></textarea>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#ff4d2d] text-white font-bold py-4 rounded-xl mt-2 shadow-lg shadow-red-200 hover:bg-[#e64427] transition-all disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEditShop;
