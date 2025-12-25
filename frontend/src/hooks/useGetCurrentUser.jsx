import axios from 'axios';
import { useEffect, useState } from 'react';
import { serverURL } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const useGetCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${serverURL}/api/user/current`, { 
          withCredentials: true 
        });

        // ✅ Check karein ki response success hai ya nahi
        if (response.data.success) {
          const userData = response.data.user;
          
          setUser(userData); // Local state update
          dispatch(setUserData(userData)); // Redux store update (Sirf user details)
        }
      } catch (err) {
        // 401 Error ka matlab hai user logged in nahi hai, ise console par error na dikhayen to behetar hai
        if (err.response?.status !== 401) {
          console.error("Error fetching user:", err.response?.data?.message || err.message);
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [dispatch]); // dispatch ko dependency mein rakhna standard practice hai

  return { user, loading, error };
};

export default useGetCurrentUser;