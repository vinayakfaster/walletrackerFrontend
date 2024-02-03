import React from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWatchlist } from './WatchlistContext';
import styles from './ShowFav.module.css';

const ShowFav = () => {
  const { isConnected } = useAccount();
  const { watchlist } = useWatchlist();
  console.log(watchlist);

  return (
    <>
    <div className={styles.container}>
      {typeof window !== 'undefined' && isConnected ? (
       
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Token Name</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((name, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{name}</td>
                </tr>
              ))}
            </tbody>
          </table>
  
      ) : (
        <div className={styles.centeredContainer}>
          <h3>Please connect your wallet.</h3>
          <ConnectButton />
        </div>
      )}
    </div>
    </>
  );
};

export default ShowFav;
