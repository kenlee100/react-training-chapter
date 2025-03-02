import { createSlice } from "@reduxjs/toolkit";

export const toastSlice = createSlice({
  name: "toast",
  initialState: {
    messages: [],
  },
  reducers: {
    pushMessage: (state, { payload }) => {
      state.messages.push({
        id: Date.now(),
        text: payload.text,
        status: payload.status,
      });
    },
    removeToast: (state, { payload }) => {
      const findToastIndex = state.messages.findIndex(
        (item) => item.id === payload
      );
      state.messages.splice(findToastIndex, 1);
    },
  },
});
export const selectToast = (state) => state.toast.messages;
export const { pushMessage, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
