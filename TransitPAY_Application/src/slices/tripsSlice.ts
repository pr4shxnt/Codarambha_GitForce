import { createSlice, nanoid, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { api, withAuth } from '../services/api';
import type { RootState } from '../store';

type Trip = {
  id: string;
  route: string;
  fareCents: number;
  timestamp: number;
};

type TripsState = {
  recent: Trip[];
};

const initialState: TripsState = {
  recent: [
    { id: 't1', route: 'Blue Line', fareCents: 250, timestamp: Date.now() - 3600_000 },
  ],
};

export const fetchTrips = createAsyncThunk(
  'trips/fetch',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const data = await api<Trip[]>(`/trips/`, { headers: withAuth(state.user.token || undefined) });
    return data;
  }
);

export const createTrip = createAsyncThunk(
  'trips/create',
  async ({ route, fareCents }: { route: string; fareCents: number }, { getState }) => {
    const state = getState() as RootState;
    const data = await api<Trip>(`/trips/add`, {
      method: 'POST',
      headers: withAuth(state.user.token || undefined),
      body: JSON.stringify({ route, fareCents }),
    });
    return data;
  }
);

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    addTrip: {
      reducer(state, action: PayloadAction<Trip>) {
        state.recent.unshift(action.payload);
        state.recent = state.recent.slice(0, 20);
      },
      prepare(route: string, fareCents: number) {
        return {
          payload: {
            id: nanoid(),
            route,
            fareCents,
            timestamp: Date.now(),
          } as Trip,
        };
      },
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTrips.fulfilled, (state, action: PayloadAction<Trip[]>) => {
      state.recent = action.payload.map(t => ({
        id: t.id || (t as any)._id || t.txnId || nanoid(),
        route: t.route,
        fareCents: t.fareCents,
        timestamp: new Date((t as any).timestamp || Date.now()).getTime(),
      }));
    });
    builder.addCase(createTrip.fulfilled, (state, action: PayloadAction<any>) => {
      const t = action.payload;
      state.recent.unshift({
        id: t.txnId || t.id || (t as any)._id,
        route: t.route,
        fareCents: t.fareCents,
        timestamp: new Date(t.timestamp || Date.now()).getTime(),
      });
      state.recent = state.recent.slice(0, 20);
    });
  },
});

export const { addTrip } = tripsSlice.actions;
export default tripsSlice.reducer;



