"use client";
import React, { useState, useEffect } from "react";
import { getNifty } from "../../Backend_calls/calls/upstoxAPI/nifty";

const Nifty = () => {
  const [nifty, setNifty] = useState<{ value: number | null; timestamp: number }>({
    value: null,
    timestamp: 0,
  });
  const [previousValue, setPreviousValue] = useState<number | null>(null); // Track previous value

  useEffect(() => {
    const fetchNiftyData = async () => {
      try {
        const niftyData = await getNifty();
        // console.log("Fetched Nifty Data:", niftyData);

        // Set the current Nifty data and determine the previous value for comparison
        setNifty({
          value: niftyData,
          timestamp: Date.now(), // Ensure re-render even if value is the same
        });

        setPreviousValue((prev) => prev === null ? niftyData : prev); // Set initial previous value
      } catch (error) {
        console.error("Error fetching Nifty data:", error);
      }
    };

    // Fetch data initially when component mounts
    fetchNiftyData();

    // Fetch data every 5 seconds
    const interval = setInterval(() => {
      fetchNiftyData();
    }, 5000);

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  // Determine the color based on the current value and previous value
  const getColor = () => {
    if (nifty.value === null || previousValue === null) return "text-white"; // Default to white if no data
    if (nifty.value > previousValue) return "text-[#00ff00]"; // Green if price increased
    if (nifty.value < previousValue) return "text-[#ff0000]"; // Red if price decreased
    return "text-white"; // Default color if no change
  };

  return (
    <>
      <h1 className="font-bold text-white">
        Nifty:
        <span className={`pl-1 ${getColor()}`}>
          {nifty.value !== null ? nifty.value : "Loading..."}
        </span>
      </h1>
    </>
  );
};

export default Nifty;

