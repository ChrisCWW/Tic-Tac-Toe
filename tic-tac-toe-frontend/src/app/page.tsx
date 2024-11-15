'use client';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading/Loading";
import useSocket from "@/hooks/useSocket";
import { startLocalGame, startNetworkGame } from "@/lib/store/features/GameSlice";
import { RootState } from "@/lib/store/store";
import styles from "./page.module.css";

export default function Home() {

  const socket = useSocket();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const isConnect = useSelector((state: RootState)=> state.index.isConnect);
  const [matching, setMatching] = useState(false);

  const toggleMatch = (isMatch: boolean) => {
    if (isMatch) {
      socket?.emit('ttt-match');  
      setMatching(true);
    } else {
      socket?.emit('ttt-leave');  
      setMatching(false);
    }
  }

  const startLocal = () => {
    dispatch(startLocalGame());
    router.push('/game');
  }

  useEffect(() => {
    if (!socket) return;

    function startNetwork(data: { rid: string, players: string[] }) {
      const { rid, players } = data;
      dispatch(startNetworkGame({ rid, players }));
      router.push('/game');
    }
  
    if (matching) {
      socket.on('tt-battle', startNetwork);
    } else {
      socket.off('tt-battle', startNetwork);
    }

    return () => {
      socket.off('tt-battle', startNetwork);
    };
  }, [matching])
  
  return (
    <div className={styles.container}>
      <button onClick={startLocal}>Local</button>
      <button
        className={`${!isConnect && styles.disabled}`}
        onClick={()=> toggleMatch(true)}
      >
        Match
        <div className={`${styles.online} ${isConnect && styles.on}`}></div>
      </button>
      { matching && <Loading text="Matching" dismiss={() => toggleMatch(false)} /> }
    </div>
  );
}
