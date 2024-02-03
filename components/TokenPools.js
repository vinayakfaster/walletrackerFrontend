import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './TokenPools.module.css';
import OHLCV from './OHLCV';

const TokenPools = ({ baseTokenAddress, PoolAaddress }) => {
  const [dexScreenerData, setDexScreenerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [isHoverDisabled, setIsHoverDisabled] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/ethereum/${PoolAaddress}`);
        setDexScreenerData(response.data);
      } catch (error) {
        setError('Error fetching data from DexScreener');
      } finally {
        setLoading(false);
      }
    };

    if (baseTokenAddress) {
      fetchData();
    }
  }, [baseTokenAddress]);

  const handleMouseEnter = () => {
    if (!isHoverDisabled) {
      setIsChartVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isHoverDisabled) {
      setIsChartVisible(false);
    }
  };

  const toggleChartVisibility = () => {
    setIsChartVisible(!isChartVisible);
    setIsHoverDisabled(!isHoverDisabled);
  };
  const convertData = () => {
    if (!dexScreenerData || dexScreenerData.pairs.length === 0) {
      return [];
    }

    return dexScreenerData.pairs.map((pair) => ({
      dexId: pair.dexId,
      baseToken: pair.baseToken.symbol,
      quoteToken: pair.quoteToken.symbol,
      priceUsd: pair.priceUsd,
      vol1: pair.volume.h1,
      vol24: pair.volume.h24,
      priceChange1: pair.priceChange.h1,
      priceChange24: pair.priceChange.h24,
      liquidity: pair.liquidity.usd,
      fdv: pair.fdv,
      buyTxns: pair.txns.h24.buys,
      sellTxns: pair.txns.h24.sells,
    }));
  };

  const renderTable = () => {
    const rows = convertData();

    return (
      <div className={styles.TableContainer}  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <button onClick={toggleChartVisibility}>Toggle Chart</button>
        <table style={{ minWidth: '100%', borderCollapse: 'collapse', marginTop: '20px' }} aria-label="token pool table">
          <thead>
            <tr>
              <th className="data-cell">Dex</th>
              <th className="data-cell">Base Token</th>
              <th className="data-cell">Price (USD)</th>
              <th className="data-cell">Vol h1</th>
              <th className="data-cell">Vol h24</th>
              <th className="data-cell">Price Ch. h1</th>
              <th className="data-cell">Price Ch. h24</th>
              <th className="data-cell">Liquidity</th>
              <th className="data-cell">FDV</th>
              <th className="data-cell">Buy/Sell</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <TableRow key={index} {...row} />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const TableRow = ({ dexId, baseToken, quoteToken, priceUsd, vol1, vol24, priceChange1, priceChange24, liquidity, fdv, buyTxns, sellTxns }) => (
    <tr style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
      <td className="data-cell">{dexId}</td>
      <td className="data-cell">{`${baseToken}/${quoteToken}`}</td>
      <td className="data-cell" style={{ fontWeight: 'bold' }}>{priceUsd}</td>
      <td className="data-cell">{vol1}</td>
      <td className="data-cell">{vol24}</td>
      <td className="data-cell">{priceChange1}</td>
      <td className="data-cell">{priceChange24}</td>
      <td className="data-cell">{liquidity}</td>
      <td className="data-cell">{fdv}</td>
      <td className="data-cell">{`${buyTxns}/${sellTxns}`}</td>
    </tr>
  );

  return (
    <div>
      <h3>Token Pools</h3>
      {loading && <p>Loading DexScreener data...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && dexScreenerData && renderTable()}
      <div>
      {isChartVisible && <OHLCV poolAddress={PoolAaddress}></OHLCV>}
      </div>
    </div>
  );
};

export default TokenPools;
