import React, { useState, useEffect } from "react";
import axios from 'axios';
import ShowPrice from "./showprice";

const Price = ({ balances }) => {
  const [apiResponse, setApiResponse] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [tokenPrices, setTokenPrices] = useState({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const contractAddresses = balances.map((token) => token.address);
        // const tokenBalance = balances.map((token) => token.balance);
        const name = balances.map((token) => token.name);
        const contractAddressesString = contractAddresses.join(',');
        // console.log(contractAddressesString);
        const response = await axios.get(
          "https://wallettrackerbackend.onrender.com/getTokenPrice",
          {
            params: { contractAddressesString },
          }
        );

        console.log(`getTokenPrice` + contractAddresses);

        const responseData = response.data.data;
        console.log(name);

        // Fetch token prices from GeckoTerminal

        const chunkArray = (arr, size) => {
          return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
          );
        };

        
        const geckoTerminalUrl = `https://api.geckoterminal.com/api/v2/simple/networks/eth/token_price`;
        const chunks = chunkArray(contractAddresses, 30);

        const geckoTerminalRequests = chunks.map(async (chunk) => {
          const chunkAddressesString = chunk.join(',');
          const response = await axios.get(`${geckoTerminalUrl}/${chunkAddressesString}`);
          return response.data?.data?.attributes?.token_prices || {};
        });

        const geckoTerminalDataArray = await Promise.all(geckoTerminalRequests);
        const geckoTerminalData = Object.assign({}, ...geckoTerminalDataArray);

        setTokenPrices(geckoTerminalData);
        console.log(geckoTerminalData)


        const tokensWithBalance = balances.map((balance) => {
          const matchingToken = responseData.find((token) =>
            normalizeAddress(token.baseTokenAddress) === normalizeAddress(balance.address)
          );

          if (matchingToken) {
            return {
              ...matchingToken,
              tokenBalance: balance.balance,
              updatedName: balance.name,
            };
          } else {
            return {
              ...balance,
              baseTokenAddress: balance.address,
              baseTokenName: "null",
              fldv: null,
              name: balance.name,
              tokenBalance: balance.balance,
              pairAddress: "null",
              priceChange: {
                h1: null,
                h6: null,
                h24: null,
                m5: null,
              },
              priceUsd: tokenPrices[balance.address] || null,
              quoteTokenAddress: "null",
              quoteTokenName: "null",
            };
          }
        });


        setApiResponse(tokensWithBalance);
        console.log(tokensWithBalance)
        setShowResult(true);
      } catch (error) {
        console.error("Error fetching token prices:", error);
      }
    };
    const normalizeAddress = (address) => address.toLowerCase();

    fetchPrices();
  }, [balances]);

  return (
    <>
      <section>
        {showResult && <ShowPrice data={apiResponse} />}
      </section>
    </>
  );
};

export default Price;
