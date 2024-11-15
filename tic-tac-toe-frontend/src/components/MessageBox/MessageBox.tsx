import { memo } from 'react';
import styles from './MessageBox.module.css';

function MessageBox({
  message,
  button,
  cancel,
}: { 
  message: string,
  button: { name: string, action: ()=> void },
  cancel: ()=> void
}) {
  console.log("Message box");

  // Disable mouse or touch events in gameboard
  const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => e.stopPropagation();

  return (
    <div
      className={styles.messagebox}
      onMouseDown={stopPropagation}
      onMouseMove={stopPropagation}
      onTouchStart={stopPropagation}
    >
      <div className={styles.content}>
        <p>{message}</p>
        <div className={styles.btnsView}>
          <button onClick={cancel}>Cancel</button>
          <button onClick={button.action}>{button.name}</button>
        </div>
      </div>
    </div>
  )
}

export default memo(MessageBox);
