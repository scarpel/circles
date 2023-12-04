import { TUser } from "@customTypes/auth";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  user?: TUser;
  accessToken?: string | undefined;
}

const initialState: AuthState = {
  user: undefined,
  accessToken: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | undefined>) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
});

export const { setAccessToken, setUser } = authSlice.actions;

export default authSlice.reducer;
