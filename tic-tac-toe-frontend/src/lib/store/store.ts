import { configureStore } from '@reduxjs/toolkit';
import indexReducer from '@/lib/store/features/indexSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      index: indexReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
