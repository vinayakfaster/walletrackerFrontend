import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import the axios library
import Head from 'next/head';
import styles from './TokenDetail.module.css';
import TokenPools from './TokenPools';
import { useTable } from 'react-table';
import TokenValueCalculator from './TokenValueCalculator';
import PieChart from './PieChart';
import MutualToken from './MutualToken';
import OHLCV from './OHLCV';

const TokenDetail = () => {

  if (typeof window === 'undefined') {
    return null; // or some placeholder if needed
  }

  const router = useRouter();
  const { baseTokenAddress } = router.query;
  const [tdetail, settdetail] = useState(null);
  const [combinedData, setCombinedData] = useState([]);
  const [percentageData, setPercentageData] = useState([]);
  const [holders20, setHolder20] = useState([]);
  const [tokenData, setTokenData] = useState([]);
  const myAddress = "0x4e6FB88e48711d9f692942304D48A3aFc843e99A";

  // console.log(tdetail);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const getMyPosition = await axios.get(
          "https://wallettrackerbackend.onrender.com/getMyPosition",
          {
            params: { baseTokenAddress },
          }
        );

        console.log(getMyPosition)
        const myPositionData = getMyPosition.data.evmData;

        // Ensure myPositionData is not null or undefined
        if (!myPositionData) {
          console.error('Error: Unable to fetch data');
          return;
        }


        const tokenHolders = myPositionData.TokenHolders;

        const selectedData = tokenHolders.slice(10, 42);
        setHolder20(selectedData);
        // console.log(selectedData);

        // Ensure tokenHolders is not null or empty
        if (!tokenHolders || tokenHolders.length === 0) {
          console.error('Error: No token holders data available');
          return;
        }

        // Calculate the total number of holders
        const totalHolders = tokenHolders.length;

        const allHolders = myPositionData.TokenHolders.map(holder => holder.Holder.Address);

        const myLowercaseAddress = myAddress.toLowerCase();
        const myPositionIndex = allHolders.findIndex(address => address.toLowerCase() === myLowercaseAddress);

        // Define balance ranges
        const range1 = { min: 0, max: 100 };
        const range2 = { min: 100, max: 1000 };
        const range3 = { min: 1000, max: 10000 };
        const range4 = { min: 10000, max: 100000 };
        const range5 = { min: 100000, max: 1000000 };
        const range6 = { min: 1000000, max: 1000000 };

        // Function to check if a balance falls within a range
        const isBalanceInRange = (balance, range) => balance >= range.min && balance <= range.max;

        // Count holders in each range
        const holdersInRange1 = tokenHolders.filter(holder => isBalanceInRange(parseFloat(holder.Balance.Amount), range1)).length;
        const holdersInRange2 = tokenHolders.filter(holder => isBalanceInRange(parseFloat(holder.Balance.Amount), range2)).length;
        const holdersInRange3 = tokenHolders.filter(holder => isBalanceInRange(parseFloat(holder.Balance.Amount), range3)).length;
        const holdersInRange4 = tokenHolders.filter(holder => isBalanceInRange(parseFloat(holder.Balance.Amount), range4)).length;
        const holdersInRange5 = tokenHolders.filter(holder => isBalanceInRange(parseFloat(holder.Balance.Amount), range5)).length;
        const holdersInRange6 = tokenHolders.filter(holder => isBalanceInRange(parseFloat(holder.Balance.Amount), range6)).length;
        // Calculate the percentage distribution
        const percentageInRange1 = (holdersInRange1 / totalHolders) * 100;
        const percentageInRange2 = (holdersInRange2 / totalHolders) * 100;
        const percentageInRange3 = (holdersInRange3 / totalHolders) * 100;
        const percentageInRange4 = (holdersInRange4 / totalHolders) * 100;
        const percentageInRange5 = (holdersInRange5 / totalHolders) * 100;
        const percentageInRange6 = (holdersInRange6 / totalHolders) * 100;



        // Log the results
        console.log(`Percentage of holders with balance between ${range1.min} and ${range1.max}: ${percentageInRange1.toFixed(2)}%`);
        console.log(`Percentage of holders with balance between ${range2.min} and ${range2.max}: ${percentageInRange2.toFixed(2)}%`);
        console.log('My Address Index:', myPositionIndex);

        const myBalance = myPositionIndex !== -1 ? parseFloat(tokenHolders[myPositionIndex].Balance.Amount) : 0;

        // Check if myBalance is a valid number before applying toFixed
        const balanceValue = isNaN(myBalance) ? 'N/A' : myBalance.toFixed(2);

        const newDataArray = [
          { label: 'Holders', value: totalHolders || 'Loading...' },
          { label: 'holding 0-100', value: percentageInRange1 ? percentageInRange1.toFixed(2) + '%' : 'Calculating...' },
          { label: 'holding 100-1k', value: percentageInRange2 ? percentageInRange2.toFixed(2) + '%' : 'Calculating...' },
          { label: 'holding 1k-10k', value: percentageInRange3 ? percentageInRange3.toFixed(2) + '%' : 'Calculating...' },
          { label: 'holding 10k-100k', value: percentageInRange4 ? percentageInRange4.toFixed(2) + '%' : 'Calculating...' },
          { label: 'holding 100k-1mk', value: percentageInRange5 ? percentageInRange5.toFixed(2) + '%' : 'Calculating...' },
          { label: 'holding 1m-10mk', value: percentageInRange6 ? percentageInRange6.toFixed(2) + '%' : 'Calculating...' },

          { label: 'My Position', value: myPositionIndex !== -1 ? myPositionIndex.toFixed(2) + '.' : 'Calculating...' },
          { label: `I'm holding:`, value: balanceValue }, // Add balance entry
          // Add more entries as needed
        ];
        setTokenData(newDataArray);

        const backendResponse = await axios.get(
          "https://wallettrackerbackend.onrender.com/getweb3data",
          {
            params: { baseTokenAddress },
          }
        );

        settdetail(backendResponse.data);

        const percentageData = [
          percentageInRange1,
          percentageInRange2,
          percentageInRange3,
          percentageInRange4,
          percentageInRange5,
          percentageInRange6,
        ];

        setPercentageData(percentageData);





      } catch (error) {
        console.error('Error fetching data:', error);
      }



      const combinedData = [...percentageData, ...tokenData];

      const selectedData = combinedData.slice(7, 12);
      setCombinedData(selectedData);

    };

    if (baseTokenAddress) {
      fetchData();
    }
  }, [baseTokenAddress]);



  const data = React.useMemo(
    () =>
      tokenData.map((dataEntry) => ({
        label: dataEntry.label,
        value: dataEntry.value,
      })),
    [tokenData]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: '',
        accessor: 'label', // accessor is the "key" in the data
      },
      {
        Header: '',
        accessor: 'value',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  const tokenHoldersData = {
    tokenHolders: holders20.map(holder => holder.Holder.Address),
  };
  // console.log(tokenHoldersData);


  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Other head elements */}
      </Head>

      <div>

  

        {tokenData ? (
          <div>

            <div className={styles.nutshellContainer}>
              <div className={styles.gridItem}>
                <h2>Token Holders Distribution</h2>
                <table {...getTableProps()} className={styles.table1}>
                  <thead>
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                      prepareRow(row);
                      if (row.original.label === 'My Position' || row.original.label === "I'm holding:")
                        return (
                          <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                              <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            ))}
                          </tr>
                        );
                    })}
                    <div className={styles.piecontainer}>
                    <PieChart data={percentageData} tokenData={tokenData} />
                    </div>
                  </tbody>
                </table>
              </div>

              {tdetail && (
                <div className={styles.containerDetail}>
                  <div className={styles.gridItem}>
                    <table className={styles.table3}>
                      <tbody>
                        {tdetail.data.map((detail) => (
                          <tr key={detail.key}>
                            <th>{detail.key}</th>
                            <td style={{ textAlign: 'right' }}>
                              <span style={{ marginRight: '44%' }}>{"  "}</span>
                              {detail.value}
                            </td>
                          </tr>
                        ))}
                      
                      </tbody>
                    </table>
                    <div className={styles.TokenValueCalculator}>
                          {tdetail && (
                          <TokenValueCalculator
                            pool={tdetail.data.find((item) => item.key === 'Pool Address')?.value}
                          />
                        )}
                        </div>
                  </div>
                </div>
              )}
            </div>
            {/*
            <div>
        <OHLCV poolAddress={PoolAaddress}></OHLCV>
    </div> */}
            <div className={styles.container}>
              {tdetail && (
                <TokenPools
                  // pairAddress={tdetail.data.find((item) => item.key === 'Pool Address')?.value}
                  baseTokenAddress={baseTokenAddress} 
                  PoolAaddress={tdetail.data.find((item) => item.key === 'Pool Address')?.value}
                />
              )}
            </div>

            
   

            <div className={styles.containerMutualtoken}>
              <MutualToken
                tokenHolders={{ tokenHoldersData }}
              />
            </div>

          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );

};

export default TokenDetail;