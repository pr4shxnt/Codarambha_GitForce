import { configureStore, createSlice } from '@reduxjs/toolkit';

// /e:/TRANSITPAY/application/State/store.js

/*
    Minimal Redux store setup using Redux Toolkit.
    Replace the example slices below with your real reducers or import them.
*/

/* Example auth slice */
const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, token: null },
    reducers: {
        login(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logout(state) {
            state.user = null;
            state.token = null;
        },
    },
});

/* Example transit slice */
const transitSlice = createSlice({
    name: 'transit',
    initialState: { items: [], loading: false, error: null },
    reducers: {
        fetchStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchSuccess(state, action) {
            state.items = action.payload;
            state.loading = false;
        },
        fetchFailure(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

// Export example actions (use or remove as needed)
export const { login, logout } = authSlice.actions;
export const { fetchStart, fetchSuccess, fetchFailure } = transitSlice.actions;

/* Configure and export the store */
const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        transit: transitSlice.reducer,
    },
    // Default middleware includes thunk and useful checks in dev
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;