import React, { useEffect, useState } from 'react';
import axios from 'axios';
const DynamicTradingChart = dynamic(() => import('./TradingChart'), { ssr: false });
import dynamic from 'next/dynamic';

const ohlcv = ({ poolAddress }) => {
  const [ohlcvData, setOhlcvData] = useState([]);
  console.log(poolAddress);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.geckoterminal.com/api/v2/networks/eth/pools/${poolAddress}/ohlcv/minute`);
        const ohlcvList = response.data.data.attributes.ohlcv_list || [];
        setOhlcvData(ohlcvList);
      } catch (error) {
        console.error('Error fetching OHLCV data:', error);
      }
    };

    fetchData();
  }, [poolAddress]);

  return (
    <div>
      <h2>Trading Chart</h2>
      <DynamicTradingChart ohlcvData={ohlcvData} />
    </div>
  );
};

export default ohlcv;
