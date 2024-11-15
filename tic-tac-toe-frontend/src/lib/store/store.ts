import { configureStore } from '@reduxjs/toolkit';
import indexReducer from '@/lib/store/features/IndexSlice';
import gameReducer from '@/lib/store/features/GameSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      index: indexReducer,
      game: gameReducer
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
