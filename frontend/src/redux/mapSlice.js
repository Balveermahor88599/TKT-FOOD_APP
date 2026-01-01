import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
  name: "map", // Iska naam "map" rakhein (pehle "user" tha)
  initialState: {
    location: {
        lat: null,
        lng: null // lon ki jagah lng takki Leaflet/Google maps se match ho
    },
    address: null
  },
  reducers: {
    setLocation: (state, action) => {
        const { lat, lng } = action.payload;
        state.location.lat = lat;
        state.location.lng = lng;
        // Koi return nahi chahiye yahan
    },
    setAddress: (state, action) => {
        state.address = action.payload; // Curly braces add kar diye hain
    }
  }
});

export const { setLocation, setAddress } = mapSlice.actions;
export default mapSlice.reducer;