import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCity } from '../redux/userSlice'; // Sahi action import karein

const useGetCity = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Check agar browser location support karta hai
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      dispatch(setCity("Modinagar")); // Fallback city
      return;
    }

    // 2. Location fetch karna
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        
        // Geoapify API Call
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`
        );

        // Geoapify response se city nikalna
        // Path: results[0].city/town/village
        const result = response.data.results[0];
        const cityName = result.city || result.town || result.village || "Modinagar";
        
        // Redux store mein city save karein
        dispatch(setCity(cityName));
        
      } catch (error) {
        console.error("Geocoding Error:", error);
        dispatch(setCity("Modinagar")); // Error aane par default city
      }
    }, (error) => {
      console.error("Location Access Denied:", error);
      dispatch(setCity("Modinagar")); // Permission deny hone par default city
    });
  }, [dispatch]);

  // Hook hamesha null ya data return karta hai, JSX nahi
  return null; 
};

export default useGetCity;