import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IndexState {
  uid?: string;
  isConnect: boolean;
}

const initialState: IndexState = {
  isConnect: false,
};

const indexSlice = createSlice({
  name: 'index',
  initialState,
  reducers: {
    updateIsConnect: (state: IndexState, actions: PayloadAction<{ connect: boolean, uid?: string }>) => {
      state.isConnect = actions.payload.connect;
      state.uid = actions.payload.uid;
    },
    setUID: (state: IndexState, actions: PayloadAction<string>) => {
      state.uid = actions.payload;
    },
  }
});

export const { updateIsConnect, setUID } = indexSlice.actions;
export default indexSlice.reducer;
