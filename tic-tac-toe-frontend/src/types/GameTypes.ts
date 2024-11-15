export enum GameMode {
  null = 0,
  loacl,
  network,
}

export enum Winner {
    null = 0,
    PlayerOne,
    PlayerTwo,
    Draw,
}

export type GameBoard = number[][];

export interface GameRoom {
  room_id: string;
  players: string[];
  board: GameBoard;
  turn: number;
}