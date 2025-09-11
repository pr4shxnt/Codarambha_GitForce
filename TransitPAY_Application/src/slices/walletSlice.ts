import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api, withAuth } from '../services/api';
import type { RootState } from '../store';

type WalletState = {
  balanceCents: number;
};

const initialState: WalletState = {
  balanceCents: 2500,
};

export const fetchWallet = createAsyncThunk(
  'wallet/fetch',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const data = await api<{ balanceCents: number; transactions: any[] }>(`/wallet/`, {
      headers: withAuth(state.user.token || undefined),
    });
    return data;
  }
);

export const serverTopUp = createAsyncThunk(
  'wallet/topup',
  async (amountCents: number, { getState }) => {
    const state = getState() as RootState;
    const data = await api<{ balanceCents: number }>(`/wallet/topup`, {
      method: 'POST',
      headers: withAuth(state.user.token || undefined),
      body: JSON.stringify({ amountCents }),
    });
    return data;
  }
);

export const serverDeduct = createAsyncThunk(
  'wallet/deduct',
  async (amountCents: number, { getState }) => {
    const state = getState() as RootState;
    const data = await api<{ balanceCents: number }>(`/wallet/deduct`, {
      method: 'POST',
      headers: withAuth(state.user.token || undefined),
      body: JSON.stringify({ amountCents }),
    });
    return data;
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    topUp(state, action: PayloadAction<number>) {
      state.balanceCents += action.payload;
    },
    deduct(state, action: PayloadAction<number>) {
      state.balanceCents = Math.max(0, state.balanceCents - action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWallet.fulfilled, (state, action) => {
      state.balanceCents = action.payload.balanceCents;
    });
    builder.addCase(serverTopUp.fulfilled, (state, action) => {
      state.balanceCents = action.payload.balanceCents;
    });
    builder.addCase(serverDeduct.fulfilled, (state, action) => {
      state.balanceCents = action.payload.balanceCents;
    });
  },
});

export const { topUp, deduct } = walletSlice.actions;
export default walletSlice.reducer;



