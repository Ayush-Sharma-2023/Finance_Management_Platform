"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import config from "./config";

interface Equity {
  name: string;
  instrument_key: string;
}

const SearchEquities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [equities, setEquities] = useState<Equity[]>([]);
  const [filteredEquities, setFilteredEquities] = useState<Equity[]>([]);
  const [selectedEquity, setSelectedEquity] = useState<Equity | null>(null);
  const [quantity, setQuantity] = useState("");
  const [ltp, setLtp] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetch("/equities.json")
      .then((res) => res.json())
      .then((data) => setEquities(data))
      .catch((err) => console.error("Error fetching equities:", err));
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEquities([]);
      return;
    }
    const filtered = equities.filter((equity) =>
      equity.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEquities(filtered);
  }, [searchTerm, equities]);

  const fetchLTP = (instrumentKey: string) => {
    axios
      .get(`https://api.upstox.com/v2/market-quote/ltp?instrument_key=${instrumentKey}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${config.accessToken}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        const ltpData = Object.values(data)[0] as { last_price: number };
        setLtp(ltpData.last_price);
      })
      .catch((error) => {
        console.error("Error fetching LTP:", error);
      });
  };

  const requiredFunds = ltp && quantity ? ltp * parseInt(quantity) : 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedEquity(null);
  };

  const placeOrder = () => {
    if (!selectedEquity || !quantity) {
      alert("Please select an equity and enter a valid quantity.");
      return;
    }

    const orderData = {
      quantity: parseInt(quantity),
      product: 'D',
      validity: 'DAY',
      price: 0,
      tag: 'string',
      instrument_token: selectedEquity.instrument_key,
      order_type: 'MARKET',
      transaction_type: 'BUY',
      disclosed_quantity: 0,
      trigger_price: 0,
      is_amo: false,
    };

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${config.accessToken}`,
    };

    const url = 'https://api-hft.upstox.com/v2/order/place';

    axios.post(url, orderData, { headers })
      .then(response => {
        console.log('Order Response:', response.data);
        alert("Order placed successfully!");
        setIsDialogOpen(false);
      })
      .catch(error => {
        console.error('Error placing order:', error.message);
        alert("Error placing order.");
      });
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <Input
        type="text"
        placeholder="Search for an equity..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full p-2 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {filteredEquities.length > 0 && !selectedEquity && (
        <Card className="mt-2 p-2 bg-white border border-blue-300 rounded-md shadow-md">
          {filteredEquities.map((equity) => (
            <div
              key={equity.instrument_key}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                setSelectedEquity(equity);
                setFilteredEquities([]);
                fetchLTP(equity.instrument_key);
              }}
            >
              {equity.name}
            </div>
          ))}
        </Card>
      )}
      {selectedEquity && (
        <Card className="mt-4 p-4 bg-white border border-blue-400 rounded-md shadow-lg">
          <h3 className="text-lg font-bold text-blue-600">{selectedEquity.name}</h3>
          <p className="text-sm text-gray-600">{selectedEquity.instrument_key}</p>
          {ltp !== null && <p className="text-lg font-semibold text-blue-700">LTP: ₹{ltp}</p>}
          <Input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full mt-2 p-2 border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => {
                setIsDialogOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              BUY
            </Button>
            <Button
              onClick={() => setSelectedEquity(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 border border-blue-500">
            <h3 className="text-lg font-bold text-blue-600">Confirm Purchase</h3>
            <p className="text-sm text-gray-600">Required Funds: ₹{requiredFunds}</p>
            <div className="flex justify-between mt-4">
              <Button
                onClick={placeOrder}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-lg font-bold"
              >
                Confirm Buy
              </Button>
              <Button
                onClick={() => setIsDialogOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchEquities;