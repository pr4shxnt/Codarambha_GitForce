import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import walletReducer from '../slices/walletSlice';
import tripsReducer from '../slices/tripsSlice';
import alertsReducer from '../slices/alertsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    wallet: walletReducer,
    trips: tripsReducer,
    alerts: alertsReducer,
  },
});



