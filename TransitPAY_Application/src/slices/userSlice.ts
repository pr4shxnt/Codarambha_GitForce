import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api, withAuth } from '../services/api';

type UserState = {
  isAuthenticated: boolean;
  name: string | null;
  email: string | null;
  token: string | null;
};

const initialState: UserState = {
  isAuthenticated: false,
  name: null,
  email: null,
  token: null,
};

export const login = createAsyncThunk(
  'user/login',
  async (payload: { email: string; password: string }) => {
    const data = await api<{ user: any; token: string }>(`/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return data;
  }
);

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
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.isAuthenticated = true;
      state.name = `${action.payload.user.firstName} ${action.payload.user.lastName}`;
      state.email = action.payload.user.email;
      state.token = action.payload.token;
    });
  }
});

export const { loginMock, logout } = userSlice.actions;
export default userSlice.reducer;


