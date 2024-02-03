import React, { useState, useEffect } from 'react';
import { useWatchlist } from './WatchlistContext';
import styles from './ShowPrice.module.css'; // Ensure the correct import path
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { Illustration } from '@web3uikit/core';

const ShowPrice = ({ data }) => {
  const [tokens, setTokens] = useState(data || []);
  const address = useAccount();
  const [searchQuery, setSearchQuery] = useState('');
  const { addToWatchlist, isTokenInWatchlist, removeFromWatchlist } = useWatchlist();
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortKey, setSortKey] = useState(null);
  console.log(tokens);

  const formatBalance = (balance) => {
    if (balance < 1000) {
      return balance.toFixed(2); // Keep two decimal places if less than 1000
    } else if (balance < 1000000) {
      return (balance / 1000).toFixed(2) + 'k'; // Convert to thousands
    } else if (balance < 1000000000) {
      return (balance / 1000000).toFixed(2) + 'M'; // Convert to millions
    } else {
      return (balance / 1000000000).toFixed(2) + 'B'; // Convert to billions
    }
  };

  useEffect(() => {
    // Update tokens when data changes
    setTokens(data || []);
  }, [data]);

  const sortTokens = (key) => {
    let sortedTokens = [...tokens];
    let order = 'asc';

    if (sortKey === key) {
      // If clicking on the same column, reverse the order
      order = sortOrder === 'asc' ? 'desc' : 'asc';
    }

    sortedTokens = sortedTokens.sort((a, b) => {
      const valueA = key.split('.').reduce((obj, k) => obj[k], a);
      const valueB = key.split('.').reduce((obj, k) => obj[k], b);

      return order === 'asc' ? valueA - valueB : valueB - valueA;
    });

    setTokens(sortedTokens);
    setSortOrder(order);
    setSortKey(key);
  };

  const handleAddToFav = (tokenName) => {
    if (isTokenInWatchlist(tokenName)) {
      removeFromWatchlist(tokenName);
    } else {
      addToWatchlist(tokenName);
    }
  };

  // Utility function to convert Wei to Ether
  const weiToEther = (wei) => {
    const ether = wei / 1e18; // Assuming 1 Ether = 1e18 Wei
    return ether.toFixed(4); // Adjust the precision as needed
  };

  const normalizeTokenName = (token) => {
    return token.name || token.symbol || 'Unknown';
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTokens = tokens.filter((token) => {
    const normalizedTokenName = normalizeTokenName(token).toLowerCase();
    const normalizedSearchQuery = searchQuery.toLowerCase();
    return normalizedTokenName.includes(normalizedSearchQuery);
  });

  


  return (
    <section className={styles.main}>
      <div>
        <input
          type="text"
          placeholder="Search tokens..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>

      <section className={styles.result}>
        <table className={styles.tokenTable}>
          <thead>
            <tr>
              <th className={styles.name} onClick={() => sortTokens('name')}>
                count
              </th>
              <th className={styles.amount} onClick={() => sortTokens('priceUsd')}>
              Token Name
              </th>
              <th className={styles.name} onClick={() => sortTokens('tokenBalance')}>
              Price USD
              </th>
              <th className={styles.amount} onClick={() => sortTokens('priceChange.m5')}>
              Holding
              </th>
              <th className={styles.amount} onClick={() => sortTokens('priceChange.h1')}>
                m5
              </th>
              <th className={styles.amount} onClick={() => sortTokens('priceChange.h6')}>
                h1
              </th>
              <th className={styles.amount} onClick={() => sortTokens('priceChange.h24')}>
                h6
              </th>
              <th className={styles.amount} onClick={() => sortTokens('priceChange.h24')}>
                h24
              </th>
              <th>Actions</th>

            </tr>
            
          </thead>
          <tbody>
            {filteredTokens.map((token, index) => (
              <tr className={styles.tokenContainer} key={index}>
                {/* You may need to replace this part with your actual image */}
                  <t>{index + 1}</t>
                <td>
                  <Link href={`/TokenDetail?baseTokenAddress=${encodeURIComponent(token.baseTokenAddress)}`} passHref>
                    <p className={styles.name}>{normalizeTokenName(token)}</p>
                  </Link>
                </td>
                <td className={styles.amount}>{"$" + token.priceUsd}</td>
                <td className={styles.amount}>{token.tokenBalance}</td>
                <td className={`${styles.amount} ${token.priceChange.m5 >= 0 ? styles.positive : styles.negative}`}>
                  {token.priceChange.m5 + '%'}
                </td>
                <td className={`${styles.amount} ${token.priceChange.h1 >= 0 ? styles.positive : styles.negative}`}>
                  {token.priceChange.h1 + '%'}
                </td>
                <td className={`${styles.amount} ${token.priceChange.h6 >= 0 ? styles.positive : styles.negative}`}>
                  {token.priceChange.h6 + '%'}
                </td>
                <td className={`${styles.amount} ${token.priceChange.h24 >= 0 ? styles.positive : styles.negative}`}>
                  {token.priceChange.h24 + '%'}
                </td>
                <td>
                  <button onClick={() => handleAddToFav(token.name)}>
                    {isTokenInWatchlist(token.name) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {/* <tr className={`${styles.tokenContainer} ${index % 2 === 0 ? styles.evenRow : styles.oddRow}`}>
  </tr> */}
    </section>


  );
};

export default ShowPrice;
