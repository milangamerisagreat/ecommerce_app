import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productReducer from "./productSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,

    
  },

  devTools: true,
});

export default store;