import { GameBoard } from "../types/types";

export function initialBoard(boxCount: number) {
    return Array(boxCount).fill(Array(boxCount).fill(0));
}

export function transfromBoard(board: GameBoard, turn: number, move: number, boxCount: number = 3) {
    if (move >= boxCount * boxCount) return;

    const moveCoord = { x: move % boxCount, y: Math.floor(move/boxCount) };
    const newBoard = [...board].map((row) => [...row]);

    if (newBoard[moveCoord.y][moveCoord.x] !== 0) return;
    newBoard[moveCoord.y][moveCoord.x] = turn % 2 + 1;

    return newBoard
}

export function whoIsWinner(board: GameBoard, boxCount: number = 3) {
  let valueCount = 0;
  const rows = [];
  const cols = [];
  const slopes: number[][] = [[], []];

  for (let y = 0; y < board.length; y++) {
    rows.push(board[y]);

    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] === 0) valueCount++;

      if (y === 0) {
        cols.push([board[y][x]]);
      } else {
        cols[x].push(board[y][x]);
      }
      if (y === x) {
        slopes[0].push(board[y][x]);
      }
      if (y === Math.abs(x - boxCount + 1)) {
        slopes[1].push(board[y][x]);
      }
    }
  }
  let winner = 0;
  rows.forEach((item) => {
    const win = checkWinPattern(item);
    if (win) winner = win;
  });
  cols.forEach((item) => {
    const win = checkWinPattern(item);
    if (win) winner = win;
  });
  slopes.forEach((item) => {
    const win = checkWinPattern(item);
    if (win) winner = win;
  });
  
  if (winner === 0 && valueCount === 0) {
    winner = 3;
  }
  return winner;
}
  
function checkWinPattern(array: number[]){
  if (array && array.every((value) => value === 1)) {
    return 1;
  }
  if (array && array.every((value) => value === 2)) {
    return 2;
  } else {
    return 0;
  }
}
  