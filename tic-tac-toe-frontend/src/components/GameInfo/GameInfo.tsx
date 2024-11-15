import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Socket } from 'socket.io-client';
import MessageBox from '@/components/MessageBox/MessageBox';
import { RootState } from '@/lib/store/store';
import styles from './GameInfo.module.css';

function GameInfo({ socket, turn }: { socket?: Socket, turn: number }) {
  console.log("Game Info");

  const router = useRouter();
  const isNetworkGame = useSelector((state: RootState) => state.index.isNetwork);
  const [messageBox, setMessageBox] = useState(false);

  const exitGmae = () => {
    if (isNetworkGame) socket?.emit('leaveGame');
    router.push('/');
  }

  const toggleMessageBox = (show: boolean) => {
    if (show) setMessageBox(true);
    else setMessageBox(false);
  }

  return (
    <div className={styles.info}>
      <button className={styles.exit} onClick={()=> toggleMessageBox(true)}>Exit</button>
      <div className={styles.content}>
        <Image
          className={`${styles.icon} ${!(turn % 2) && styles.on}`}
          src={'/images/circle.png'}
          alt=''
          width={50}
          height={50} />
        <Image
          className={`${styles.icon} ${(turn % 2) && styles.on}`}
          src={'/images/cross.png'}
          alt=''
          width={50}
          height={50} />
      </div>

      { messageBox &&
        <MessageBox
          message='Leave Game?'
          button={{ name: 'Leave', action: exitGmae }}
          cancel={()=> toggleMessageBox(false)}
        />
      }
    </div>
  )
}

export default memo(GameInfo);