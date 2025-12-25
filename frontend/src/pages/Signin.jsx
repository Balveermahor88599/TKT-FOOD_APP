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

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- MANUAL LOGIN ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${serverURL}/api/auth/signin`, formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        // ✅ FIX: Sirf user object bhej rahe hain (res.data nahi)
        dispatch(setUserData(res.data.user)); 
        alert(res.data.message || "Login Successful!");
        navigate("/"); 
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      alert(error.response?.data?.message || "Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  // --- GOOGLE LOGIN ---
  const handleGoogleSignin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const res = await axios.post(`${serverURL}/api/auth/google-login`, {
        Fullname: result.user.displayName,
        email: result.user.email,
        profilePic: result.user.photoURL,
        // Role backend sambhaal lega (agar naya user hai toh default 'user' banega)
      }, { withCredentials: true });

      if (res.data.success) {
        // ✅ FIX: Redux store ko user data se update kar rahe hain
        dispatch(setUserData(res.data.user)); 
        alert(`Welcome back, ${res.data.user.Fullname}`);
        navigate("/"); 
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Google Login Failed";
      alert(errorMsg);
      console.error("Google Login Error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-[#ff4d2d]">TKT Food</h1>
          <p className="text-gray-500 mt-1">Welcome back! Please login.</p>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleSignin}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2.5 rounded-xl hover:bg-gray-50 transition-all mb-4 font-medium"
        >
          <FcGoogle size={22} />
          <span>Login with Google</span>
        </button>

        <div className="relative flex items-center py-3">
          <div className="grow border-t border-gray-200"></div>
          <span className="mx-3 text-gray-400 text-xs uppercase font-semibold">Or use email</span>
          <div className="grow border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1 ml-1">Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#ff4d2d] outline-none"
              placeholder="email@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1 ml-1">
              <label className="text-xs font-bold text-gray-600 uppercase">Password</label>
              <button 
                type="button" 
                className="text-[10px] font-bold text-[#ff4d2d] hover:underline" 
                onClick={()=>navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#ff4d2d] outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff4d2d]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#ff4d2d] hover:bg-[#e64323] text-white font-bold py-3 rounded-xl mt-2 shadow-lg transition-all active:scale-95 
              ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/Signup")}
              className="text-[#ff4d2d] font-bold hover:underline cursor-pointer"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;