import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../App";

const ResetPassword = () => {
  const { token } = useParams(); // URL se token lene ke liye
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${serverURL}/api/auth/reset-password/${token}`, { password });
      if (res.data.success) {
        alert("Password updated!");
        navigate("/Signin");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff9f6] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-[#ff4d2d] mb-4 text-center">Set New Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#ff4d2d]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff4d2d] text-white py-3 rounded-xl font-bold hover:bg-[#e64323] transition-all"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;