

import get from 'axios';
import  config  from './config'; // Import specific config values
const your_access_token = config.accessToken;

const NIFFTY = 'NSE_INDEX:Nifty 50';
const url = 'https://api.upstox.com/v2/market-quote/quotes?instrument_key=NSE_INDEX|Nifty 50';
const headers = {
  Accept: 'application/json',
  Authorization: `Bearer ${your_access_token}`,
};

// Function to fetch Nifty value
const fetchNiftyData = async () => {
  try {
    const response = await get(url, { headers });
    const niftyPrice = response.data.data[NIFFTY].last_price;
    // console.log("Fetched Nifty Price:", niftyPrice); // Logs the fetched price
    return niftyPrice;
  } catch (error) {
    console.error("Error fetching Nifty data:", error);
    return null; // Return null if there's an error
  }
};

// Export an async function that always fetches the latest data
export const getNifty = fetchNiftyData;
