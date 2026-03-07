import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import shiftsReducer from "../features/shifts/shiftsSlice";
import requestsReducer from "../features/requests/requestsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shifts: shiftsReducer,
    requests: requestsReducer,
  },
});
