import axios from 'axios';
import  config  from './config'; 

const your_access_token = config.accessToken;

const url = 'https://api.upstox.com/v2/portfolio/long-term-holdings';
const headers = {
  'Accept': 'application/json',
  'Authorization': `Bearer ${your_access_token}`,
};

// Function to fetch and extract holdings data
const getHoldings = async () => {
  try {
    const response = await axios.get(url, { headers });
    const holdings = response.data.data;
    return holdings.map((holding) => {
      const { trading_symbol, last_price, pnl, average_price, quantity } = holding;
      return {
        trading_symbol,
        last_price,
        pnl,
        average_price,
        quantity,
      };
    });
  } catch (error) {
    console.error('Error fetching holdings:', error);
    throw error;
  }
};

export default {
  getHoldings,
};
