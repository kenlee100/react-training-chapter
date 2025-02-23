import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "@/redux/toastSlice";
import adminReducer from "@/redux/adminSlice";

export const store = configureStore({
  reducer: {
    toast: toastReducer,
    adminSlice: adminReducer,
  },
});
