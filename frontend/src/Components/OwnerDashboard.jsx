import React from 'react'
import Navbar from './Navbar'

const OwnerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Navbar (Search-bar automatic hide ho jayegi) */}
      <Navbar />

      {/* 2. Main Content Area */}
      <div className="pt-24 px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* Welcome Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">
            Owner Dashboard
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Welcome back! Manage your restaurant menu and track orders.
          </p>
        </div>

        {/* Example Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#ff4d2d] text-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold opacity-80">Total Menu Items</h3>
            <p className="text-4xl font-black mt-2">18</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-400">Total Orders</h3>
            <p className="text-4xl font-black text-slate-800 mt-2">124</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-400">Total Revenue</h3>
            <p className="text-4xl font-black text-slate-800 mt-2">₹42,500</p>
          </div>
        </div>

        {/* Yahan hum 'Add Food' wala button aur Table dalenge */}
        <div className="mt-10 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-700">Manage Menu</h2>
            <button className="bg-[#ff4d2d] text-white px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-md">
               + Add New Food
            </button>
        </div>

      </div>
    </div>
  )
}

export default OwnerDashboard