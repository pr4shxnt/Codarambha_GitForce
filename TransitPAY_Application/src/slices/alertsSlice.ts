import { createSlice } from '@reduxjs/toolkit';

type AlertsState = {
  lowBalanceThresholdCents: number;
};

const initialState: AlertsState = {
  lowBalanceThresholdCents: 500,
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setLowBalanceThreshold(state, action) {
      state.lowBalanceThresholdCents = action.payload;
    },
  },
});

export const { setLowBalanceThreshold } = alertsSlice.actions;
export default alertsSlice.reducer;



