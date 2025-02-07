"use client";
import React, { useState, useEffect } from "react";

import { getFunds } from "../../Backend_calls/calls/upstoxAPI/funds";
const FUNC = () => {
  const [Value, SetValue] = useState(null); // change this

  useEffect(() => {
    const interval = setInterval(() => {
      const value = getFunds(); //change here
      if (value !== null) {
        //change here
        SetValue(value); //change here
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex gap-2 ">
        <h1 className="text-white font-bold ">Funds: </h1>
        <p className=" font-bold font-md text-[#00ff00]">{Value}</p>
      </div>
    </>
  );
};

export default FUNC;
