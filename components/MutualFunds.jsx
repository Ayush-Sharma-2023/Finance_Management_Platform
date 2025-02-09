"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  // States for data and filters
  const [funds, setFunds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('schemeName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterType, setFilterType] = useState('');

  // Fetch mutual fund data
  const fetchMutualFunds = async (page = 1) => {
    try {
      const response = await axios.get(
        `https://service.upstox.com/mutual-funds/open/v3/funds/search?fundName=${searchTerm}&isFundNameSearch=true&sortField=${sortField}&sortOrder=${sortOrder}&page=${page}&pageSize=50`
      );
      return response.data.data.funds;
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  // Filter funds based on the selected filter type
  const filterFunds = (fundsList, filterType) => {
    if (!filterType) return fundsList;
    
    const typeMapping = {
      "Growth": "Growth",
      "Dividend Payout": "Dividend Payout",
      "Dividend Reinvestment": "Dividend Reinvestment"
    };

    const correctFilter = typeMapping[filterType.trim()] || filterType.trim();
    
    return fundsList.filter(fund => fund.optionType?.trim().toLowerCase() === correctFilter.toLowerCase());
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sorting option change
  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('-');
    setSortField(field);
    setSortOrder(order);
  };

  // Handle filter type change
  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  // Convert AUM to Lakh or Crore
  const formatAUM = (aum) => {
    const aumValue = parseFloat(aum);
    return aumValue >= 10000000
      ? `${(aumValue / 10000000).toFixed(2)} Cr`
      : `${(aumValue / 100000).toFixed(2)} L`;
  };

  // Fetch and filter data on state change
  useEffect(() => {
    const fetchAndFilterData = async () => {
      const fetchedFunds = await fetchMutualFunds();
      const filteredFunds = filterFunds(fetchedFunds, filterType);
      setFunds(filteredFunds);
    };

    fetchAndFilterData();
  }, [searchTerm, sortField, sortOrder, filterType]);

  return (
    <div className="bg-blue-50 min-h-screen p-8">
      <h1 className="text-4xl text-blue-800 font-semibold text-center mb-6">Mutual Funds</h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by Fund Name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 w-1/3 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      

      {/* Filter Options */}
      <div className="flex justify-center mb-6 space-x-4">
        <div>
          <label className="mr-2 text-blue-600">Sort By:</label>
          <select onChange={handleSortChange} className="px-4 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="schemeName-asc">Scheme Name (A-Z)</option>
            <option value="schemeName-desc">Scheme Name (Z-A)</option>
            <option value="oneYear-asc">1 Year Return (Asc)</option>
            <option value="oneYear-desc">1 Year Return (Desc)</option>
            <option value="threeYear-asc">3 Year Return (Asc)</option>
            <option value="threeYear-desc">3 Year Return (Desc)</option>
            <option value="fiveYear-asc">5 Year Return (Asc)</option>
            <option value="fiveYear-desc">5 Year Return (Desc)</option>
          </select>
        </div>
        <div>
          <label className="mr-2 text-blue-600">Filter Type:</label>
          <select onChange={handleFilterChange} className="px-4 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All</option>
            <option value="Growth">Growth</option>
            <option value="Dividend Payout">Dividend Payout</option>
            <option value="dividend reinvestment">Dividend Reinvestment</option>
          </select>
        </div>

        </div>
        <div className="mt-6 text-center">

        <a
            href="/demat"
            className="bg-white text-black py-2 px-6 rounded-lg hover:bg-gray-300 transition border-blue-500 border-2"
          >
            View demat account
          </a>
        </div>

      {/* Display Mutual Fund Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {funds.map((fund, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4">
              <h2 className="text-xl font-bold text-blue-800 mb-2">{fund.schemeName}</h2>
              <p className="text-gray-600">Option Type: {fund.optionType}</p>
              <div className="flex justify-between mt-4">
                <p className="text-blue-700 font-semibold">1 Year Return: {fund.oneYear}%</p>
                <p className="text-blue-700 font-semibold">3 Year Return: {fund.threeYear}%</p>
                <p className="text-blue-700 font-semibold">5 Year Return: {fund.fiveYear}%</p>
              </div>
              <div className='flex justify-around'>

              <div className="mt-4">
                <p className="text-gray-600">Expense Ratio: {fund.expRatio}%</p>
                <p className="text-gray-600">AUM: {formatAUM(fund.aum)}</p>
              </div>
              <div className='flex justify-center items-center mt-4'>

              <a href="https://upstox.com/mutual-funds/explore/nifty-50-return-funds " target="_blank" rel="noreferrer">

              <button
              className='bg-blue-600 text-white px-4 py-2 rounded-xl'>View</button>
              </a>
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load more button */}
      <div className="text-center mt-8">
        <button
          onClick={() => fetchMutualFunds(funds.length / 50 + 1)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg focus:outline-none hover:bg-blue-700"
        >
          Load More
        </button>
      </div>
    </div>
  );
}
