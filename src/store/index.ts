import {configureStore} from '@reduxjs/toolkit';
import movieReducer from './slices/movieSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;