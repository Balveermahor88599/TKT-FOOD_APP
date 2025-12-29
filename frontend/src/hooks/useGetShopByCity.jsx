import axios from 'axios';
import { useEffect } from 'react';
import { serverURL } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { SetShopInMyCity } from '../redux/userSlice.js';

const useGetShopByCity = () => {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchShop = async () => {
      // Jab tak city "Locating..." hai ya khali hai, tab tak API call na karein
      if (!currentCity || currentCity === "Locating...") return;

      try {
        const result = await axios.get(`${serverURL}/api/shop/get-by-city/${currentCity}`, { 
          withCredentials: true 
        });

        console.log("API Result:", result.data);

        // FIX: Console screenshot ke hisaab se data direct array mein aa raha hai
        // Hum check karenge ki shops array kahan hai
        const shopsData = result.data.shops || result.data;

        if (Array.isArray(shopsData)) {
          dispatch(SetShopInMyCity(shopsData)); 
          console.log("Shops dispatched to Redux:", shopsData);
        } else {
          // Agar shops nahi milti toh empty array set karein taaki 'null' na rahe
          dispatch(SetShopInMyCity([]));
        }

      } catch (err) {
        console.error("Fetch error:", err.response?.data?.message || err.message);
        dispatch(SetShopInMyCity([])); // Error par bhi empty array set karein
      }
    };

    fetchShop();
  }, [currentCity, dispatch]);
};

export default useGetShopByCity;