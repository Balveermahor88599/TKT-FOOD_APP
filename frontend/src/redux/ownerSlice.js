import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    // 🟢 Iska naam 'myShopData' rakhein kyunki dashboard yahi read kar raha hai
    myShopData: null, 
  },
  reducers: {
    setMyShopData: (state, action) => {
      state.myShopData = action.payload;
    }
  }
});

export const { setMyShopData } = ownerSlice.actions;
export default ownerSlice.reducer;