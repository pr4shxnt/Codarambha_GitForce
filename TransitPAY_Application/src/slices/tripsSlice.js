import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  recent: [
    { id: 't1', route: 'Blue Line', fareCents: 250, timestamp: Date.now() - 3600_000 },
  ],
};

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    addTrip: {
      reducer(state, action) {
        state.recent.unshift(action.payload);
        state.recent = state.recent.slice(0, 20);
      },
      prepare(route, fareCents) {
        return {
          payload: {
            id: nanoid(),
            route,
            fareCents,
            timestamp: Date.now(),
          },
        };
      },
    },
  },
});

export const { addTrip } = tripsSlice.actions;
export default tripsSlice.reducer;


