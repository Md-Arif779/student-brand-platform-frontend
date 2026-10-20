import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");
const storedAccess = localStorage.getItem("access");
const storedRefresh = localStorage.getItem("refresh");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  access: storedAccess || null,
  refresh: storedRefresh || null,
  isAuthenticated: Boolean(storedAccess),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, access, refresh } = action.payload;

      state.user = user;
      state.access = access;
      state.refresh = refresh;
      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
    },

    logoutSuccess: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export default authSlice.reducer;