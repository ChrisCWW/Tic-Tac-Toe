import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface indexState {
  uid?: string;
  isConnect: boolean;
  isNetwork: boolean;
  players: string[];
}

const initialState: indexState = {
  isConnect: false,
  isNetwork: false,
  players: [],
};

const indexSlice = createSlice({
  name: 'index',
  initialState,
  reducers: {
    updateIsConnect: (state: indexState, actions: PayloadAction<boolean>) => {
      state.isConnect = actions.payload;
    },
    updateIsNetwork: (state: indexState, actions: PayloadAction<boolean>) => {
      state.isNetwork = actions.payload;
    },
    matchedGame: (state: indexState, actions: PayloadAction<{ uid: string, players: string[]}>) => {
      state.isNetwork = true;
      state.uid = actions.payload.uid;
      state.players = actions.payload.players;
    },
  },
});

export const { updateIsConnect, updateIsNetwork, matchedGame } = indexSlice.actions;
export default indexSlice.reducer;
