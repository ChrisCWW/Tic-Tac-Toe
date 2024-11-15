'use client';

import { memo, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

function Header() {

  const path = usePathname();
  const isGaming = useMemo(() => path === '/game', [path]);

  return (
    <header className={`${styles.header} ${isGaming && styles.game}`}>
      <h1>Tic Tac Toe</h1>
      <p>Created by Chris</p>
    </header>
  );
}

export default memo(Header);
