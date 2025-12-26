import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    currentCity: "Locating...", // Default loading state
    currentState: null,
    currentAddress:null
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
      state.currentCity = "Modinagar"; // Logout par default city set kar di
    },
  },
});

export const { setUserData, clearUserData, setCurrentCity, setCurrentState, setCurrentAddress } = userSlice.actions;
export default userSlice.reducer;