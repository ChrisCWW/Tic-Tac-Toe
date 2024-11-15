import React, { memo } from 'react';
import styles from './Loading.module.css';

function Loading({text, dismiss }: { text?: string, dismiss?: () => void }) {

  const clickBackground = () => {
    if (dismiss) dismiss();
  };

  const stopPropagation = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
  }

  return (
    <div
      className={styles.container}
      onClick={clickBackground}
      onMouseDown={stopPropagation}
      onMouseMove={stopPropagation}
      onTouchStart={stopPropagation}
      onTouchMove={stopPropagation}
    >
      <div className={styles.loading}>
        <p>
          {text || 'Loading'}
          <span>.</span>
          <span className={styles.dot1}>.</span>
          <span className={styles.dot2}>.</span>
        </p>
      </div>
    </div>
  );
}

export default memo(Loading);
