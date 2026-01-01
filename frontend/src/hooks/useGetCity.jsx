import axios from 'axios';
import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentAddress, setCurrentCity, setCurrentState } from '../redux/userSlice';
import { setAddress, setLocation } from '../redux/mapSlice';

const useGetCity = () => {
  const dispatch = useDispatch();

  // Helper function ko useCallback mein dala taaki dependency stable rahe
  const setDefaultLocation = useCallback(() => {
    dispatch(setCurrentCity("Modinagar"));
    dispatch(setCurrentState("Uttar Pradesh"));
    dispatch(setCurrentAddress("Modinagar, Uttar Pradesh, India"));
    dispatch(setAddress("Modinagar, Uttar Pradesh, India"));
    dispatch(setLocation({ lat: 28.9845, lng: 77.3877 }));
  }, [dispatch]);

  useEffect(() => {
    // Check if location is already being fetched to avoid multiple calls
    const fetchLocation = async () => {
      if (!navigator.geolocation) {
        setDefaultLocation();
        return;
      }

      // Start loading state if you have one
      // dispatch(setMapLoading(true));

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Map coordinates update
            dispatch(setLocation({ lat: latitude, lng: longitude }));

            const response = await axios.get(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`
            );

            if (response.data.results && response.data.results.length > 0) {
              const result = response.data.results[0];
              
              const cityName = result.city || result.town || result.village || "Modinagar";
              const stateName = result.state || "Uttar Pradesh";
              const currentAddress = result.formatted || result.address_line2 || "Address not found"; 

              // Redux Updates
              dispatch(setCurrentCity(cityName));
              dispatch(setCurrentState(stateName));
              dispatch(setCurrentAddress(currentAddress));
              dispatch(setAddress(currentAddress));
            }
          } catch (error) {
            console.error("Geocoding API Error:", error);
            setDefaultLocation();
          } finally {
            // dispatch(setMapLoading(false));
          }
        },
        (error) => {
          console.error("Geolocation Permission Error:", error);
          setDefaultLocation();
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 } // Accuracy settings
      );
    };

    fetchLocation();
  }, [dispatch, setDefaultLocation]); // Ab dependencies stable hain

  return null; 
};

export default useGetCity;