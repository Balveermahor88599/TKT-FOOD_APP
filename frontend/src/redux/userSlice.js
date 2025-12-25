import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    city: "Locating...", // Default loading state
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
      state.city = "Modinagar"; // Logout par default city set kar di
    },
  },
});

export const { setUserData, clearUserData, setCity } = userSlice.actions;
export default userSlice.reducer;