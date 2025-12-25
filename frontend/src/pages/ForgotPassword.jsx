import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../App";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${serverURL}/api/auth/forgot-password`, { email });
      
      if (res.data.success) {
        alert("Reset link sent to your email!");
        // User ko wapas login par bhej sakte hain
        navigate("/Signin");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100">
        
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-[#ff4d2d]">Forgot Password?</h1>
          <p className="text-gray-500 mt-2">Enter your email to receive a password reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1 ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#ff4d2d] outline-none transition-all"
              placeholder="example@gmail.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#ff4d2d] hover:bg-[#e64323] text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 
              ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/Signin")}
            className="text-gray-500 text-sm font-semibold hover:text-[#ff4d2d] transition-all"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;