import axios from "axios";

async function fetchMutualFunds() {
  const pageSize = 50; // Number of results per page
  let currentPage = 1; // Start from page 1
  let totalFunds = [];
  
  try {
    while (true) {
      // Construct the URL with pagination parameters
      const response = await axios.get(
        `https://service.upstox.com/mutual-funds/open/v3/funds/search?fundName=adi&isFundNameSearch=true&sortField=schemeName&sortOrder=asc&page=${currentPage}&pageSize=${pageSize}`
      );
      
      const funds = response.data.data.funds;
      totalFunds = [...totalFunds, ...funds]; // Add current page funds to the total list
      
      // Check if we've fetched all pages (based on the number of funds returned)
      if (funds.length < pageSize) {
        break; // No more pages, exit the loop
      }
      
      currentPage++; // Move to the next page
    }
    
    console.log(totalFunds); // Print all mutual funds
    
  } catch (error) {
    console.error("Error fetching data:", error.response?.data || error.message);
  }
}

fetchMutualFunds();
