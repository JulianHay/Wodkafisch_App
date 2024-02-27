"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  username: string | null;
  accessToken: string | null;
  isSignedIn: boolean;
  isAdmin: boolean;
}

const initialState: UserState = {
  username: null,
  accessToken: null,
  isSignedIn: false,
  isAdmin: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;
      state.isSignedIn = action.payload.isSignedIn;
      state.isAdmin = action.payload.isAdmin;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
