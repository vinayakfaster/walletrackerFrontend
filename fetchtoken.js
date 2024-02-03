// Function to fetch HTML content from etherscan.io
const fetchDataFromEtherscan = async () => {
  try {
    const url = 'https://etherscan.io/token/0xf819d9cb1c2a819fd991781a822de3ca8607c3c9';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const htmlContent = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Extract price using DOM manipulation
    const priceElement = doc.querySelector('.price-tag');
    const price = priceElement ? priceElement.textContent.trim() : 'Price not found';

    console.log('Token Price:', price);
    
  } catch (error) {
    console.error('Error fetching HTML data:', error);
  }
};

// Call the function
fetchDataFromEtherscan();
