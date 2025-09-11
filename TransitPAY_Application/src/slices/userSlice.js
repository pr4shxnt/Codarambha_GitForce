import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  name: null,
  email: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginMock(state) {
      state.isAuthenticated = true;
      state.name = 'Ada Commuter';
      state.email = 'ada@example.com';
    },
    logout(state) {
      state.isAuthenticated = false;
      state.name = null;
      state.email = null;
    },
  },
});

export const { loginMock, logout } = userSlice.actions;
export default userSlice.reducer;


