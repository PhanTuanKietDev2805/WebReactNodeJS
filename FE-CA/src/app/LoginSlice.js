import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  showForm: false,
};

const LoginSlice = createSlice({
  initialState,
  name: "login",
  reducers: {
    setShowForm: (state, action) => {
      state.showForm = action.payload;
    },
  },
});

export const { setShowForm } = LoginSlice.actions;

export const selectShowForm = (state) => state.login.showForm;

export default LoginSlice.reducer;
