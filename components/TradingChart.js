import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const options = {
  chart: {
    type: 'candlestick',
    height: 350,
    background: '#00000', // Set background color
  },
  title: {
    text: 'Trading Chart',
    align: 'left',
    style: {
      color: '#0f0f0f', // Set title text color
    },
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
  },
  tooltip: {
    theme: 'dark', // Use a dark theme for better visibility
    style: {
      fontSize: '14px', // Adjust font size
      borderColor: '#000', // Set border color
      backgroundColor: '', // Set background color
      color: '#000', // Set text color
    },
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: '#00b050', // Set color for upward candles
        downward: '#ff0000', // Set color for downward candles
      },
    },
  },
};

const TradingChart = ({ ohlcvData }) => {
  if (typeof window === 'undefined') {
    return null; // or some placeholder if needed
  }

  const series = [
    {
      data: ohlcvData?.map(([timestamp, open, high, low, close, volume]) => ({
        x: new Date(timestamp * 1000),
        y: [open, high, low, close],
      })) || [],
    },
  ];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="candlestick"
      height={350}
    />
  );
};

export default TradingChart;
