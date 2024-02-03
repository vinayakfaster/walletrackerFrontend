// Import necessary modules and components
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChart = ({ data, tokenData }) => {

  const combinedData = [...data, ...tokenData];

  const selectedData = combinedData.slice(7, 12);
  console.log(selectedData);

  const canvasRef = useRef(null);
// console.log(data)
useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    const labels = selectedData.map((entry) => entry.label);
    const values = selectedData.map((entry) => parseFloat(entry.value.replace('%', '')));
  
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4CAF50',
              '#FF9800',
              '#9C27B0',
              '#607D8B', // Add more colors as needed
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: 'right',
            align: 'start',
            labels: {
              boxWidth: 20, // Width of the colored box
              padding: 15, // Padding between labels
              font: {
                size: 14, // Font size
              },
            },
          },
        },
        // Additional customization options for the chart
        responsive: false,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: (tooltipItem, selectedData) => {
              const label = selectedData.labels[tooltipItem.index];
              const value = selectedData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%';
              return `${label}: ${value}`;
            },
          },
        },
      },
    });
  
    return () => {
      // Cleanup the chart when the component is unmounted
      chart.destroy();
    };
  }, [selectedData]);
  

  return (
    <div>
      {/* <h2>Token Holders Distribution</h2> */}
      <canvas ref={canvasRef} width={350} height={200} />
    </div>
  );
};

export default PieChart;
