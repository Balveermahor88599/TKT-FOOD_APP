import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentAddress, setCurrentCity, setCurrentState } from '../redux/userSlice';

const useGetCity = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!navigator.geolocation) {
      dispatch(setCurrentCity("Modinagar"));
      dispatch(setCurrentState("Uttar Pradesh"));
      dispatch(setCurrentAddress("Modinagar, Uttar Pradesh, India"));
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`
        );

        if (response.data.results && response.data.results.length > 0) {
          const result = response.data.results[0];
          
          const cityName = result.city || result.town || result.village || "Modinagar";
          const stateName = result.state || "Uttar Pradesh";
          // 🟢 'result.formatted' mein poora address hota hai
          const currentAddress = result.address_line2 || result.address_line1; 

          dispatch(setCurrentCity(cityName));
          dispatch(setCurrentState(stateName));
          dispatch(setCurrentAddress(currentAddress));
        }
      } catch (error) {
        console.error("Geocoding Error:", error);
        dispatch(setCurrentCity("Modinagar"));
        dispatch(setCurrentState("Uttar Pradesh"));
      } 
    }, (error) => {
      console.error("Geo Error:", error);
      dispatch(setCurrentCity("Modinagar"));
      dispatch(setCurrentState("Uttar Pradesh"));
    });
  }, [dispatch]);

  return null; 
};

export default useGetCity;