import { configureStore } from "@reduxjs/toolkit";
import CartSlice from "./CartSlice.js";
import LoginSlice from "./LoginSlice.js";

const Store = configureStore({
  reducer: {
    cart: CartSlice,
    login: LoginSlice,
  },
});

export default Store;
