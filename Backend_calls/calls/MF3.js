import axios from "axios";

async function fetchMutualFunds() {
  try {
    const response = await axios.get(
      "https://service.upstox.com/mutual-funds/open/v3/funds/search?fundName=adi&isFundNameSearch=true&sortField=schemeName&sortOrder=asc"
    );

    // console.log(response.data); // Check if it returns mutual fund details
    console.log(response.data.data.funds); // Check if it returns mutual fund details
  } catch (error) {
    console.error("Error fetching data:", error.response?.data || error.message);
  }
}

fetchMutualFunds();
