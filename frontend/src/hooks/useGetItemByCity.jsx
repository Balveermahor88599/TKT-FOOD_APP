import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setItemsInMyCity } from "../redux/userSlice.js";

const useGetItemByCity = () => {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await axios.get(
          `${serverURL}/api/item/get-by-cityItem/${currentCity}`,
          {
            withCredentials: true,
          }
        );
        dispatch(setItemsInMyCity(result.data));
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchItems();
  }, [currentCity,dispatch]);
};

export default useGetItemByCity;
