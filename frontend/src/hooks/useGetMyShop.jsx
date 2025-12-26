import axios from 'axios';
import { useEffect, useState } from 'react';
import { serverURL } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice.js';

const useGetMyShop = () => {
  const [shop, setShop] = useState(null); // 'user' ki jagah 'shop' behtar hai
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${serverURL}/api/shop/get-my`, { 
          withCredentials: true 
        });
 console.log(response)
        if (response.data.success) {
          // Aapka controller 'shop' bhej raha hoga, 'user' nahi
          const shopData = response.data.shop || response.data.data;
          
          setShop(shopData); 
          dispatch(setMyShopData(shopData)); 
        }
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error("Error fetching shop:", err.response?.data?.message || err.message);
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [dispatch]);

  return { shop, loading, error }; // 'shop' return karein
};

export default useGetMyShop;