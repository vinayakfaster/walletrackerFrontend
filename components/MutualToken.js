import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from './MutualToken.module.css';

// ... (imports and other code)

const MutualToken = ({ tokenHolders }) => {

  if (typeof window === 'undefined') {
    return null; // or some placeholder if needed
  }

  console.log(tokenHolders);
  const [balances, setBalances] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [TokenData, setTokenData] = useState(false);
  
  const [tokenPrices, setTokenPrices] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const address = tokenHolders.tokenHoldersData.tokenHolders;
        console.log(address);

        const data = {
          query: `
          query ($network: EthereumNetwork!, $address: [String!]) {
            ethereum(network: $network) {
              address(address: {in: $address}) {
                balances(time: {till: "2024-01-26"}) {
                  currency {
                    address
                    symbol
                    tokenType
                  }
                  value
                }
              }
            }
          }
          
          `,
          variables: {
            "limit": 20,
            "offset": 0,
            "network": "ethereum", 
            "address": address
          
          },
        };

        const response = await axios.post(
          'https://graphql.bitquery.io/',
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': 'BQYZtYVGHllQQdUM4S6tuT7pFu6Vl5Ys', 
              'Authorization': 'Bearer ory_at_mk6Dn9Edj3TlyHbqGwMZZzfVZkFPqjcm-_5iBPnrcxA.E0OaDJYHOiARyJ6rkwQAYnjFqG-WN2-5DqkGh8k6jIA'
            },
          }
        );
        const ethereumData = response.data?.data?.ethereum;
        console.log(ethereumData);
        
        const resultBalances = ethereumData?.address?.reduce((acc, address) => {
          // Check if balances is not null or undefined and has at least one element
          if (address.balances && address.balances.length > 0) {
            // Check if the balance is greater than 0
            const balanceValue = address.balances[0].value || 0;
            if (balanceValue > 0) {
              acc.push({
                address: address.balances[0].currency?.address || '',
                name: address.balances[0].currency?.symbol || '',
                balance: balanceValue,
              });
            }
          }
          return acc;
        }, []) || [];
        
        setBalances(resultBalances);
        console.log(resultBalances);
        setShowResult(true);
  // Get token prices from CoinGecko Terminal
  const addressesString = resultBalances.map((result) => result.address).join(',');
  const geckoTerminalUrl = `https://api.geckoterminal.com/api/v2/simple/networks/eth/token_price/${addressesString}`;
  const geckoTerminalResponse = await axios.get(geckoTerminalUrl);
  const geckoTerminalData = geckoTerminalResponse.data?.data?.attributes?.token_prices || {};
  
  setTokenPrices(geckoTerminalData);
} catch (error) {
  console.error("Error fetching data:", error);
}
};

fetchData();
}, [tokenHolders]);

  return (
    <>
      <div>
        {showResult && balances.length > 0 ? (
          <table className={styles.tokenTable}>
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Symbol</th>
                <th>Token Balance</th>
                <th>Token Price</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((result, index) => (
                <tr key={index}>
                  <td>{result.address}</td>
                  <td>{result.name}</td>
                  <td>{result.balance}</td>
                  <td>{tokenPrices[result.address]}</td> {/* Display token price */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </>
  );
};

export default MutualToken;