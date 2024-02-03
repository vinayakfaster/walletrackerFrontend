import React, { useState, useEffect } from 'react';
import style from'./TokenValueCalculator.module.css'; // Import your CSS file for styling
import axios from 'axios'; 

const TokenValueCalculator = ({ pool }) => {
  const [tokenValueInUSD, setTokenValueInUSD] = useState(0);
  const [amountInTokensState, setAmountInTokens] = useState('');
  const [dexScreenerData, setDexScreenerData] = useState(null);

  useEffect(() => {
    const calculateTokenValue = async () => {
      try {
        const response = await axios.get(`https://api.dexscreener.com/latest/dex/search?q=${pool}`);
        // const priceUsd = response.data.pairs.priceUsd;
        setDexScreenerData(response.data)
        console.log(dexScreenerData.pairs[0].priceUsd)

        const tokenPriceInUSD = dexScreenerData.pairs[0].priceUsd;
        const calculatedValue = parseFloat(amountInTokensState) * parseFloat(tokenPriceInUSD);
        setTokenValueInUSD(calculatedValue);
      } catch (error) {
        console.error('Error calculating token value:', error);
      }
    };

    if (amountInTokensState && pool) {
      calculateTokenValue();
    }
  }, [amountInTokensState, pool]);

  return (
    <div className={style.container}>
    <div className={style.token_value_calculator_container}>
      <div className={style.input_container}>
        <label>
          Enter Amount in Tokens:
          <input
            type="number"
            value={amountInTokensState}
            onChange={(e) => setAmountInTokens(e.target.value)}
            placeholder="Enter amount in tokens"
          />
        </label>
      </div>

      <div className={style.value_container}>
        <p>
          Token Value in USD: {tokenValueInUSD.toFixed(2)} USD
        </p>
      </div>
    </div>
    </div>
  );
};

export default TokenValueCalculator;
