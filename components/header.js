import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";


// import Logo from "";

export default function Header() {
  
  const { isConnected } = useAccount();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isConnected]);

  return (
    <section className={styles.header}>
      <section className={styles.header_box}>

        <section className={styles.nav}>
          <ul>
            <li className={styles.nav_li}>
              <Link href="/">My wallet</Link>
            </li>
            <li className={styles.nav_li}>
              <Link href="./Watchlist">Watchlist</Link>
            </li>
            <li className={styles.nav_li}>
              <Link href="./addwallet">addwallet</Link>
            </li>
          </ul>
          
          {isLoggedIn && (
            <section className={styles.header_connect}>
              <ConnectButton showBalance={false} accountStatus={"avatar"} />
            </section>
          )}
        </section>
      </section>
    </section>
  );
}
