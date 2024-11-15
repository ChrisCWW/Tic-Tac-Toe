import { initialGameBoard } from '@/lib/utils/GameUtils';
import { GameBoard, GameMode } from '@/types/GameTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GameState {
  mode: GameMode;
  rid: string;
  players: string[];
  turn: number;
  board: GameBoard;
  winner: number;
}

const initialState: GameState = {
  mode: GameMode.null,
  rid: '',
  players: [],
  turn: 0,
  board: [],
  winner: 0,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startLocalGame: (state: GameState) => {
      state.mode = GameMode.loacl;
      state.board = initialGameBoard();
      state.turn = 0;
      state.winner = 0;
    },
    startNetworkGame: (state: GameState, actions: PayloadAction<{ rid: string, players: string[] }>) => {
      state.mode = GameMode.network;
      state.rid = actions.payload.rid;
      state.players = actions.payload.players;    
      state.board = initialGameBoard();
      state.turn = 0;
      state.winner = 0;
    },
    nextTurn: (state: GameState, actions: PayloadAction<{ turn: number, board: GameBoard, winner: number }>) => {
      state.turn = actions.payload.turn;
      state.board = actions.payload.board;
      state.winner = actions.payload.winner;
    },
    restartGame: (state: GameState) => {
      state.turn = 0;
      state.board = initialGameBoard();
      state.winner = 0;
    },
    reset: (state: GameState) => {
      state.mode = GameMode.null;
      state.rid = '';
      state.players = [];    
      state.board = [];
      state.turn = 0;
      state.winner = 0;
    },
  }
});

export const { startLocalGame, startNetworkGame, nextTurn, restartGame, reset } = gameSlice.actions;
export default gameSlice.reducer;
