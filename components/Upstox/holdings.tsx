"use client"
import React, { useState, useEffect } from 'react';
// import { getHoldings } from '../calls/holdings'; // Adjust the path
import getHoldings from "../../Backend_calls/calls/upstoxAPI/holdings"

// Define the types for the holdings data
interface Holding {
  trading_symbol: string;
  last_price: number;
  pnl: number;
  average_price: number;
  quantity: number;
}

const Holdings: React.FC = () => {
  const [holdingsData, setHoldingsData] = useState<Holding[]>([]);

  // Fetch holdings data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHoldings.getHoldings();
        setHoldingsData(data);
      } catch (error) {
        console.error('Error fetching holdings data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue">My Holdings</h1>
      {holdingsData.length > 0 ? (
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden border-collapse">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Company</th>
              <th className="py-3 px-6 text-left">Average Price</th>
              <th className="py-3 px-6 text-left">Last Price</th>
              <th className="py-3 px-6 text-left">P&L</th>
              <th className="py-3 px-6 text-left">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {holdingsData.map((holding, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } border-b hover:bg-gray-100`}
              >
                <td className="py-4 px-6">{holding.trading_symbol}</td>
                <td className="py-4 px-6">{`₹ ${holding.average_price.toFixed(2)}`}</td>
                <td className="py-4 px-6">{`₹ ${holding.last_price.toFixed(2)}`}</td>
                <td
                  className={`py-4 px-6 ${
                    holding.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {`₹ ${holding.pnl.toFixed(2)}`}
                </td>
                <td className="py-4 px-6">{holding.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-xl">Loading holdings...</p>
      )}
    </div>
  );
};

export default Holdings;
