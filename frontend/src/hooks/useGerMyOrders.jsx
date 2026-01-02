import axios from 'axios';
import { useEffect, useState } from 'react';
import { serverURL } from '../App';
import { useDispatch } from 'react-redux';
import { setMyOrders } from '../redux/userSlice.js';

const useGetMyOrders = () => {
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Backend route jo humne controller mein set kiya hai
        const response = await axios.get(`${serverURL}/api/order/my-orders`, { 
          withCredentials: true 
        });
         console.log(response.data)
        // Backend response format: { success: true, orders: [...] }
        if (response.data?.success) {
          const ordersList = response.data.orders;
          setOrders(ordersList); 
          dispatch(setMyOrders(ordersList)); 
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
        console.error("Orders fetching error:", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dispatch]);

  return { orders, loading, error }; 
};

export default useGetMyOrders;