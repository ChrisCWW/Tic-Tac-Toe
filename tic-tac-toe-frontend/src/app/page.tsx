'use client';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading/Loading";
import { matchedGame, updateIsNetwork } from "@/lib/store/features/indexSlice";
import styles from "./page.module.css";
import { RootState } from "@/lib/store/store";
import useSocket from "@/hooks/useSocket";

export default function Home() {
  console.log("Home");

  const socket = useSocket();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const isConnect = useSelector((state: RootState)=> state.index.isConnect);
  const [matching, setMatching] = useState(false);

  const startLocalGame = () => {
    dispatch(updateIsNetwork(false));
    router.push('/game');
  }

  const toggleMatch = (isMatch: boolean) => {
    if (isMatch) {
      setMatching(true);
    } else {
      setMatching(false);
    }
  }

  // useEffect(() => {
  //   if (!socket) return;

  //   // Function to start a network game when a match is found and user still in matching, otherwise cancel it
  //   function startNetworkGame(data: { uid: string, players: string[] }) {
  //     if (matching) {
  //       dispatch(matchedGame(data));
  //       router.push('/game');  
  //     } else {
  //       socket?.emit('cancelMatch');
  //     }
  //   }
  
  //   // Register the match listener when matching is true, otherwise cleanup it
  //   if (matching) {
  //     socket.on('match', startNetworkGame);
  //     socket.emit('match');  
  //   } else {
  //     socket.off('match', startNetworkGame);
  //     socket.emit('cancelMatch');
  //   }

  //   // Cleanup function to remove event listeners and cancel matching
  //   return () => {
  //     socket.off('match', startNetworkGame);
  //     socket.emit('cancelMatch');
  //   };
  // }, [matching])
  
  return (
    <div className={styles.container}>
      <button onClick={startLocalGame}>Local</button>
      <button
        className={`${!isConnect && styles.disabled}`}
        onClick={()=> toggleMatch(true)}
      >
        Match Game
        <div className={`${styles.online} ${isConnect && styles.on}`}></div>
      </button>
      { matching && <Loading text="Matching" dismiss={() => toggleMatch(false)} /> }
    </div>
  );
}
