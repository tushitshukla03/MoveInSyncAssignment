
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, access, refresh } = action.payload;
      state.user = user;
      state.accessToken = access;
      state.refreshToken = refresh;
    },
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
