import React, { memo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './WinPage.module.css';

function WinPage({ winner, restart}: { winner: number, restart: () => void }) {

  const router = useRouter();
  const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => e.stopPropagation();

  const winnerContent = () => {
	  switch (winner) {
	  	case 1:
	  	case 2:
	  		return <>
	  		  <p>Winner</p>
	  		  <Image
	  		    className={`${styles.icon}`}
	  		    src={winner === 1 ? '/images/circle.png' : '/images/cross.png'}
	  		    alt=""
	  		    width={50}
	  		    height={50}
	  		  />
	  	  </>;
	  	case 3:
	  		return <>
	  		  <p>Draw</p>
	  		  <div className={styles.draw}>
	  		    <Image
	  		  	className={`${styles.icon}`}
	  		  	src={'/images/circle.png'}
	  		  	alt=""
	  		  	width={50}
	  		  	height={50}
	  		    />
	  		    <Image
	  		  	className={`${styles.icon}`}
	  		  	src={'/images/cross.png'}
	  		  	alt=""
	  		  	width={50}
	  		  	height={50}
	  		    />
	  		  </div>
	  		</>;
	  	default: return null;
	  }
  }

  return (
    <div
      className={styles.win}
      onMouseDown={stopPropagation}
      onMouseMove={stopPropagation}
      onTouchStart={stopPropagation}
    >
      <div className={styles.content}>
        <div className={styles.winner}>{ winnerContent() }</div>
        <div className={styles.btnsView}>
		  <button onClick={restart}>Restart</button>
          <button onClick={() => router.push('/')}>Home</button>
        </div>
      </div>
    </div>
  );
}

export default memo(WinPage);
