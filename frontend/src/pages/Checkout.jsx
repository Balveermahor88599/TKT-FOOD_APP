import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaSearch, FaCrosshairs, FaMoneyBillWave, FaCreditCard, FaMobileAlt } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

import { setLocation, setAddress } from '../redux/mapSlice';

// Leaflet default icon fix
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 16);
  }, [lat, lng, map]);
  return null;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isOrdering, setIsOrdering] = useState(false);
  const [searchInput, setSearchInput] = useState(""); 

  // Redux States
  const { location, address } = useSelector(state => state.map);
  const { cartItems: cart} = useSelector(state => state.user); // Default empty array to prevent map error

  const defaultPos = [28.9845, 77.3877];
  const currentPos = (location && location.lat && location.lng) ? [location.lat, location.lng] : defaultPos;

  // 1. --- SEARCH LOCATION LOGIC ---
  const handleSearch = async () => {
    if (!searchInput) return alert("Kuch address toh likho!");
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(searchInput)}&format=json&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`
      );
      if (response.data.results?.length > 0) {
        const { lat, lon, formatted } = response.data.results[0];
        dispatch(setLocation({ lat, lng: lon }));
        dispatch(setAddress(formatted));
        setSearchInput(""); 
      } else {
        alert("Location nahi mili!");
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // 2. --- LIVE LOCATION LOGIC ---
  const handleMyLocation = () => {
    if (!navigator.geolocation) return alert("Browser support nahi karta.");
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      dispatch(setLocation({ lat: latitude, lng: longitude }));
      try {
        const response = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`);
        if (response.data.results?.length > 0) dispatch(setAddress(response.data.results[0].formatted));
      } catch (err) { console.error(err); }
    }, () => alert("Permission denied!"));
  };

  // 3. --- DRAG END LOGIC ---
  const onDragEnd = async (e) => {
    const { lat, lng } = e.target.getLatLng();
    dispatch(setLocation({ lat, lng }));
    try {
      const response = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`);
      if (response.data.results?.length > 0) dispatch(setAddress(response.data.results[0].formatted));
    } catch (err) { console.error(err); }
  };

  // Safe Calculations
  const subtotal = cart?.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0) || 0;
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (subtotal === 0) return alert("Aapka cart khali hai!");
    setIsOrdering(true);
    setTimeout(() => {
      alert("🎉 Order Placed Successfully!");
      setIsOrdering(false);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center font-sans">
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-gray-100 overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="cursor-pointer bg-white shadow-sm p-2 rounded-full border hover:scale-110 transition-all" onClick={() => navigate(-1)}>
            <IoMdArrowRoundBack size={32} className="text-[#ff4d2d]" />
          </div>
          <h1 className="text-3xl font-black text-gray-800">Checkout</h1>
        </div>

        {/* SECTION 1: DELIVERY LOCATION */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FaMapMarkerAlt className="text-[#ff4d2d]" />
            <h2 className="text-lg font-bold text-gray-700">Delivery Address</h2>
          </div>
          
          <div className="flex flex-col gap-3 mb-4">
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-sm text-gray-700 font-medium">
               <span className="text-[#ff4d2d] font-bold">Selected: </span> 
               {address || "Fetching address..."}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search colony, street or city..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#ff4d2d]/20"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch} className="bg-[#ff4d2d] text-white p-4 rounded-2xl hover:bg-[#e64427] transition-all"><FaSearch /></button>
              <button onClick={handleMyLocation} className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100"><FaCrosshairs /></button>
            </div>
          </div>

          <div className="w-full h-72 rounded-[2rem] overflow-hidden border-2 border-gray-100 shadow-inner">
            <MapContainer center={currentPos} zoom={15} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={currentPos} draggable={true} eventHandlers={{ dragend: onDragEnd }}>
                <Popup>Yahan deliver karein?</Popup>
              </Marker>
              <RecenterMap lat={currentPos[0]} lng={currentPos[1]} />
            </MapContainer>
          </div>
        </section>

        {/* SECTION 2: PAYMENT METHOD */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Payment Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => setPaymentMethod('cod')}
              className={`cursor-pointer p-5 rounded-3xl border-2 transition-all flex items-center gap-4 ${paymentMethod === 'cod' ? 'border-[#ff4d2d] bg-[#ff4d2d]/5' : 'border-gray-100 bg-gray-50'}`}
            >
              <div className="bg-green-100 p-3 rounded-2xl text-green-600 text-2xl"><FaMoneyBillWave /></div>
              <p className="font-black text-gray-800 text-sm">Cash on Delivery</p>
            </div>

            <div 
              onClick={() => setPaymentMethod('online')}
              className={`cursor-pointer p-5 rounded-3xl border-2 transition-all flex items-center gap-4 ${paymentMethod === 'online' ? 'border-[#ff4d2d] bg-[#ff4d2d]/5' : 'border-gray-100 bg-gray-50'}`}
            >
              <div className="flex gap-2 text-blue-600 text-2xl"><FaMobileAlt /><FaCreditCard /></div>
              <p className="font-black text-gray-800 text-sm">Online Payment</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: ORDER SUMMARY */}
        <section className="bg-white rounded-[2rem] p-6 border-2 border-gray-100">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Order Details</h2>
          <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {/* FIX: Use optional chaining and default value */}
            {cart && cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">
                    {item.name} <span className="text-gray-400 text-xs">x{item.quantity || 1}</span>
                  </span>
                  <span className="font-bold text-gray-800">
                    ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm italic">Cart is empty...</p>
            )}
          </div>
        
          <div className="h-[1px] bg-gray-100 my-4 border-dashed border-t-2"></div>

          <div className="space-y-2">
            <div className="flex justify-between font-bold text-gray-800">
              <p className="text-gray-500">Subtotal</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-gray-500 text-sm font-medium">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100 mt-2">
              <p className="text-xl font-black text-gray-800">Total Bill</p>
              <p className="text-3xl font-black text-[#ff4d2d]">₹{total.toFixed(2)}</p>
            </div>
          </div>
        </section>

        {/* PLACE ORDER BUTTON */}
        <button 
          onClick={handlePlaceOrder}
          disabled={subtotal === 0 || isOrdering}
          className={`w-full py-5 rounded-[2rem] mt-10 font-black text-xl transition-all shadow-xl active:scale-95 ${
            subtotal === 0 || isOrdering ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#ff4d2d] text-white hover:bg-[#e64427] shadow-[#ff4d2d]/20"
          }`}
        >
          {isOrdering ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;