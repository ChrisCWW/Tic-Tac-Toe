export enum GameMode {
  null = 0,
  loacl,
  match,
}

export enum Winner {
    null = 0,
    PlayerOne,
    PlayerTwo,
    Draw,
}

export type GameBoard = number[][];
