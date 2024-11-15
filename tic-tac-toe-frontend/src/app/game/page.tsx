'use client';

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import GameInfo from "@/components/GameInfo/GameInfo";
import WinPage from "@/components/WinPage/WinPage";
import useSocket from "@/hooks/useSocket";
import { useThree } from "@/hooks/useThree";
import { RootState } from "@/lib/store/store";
import { initialGameBoard, whoIsWinner } from "@/lib/utils/GameUtils";
import { GameBoard, Winner } from "@/types/GameTypes";
import styles from './page.module.css';

const boxCount = 3;

export default function Game() {
  console.log("Game");

  const socket = useSocket();
  const isNetwork = useSelector((state: RootState) => state.index.isNetwork);
  const uid = useSelector((state: RootState) => state.index.uid);
  const players = useSelector((state: RootState) => state.index.players);
  const [board, setBoard] = useState<GameBoard>(initialGameBoard(boxCount));
  const [turn, setTurn] = useState<number>(0);
  const [winner, setWinner] = useState<Winner>(Winner.null);

  const canvas = useRef<HTMLDivElement>(null);
  const { startTouch, moveTouch, resetBoard } = useThree(canvas, boxCount, board, turn, isNetwork, uid, players);

  function nextTurn(board: GameBoard, winner: number)  {
    setBoard(board);

    if (winner > 0) {
      setWinner(winner);
    } else {
      setTurn(turn + 1);
    }
  }

  const handleStartTouch = (e: MouseEvent | TouchEvent) => {
    // Handle touch. If Network game, emit data to server
    const result = startTouch(e);
    if (!result) return;

    const { coord, value } = result;

    if (isNetwork) socket?.emit('next', { data: { uid, coord } })

    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[coord.y][coord.x] = value;
    const win = whoIsWinner(newBoard, boxCount);

    nextTurn(newBoard, win);
  }

  const restart = () => {
    const initalBoard = board.map((row) => row.map((item) => 0));
    setTurn(0);
    setBoard(initalBoard);
    resetBoard();
    setWinner(0);
  }

  useEffect(() => {  
      window.addEventListener('mousedown', handleStartTouch);
      window.addEventListener('mousemove', moveTouch);
      window.addEventListener('touchstart', handleStartTouch);

      return () => {
        window.removeEventListener('mousedown', handleStartTouch);
        window.removeEventListener('mousemove', moveTouch);
        window.removeEventListener('touchstart', handleStartTouch);
      };    
  }, [turn, board, winner, handleStartTouch, moveTouch]);

  useEffect(() => {
    if (isNetwork) {
      socket?.on('next', nextTurn);
    } else {
      socket?.off('next', nextTurn);
    }

    // Cleanup function to remove event listeners
    return () => {
      socket?.off('next', nextTurn);
    }
  }, [isNetwork]);

  return (
    <div className={styles.container}>
      <GameInfo socket={socket} turn={turn} />
      <div ref={canvas} className={styles.container}></div>
      { winner > 0 && <WinPage winner={winner} restart={restart} /> }
    </div>
  )
}