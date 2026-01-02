import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    currentCity: "Locating...", 
    currentState: null,
    currentAddress: null,
    shopInMyCity: null,
    itemsInMyCity: null,
    myOrders: [],
    cartItems: JSON.parse(localStorage.getItem("cart")) || [],
    totalAmount: JSON.parse(localStorage.getItem("total")) || 0
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
    SetShopInMyCity: (state, action) => {
      state.shopInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
    addToCart: (state, action) => {
      const cartItem = action.payload;
      const existingItem = state.cartItems.find(i => i.id == cartItem.id);
      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }
      state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
      localStorage.setItem("total", JSON.stringify(state.totalAmount));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find(i => i.id == id);
      if (item) {
        item.quantity = quantity;
      }
      state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
      localStorage.setItem("total", JSON.stringify(state.totalAmount));
    },
    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(i => i.id !== action.payload);
      state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0); 
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
      localStorage.setItem("total", JSON.stringify(state.totalAmount));
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      localStorage.removeItem("cart");
      localStorage.removeItem("total");
    },
    clearUserData: (state) => {
      state.userData = null;
      state.currentCity = "Modinagar"; 
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },
    addMyOrder: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders];
    },

    // --- NAYA REDUCER (Aapki Image ke logic par based) ---
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      
      // 1. Pehle pura order dhoondo
      const order = state.myOrders.find((o) => o._id === orderId);
      
      if (order) {
        // 2. Phir us order ke andar specific shopOrder dhoondo (Owner perspective)
        const specificShopOrder = order.shopOrders.find(
          (so) => (so.shop?._id || so.shop) === shopId
        );
        
        if (specificShopOrder) {
          // 3. Status update kar do
          specificShopOrder.status = status;
          
          // Note: Agar global order status bhi change karna hai toh yahan kar sakte hain
          order.status = status; 
        }
      }
    }
  },
});

export const { 
  setUserData, 
  clearUserData, 
  setCurrentCity, 
  setCurrentState, 
  setCurrentAddress, 
  SetShopInMyCity, 
  setItemsInMyCity, 
  addToCart, 
  updateQuantity, 
  removeCartItem,
  clearCart, 
  setMyOrders, 
  addMyOrder,
  updateOrderStatus // Export kiya gaya naya action
} = userSlice.actions;

export default userSlice.reducer;