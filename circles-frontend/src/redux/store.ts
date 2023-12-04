import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Slices
import authSlice from "./slices/authSlice";
import conversationsSlice from "./slices/conversationsSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    conversations: conversationsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;
