import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { serverURL } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Signup = () => {
  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    Fullname: "",
    email: "",
    mobile: "",
    password: "",
    role: "user",
  });
  const dispatch = useDispatch();

  const handleSignup = async (e) => {
    e.preventDefault(); // Form reload hone se rokne ke liye
    try {
      const result = await axios.post(
        `${serverURL}/api/auth/Signup`,
        formData,
        { withCredentials: true }
      );
      dispatch (setUserData(result.data));
      if (result.data.success) {
        alert("Account Created Successfully!");
        navigate("/Signin"); // Login page par bhej rahe hain
      }
    } catch (error) {
      // BACKEND ERROR MESSAGE: Yahan hum backend ka message alert mein dikha rahe hain
      const msg = error.response?.data?.message || "Signup Failed";
      alert(msg); 
      console.log("Signup Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Google user ko backend par bhej rahe hain
      const res = await axios.post(`${serverURL}/api/auth/google-login`, {
        Fullname: result.user.displayName,
        email: result.user.email,
        profilePic: result.user.photoURL,
        role: formData.role, // Jo role UI par select kiya hai wahi jayega
      }, { withCredentials: true });
        dispatch (setUserData(res.data));
      if (res.data.success) {
        alert(`Welcome ${res.data.user.Fullname}`);
        navigate("/"); // Home page par bhej rahe hain
      }
    } catch (error) {
      const msg = error.reasponse?.data?.message || "Google Signup Failed";
      alert(msg);
      console.log("Google Auth Error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-[#ff4d2d]">TKT Food</h1>
          <p className="text-gray-500 mt-1">Get delicious food delivered!</p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2.5 rounded-xl hover:bg-gray-50 transition-all mb-4 font-medium"
        >
          <FcGoogle size={22} />
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center py-3">
          <div className="grow border-t border-gray-200"></div>
          <span className="mx-3 text-gray-400 text-xs uppercase">Or signup manually</span>
          <div className="grow border-t border-gray-200"></div>
        </div>

        {/* Form submit par ab handleSignup chalega */}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1 ml-1">Full Name</label>
            <input
              name="Fullname"
              type="text"
              required
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#ff4d2d] outline-none"
              placeholder="Enter Full Name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1 ml-1">Email</label>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#ff4d2d] outline-none"
              placeholder="email@example.com"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1 ml-1">Mobile Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">+91</span>
              <input
                name="mobile"
                type="tel"
                required
                maxLength="10"
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-2 focus:ring-2 focus:ring-[#ff4d2d] outline-none"
                placeholder="9876543210"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1 ml-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#ff4d2d] outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-2 ml-1">I am a...</label>
            <div className="flex gap-2">
              {["user", "owner", "deliveryBoy"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r })}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all border-2 
                    ${formData.role === r
                        ? "bg-[#ff4d2d] border-[#ff4d2d] text-white"
                        : "bg-white border-gray-100 text-gray-500"
                    }`}
                >
                  {r === "deliveryBoy" ? "Delivery" : r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff4d2d] hover:bg-[#e64323] text-white font-bold py-3 rounded-xl mt-2 shadow-lg transition-transform active:scale-95"
          >
            Sign Up Now
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/Signin")}
              className="text-[#ff4d2d] font-bold hover:underline cursor-pointer"
            >
              Log in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;