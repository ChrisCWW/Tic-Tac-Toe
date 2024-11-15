'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import GameInfo from "@/components/GameInfo/GameInfo";
import WinPage from "@/components/WinPage/WinPage";
import useSocket from "@/hooks/useSocket";
import { useThree } from "@/hooks/useThree";
import { nextTurn, reset, restartGame, startNetworkGame } from "@/lib/store/features/GameSlice";
import { RootState } from "@/lib/store/store";
import { whoIsWinner } from "@/lib/utils/GameUtils";
import { GameBoard, GameMode } from "@/types/GameTypes";
import styles from './page.module.css';
import Loading from "@/components/Loading/Loading";
import MessageBox from "@/components/MessageBox/MessageBox";

const boxCount = 3;

export default function Game() {
  
  const socket = useSocket();
  const router = useRouter();
  const dispatch = useDispatch();

  const uid = useSelector((state: RootState) => state.index.uid);
  const data = useSelector((state: RootState) => state.game);
  const [matching, setMatching] = useState(false);
  const [messageBox, setMessageBox] = useState(false);
  const canvas = useRef<HTMLDivElement>(null);
  const { startTouch, moveTouch, resetBoard } = useThree(canvas);
  
  const next = (turn: number, board: GameBoard, winner: number) => {
    dispatch(nextTurn({ turn, board, winner }));
  }

  const handleStartTouch = useCallback((e: MouseEvent | TouchEvent) => {
    if (data.mode === GameMode.network && !socket) return;

    // Handle touch. If Network game, emit data to server
    const result = startTouch(e);
    if (!result) return;

    const { idx, coord, value } = result;
    if (data.mode === GameMode.network) {      
      socket!.emit('ttt-nextTurn', { rid: data.rid, move: idx });
    }

    const newBoard = JSON.parse(JSON.stringify(data.board));
    newBoard[coord.y][coord.x] = value;
    const win = whoIsWinner(newBoard, boxCount);

    next(data.turn + 1, newBoard, win);
  }, [data.mode, data.rid, data.turn, data.board, startTouch, next]);

  const toggleMatch = (isMatch: boolean) => {
    if (!socket) return;
    setMessageBox(false);

    if (isMatch) {
      socket.emit('ttt-match');  
      setMatching(true);
    } else {
      socket.emit('ttt-leave');  
      setMatching(false);
      router.push('/');
    }
  }

  const restart = () => {
    if (data.mode === GameMode.loacl) {
      dispatch(restartGame());
      resetBoard();  
    } else {
      toggleMatch(true);
    }
  }

  useEffect(() => {
    if (data.mode === GameMode.null) {
      dispatch(reset());
      router.push('/');
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    function onNext(data: { turn: number, board: GameBoard, winner: number }) {
      const { turn, board, winner } = data;
      next(turn, board, winner);
    }

    function onLeave() {
      if (data.winner === 0) setMessageBox(true);
    }

    if (data.mode === GameMode.network) {
      socket.on('tt-nextTurn', onNext);
      socket.on('tt-leave', onLeave);
    } else {
      socket.off('tt-nextTurn', onNext);
      socket.off('tt-leave', onLeave);
    }
    
    return () => {
      socket.off('tt-nextTurn', onNext);
      socket.off('tt-leave', onLeave);
    }
  }, [socket])

  useEffect(() => {
    if (!socket) return;

    function startNetwork(data: { rid: string, players: string[] }) {
      const { rid, players } = data;
      dispatch(startNetworkGame({ rid, players }));
      resetBoard();
      setMatching(false);
    }
  
    if (matching) {
      socket.on('tt-battle', startNetwork);
    } else {
      socket.off('tt-battle', startNetwork);
    }

    return () => {
      socket.off('tt-battle', startNetwork);
    };
  }, [matching, resetBoard])

  useEffect(() => {  
      window.addEventListener('mousedown', handleStartTouch);
      window.addEventListener('mousemove', moveTouch);
      window.addEventListener('touchstart', handleStartTouch);

      return () => {
        window.removeEventListener('mousedown', handleStartTouch);
        window.removeEventListener('mousemove', moveTouch);
        window.removeEventListener('touchstart', handleStartTouch);
      };    
  }, [data.turn, data.board, data.winner, handleStartTouch , moveTouch]);

  const isYourTurn = useMemo(() => {
    return data.mode === GameMode.network &&  data.players[data.turn % 2] === uid;
  }, [data.mode, uid, data.players, data.turn]);

  return (
    <div className={styles.container}>
      <GameInfo socket={socket} />
      <div ref={canvas} className={styles.container}>
        { isYourTurn &&
          <p className={styles.yourturn}>Your Turn!</p>
        }
      </div>
      { data.winner > 0 && <WinPage winner={data.winner} restart={restart} /> }
      { matching && <Loading text="Matching" dismiss={() => toggleMatch(false)} /> }
      { messageBox &&
        <MessageBox
          message={"Player Left! You Won!"}
          button={{ name: "Match", action: () => toggleMatch(true) }}
          cancelText="Home"
          cancel={() => router.push('/') }
        />
      }
    </div>
  )
}