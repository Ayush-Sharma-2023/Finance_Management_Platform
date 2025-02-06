"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [funds, setFunds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('schemeName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterType, setFilterType] = useState('');
  const [hasMore, setHasMore] = useState(true); // To handle 'Load More' logic

  const fetchMutualFunds = async (page = 1) => {
    try {
      const response = await axios.get(
        `https://service.upstox.com/mutual-funds/open/v3/funds/search?fundName=${searchTerm}&isFundNameSearch=true&sortField=${sortField}&sortOrder=${sortOrder}&page=${page}&pageSize=9`
      );
      let filteredFunds = response.data.data.funds;

      if (filterType) {
        const typeMapping = {
          "Growth": "Growth",
          "Dividend Payout": "Dividend Payout",
          "Dividend Reinvestment": "Dividend Reinvestment"
        };
        const correctFilter = typeMapping[filterType.trim()] || filterType.trim();
        filteredFunds = filteredFunds.filter(fund => {
          const option = fund.optionType?.trim().toLowerCase();
          return option === correctFilter.toLowerCase();
        });
      }

      setFunds((prevFunds) => [...prevFunds, ...filteredFunds]);

      // If less than 9 funds are returned, disable further load
      if (filteredFunds.length < 9) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setFunds([]); // Reset funds on search term change
    fetchMutualFunds(); // Fetch new data based on search
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('-');
    setSortField(field);
    setSortOrder(order);
    setFunds([]); // Reset funds on sort option change
    fetchMutualFunds(); // Fetch new data with sorting applied
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setFunds([]); // Reset funds on filter change
    fetchMutualFunds(); // Fetch new data based on filter
  };

  const formatAUM = (aum) => {
    const aumValue = parseFloat(aum);
    return aumValue >= 10000000
      ? `${(aumValue / 10000000).toFixed(2)} Cr`
      : `${(aumValue / 100000).toFixed(2)} L`;
  };

  useEffect(() => {
    fetchMutualFunds();
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
          className="px-4 py-2 w-full sm:w-1/2 lg:w-1/3 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <option value="Dividend Reinvestment">Dividend Reinvestment</option>
          </select>
        </div>
      </div>

      {/* Display Mutual Fund Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {funds.map((fund, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl">
            <div className="px-6 py-4">
              <h2 className="text-xl font-bold text-blue-800 mb-2">{fund.schemeName}</h2>
              <p className="text-gray-600">Option Type: {fund.optionType}</p>
              <div className="flex justify-between mt-4">
                <p className="text-blue-700 font-semibold">1 Year Return: {fund.oneYear}%</p>
                <p className="text-blue-700 font-semibold">3 Year Return: {fund.threeYear}%</p>
                <p className="text-blue-700 font-semibold">5 Year Return: {fund.fiveYear}%</p>
              </div>
              <div className="mt-4">
                <p className="text-gray-600">Expense Ratio: {fund.expRatio}%</p>
                <p className="text-gray-600">AUM: {formatAUM(fund.aum)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => fetchMutualFunds(funds.length / 9 + 1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg focus:outline-none hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
