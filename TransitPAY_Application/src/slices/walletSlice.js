import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  balanceCents: 2500,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    topUp(state, action) {
      state.balanceCents += action.payload;
    },
    deduct(state, action) {
      state.balanceCents = Math.max(0, state.balanceCents - action.payload);
    },
  },
});

export const { topUp, deduct } = walletSlice.actions;
export default walletSlice.reducer;


