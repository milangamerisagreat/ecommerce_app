import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart: [],
    addresses: [],
    selectedAddress: null, // currently selected address for checkout
  },
  reducers: {
    //actions
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setAddresses: (state, action) => {
      state.addresses = action.payload;
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (_, index) => index !== action.payload,
      );

      if (state.selectedAddress === action.payload) {
        state.selectedAddress = null;
      }
    },
  },
});

export const {
  setProducts,
  setCart,
  setAddresses,
  setSelectedAddress,
  deleteAddress,
} = productSlice.actions;
export default productSlice.reducer;
