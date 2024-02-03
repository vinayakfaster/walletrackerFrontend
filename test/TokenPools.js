import React, { useEffect, useState } from 'react';
import styles from './TokenPools.module.css';
import axios from 'axios';

const TokenPools = ({ pairAddress, baseTokenAddress }) => {
  const [liquidityData, setLiquidityData] = useState(null);
  const [totalTokenVolume, setTotalTokenVolume] = useState(0);
  const [totalLiquidity, setTotalLiquidity] = useState(0);
  // const pairAddress = pairAddresss;
  console.log(pairAddress);
  console.log(baseTokenAddress);

  useEffect(() => {
    const fetchLiquidityData = async () => {
      try {
        const response = await axios.post(
          'https://streaming.bitquery.io/graphql',
          {
            query: `
              {
                EVM(dataset: combined, network: eth) {
                  Initaial_liquidity: Transfers(
                    limit: { count: 2 }
                    orderBy: { ascending: Block_Time }
                    where: { Transfer: { Receiver: { is: "${pairAddress}" } } }
                  ) {
                    Transaction {
                      Hash
                    }
                    Transfer {
                      Amount
                      Currency {
                        SmartContract
                        Name
                        Symbol
                      }
                    }
                  }
                  Current_lquidity: BalanceUpdates(
                    where: { BalanceUpdate: { Address: { is: "${pairAddress}" } }, Currency: { SmartContract: { in: ["${baseTokenAddress}", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"] } } }
                    orderBy: { descendingByField: "balance" }
                  ) {
                    Currency {
                      Name
                      SmartContract
                    }
                    balance: sum(of: BalanceUpdate_Amount, selectWhere: { gt: "0" })
                    BalanceUpdate {
                      Address
                    }
                  }
                  volume: DEXTrades(
                    where: { Block: { Time: { since: "2023-12-28T10:01:55.000Z" } }, Trade: { Dex: { Pair: { SmartContract: { is: "${pairAddress}" } } } } }
                  ) {
                    token1_vol: sum(of: Trade_Buy_Amount)
                    token2_vol: sum(of: Trade_Sell_Amount)
                  }
                }
              }
            `,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': 'Your_API_KEY', // Replace with your actual API key
            },
          }
        );
        const pairResponse = response.data?.data?.EVM;

        console.log(pairResponse);

        if (pairResponse) {
          const { Current_lquidity, Initaial_liquidity, volume } = pairResponse;

          // Log or further process the extracted arrays
          console.log('Current Liquidity:', Current_lquidity);
          console.log('Initial Liquidity:', Initaial_liquidity);
          console.log('Volume:', volume);

          // Set the extracted arrays to state
          setLiquidityData({ Current_lquidity, Initaial_liquidity, volume });

          // Calculate total token volume
          const tokenVolumes = volume.map(entry => parseFloat(entry.token1_vol) + parseFloat(entry.token2_vol));
          const totalVolume = tokenVolumes.reduce((total, volume) => total + volume, 0);
          setTotalTokenVolume(totalVolume);

          // Calculate total liquidity
          const liquidityArray = Current_lquidity.map(entry => parseFloat(entry.balance));
          const totalLiquidity = liquidityArray.reduce((total, liquidity) => total + liquidity, 0);
          setTotalLiquidity(totalLiquidity);
        }
      } catch (error) {
        console.error('Error fetching liquidity data:', error);
      }
    };

    if (pairAddress) {
      fetchLiquidityData();
    }
  }, [pairAddress]);

  return (
    <div className={styles['token_data_box']}>
      <h3>Liquidity Data</h3>
      {liquidityData ? (
        <div>
          <p>Total Token Volume: {totalTokenVolume}</p>
          <p>Total Liquidity: {totalLiquidity}</p>

          {/* Your existing table and rendering logic */}
          
          <table className={styles['liquidity-table']}>
          <tr>
            <th>Token Current Liquidity</th>
            <th>Balance</th>
          </tr>
          {liquidityData.Current_lquidity.map((entry) => (
            <tr key={entry.BalanceUpdate?.Currency?.SmartContract}>
              <td>{entry.Currency?.Name}</td>
              <td>{entry.balance}</td>
            </tr>
          ))}
                <tr>
            <th>Token Initaial Liquidity</th>
            <th>Amount </th>
          </tr>
            {liquidityData.Initaial_liquidity.map((entry) => (
            <tr key={entry.Transaction?.Hash}>
              <td>{entry.Transfer?.Currency?.Name}</td>
              <td>{entry.Transfer?.Amount}</td>
            </tr>
          ))}
                    <tr>
            <th>Token1 Volume</th>
            <th>Token2 Volume</th>
          </tr>
            {liquidityData.volume.map((entry, index) => (
  <tr key={`${index}_${entry.token1_vol}_${entry.token2_vol}`}>
    <td>{entry.token1_vol}</td>
    <td>{entry.token2_vol}</td>
  </tr>
))}
          </table>
        </div>
      ) : (
        <p>Loading liquidity data...</p>
      )}
    </div>
  );
};

export default TokenPools;