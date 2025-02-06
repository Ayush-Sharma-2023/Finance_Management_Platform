"use client";
import React, { useState, useEffect } from "react";

export default function Taxations() {
  const [salary, setSalary] = useState("");
  const [taxOld, setTaxOld] = useState(null);
  const [taxNew, setTaxNew] = useState(null);

  const [standardDeduction, setStandardDeduction] = useState(true);
  const [section80C, setSection80C] = useState(true);
  const [section80D, setSection80D] = useState(true);
  const [section24B, setSection24B] = useState(true);
  const [section80E, setSection80E] = useState(true);
  const [section80G, setSection80G] = useState(true);

  const handleSalaryChange = (e) => {
    setSalary(e.target.value);
  };

  useEffect(() => {
    if (salary && !isNaN(salary) && salary > 0) {
      const income = parseFloat(salary);
      setTaxOld(calculateTaxOld(income));
      setTaxNew(calculateTaxNew(income));
    }
  }, [salary, standardDeduction, section80C, section80D, section24B, section80E, section80G]);

  const calculateTaxOld = (income) => {
    const totalDeductions = (
      (standardDeduction ? 50000 : 0) +
      (section80C ? 150000 : 0) +
      (section80D ? 50000 : 0) +
      (section24B ? 200000 : 0) +
      (section80E ? 50000 : 0) +
      (section80G ? 50000 : 0)
    );

    const taxableIncome = Math.max(0, income - totalDeductions);

    let tax = 0;
    const slabs = [
      { limit: 250000, rate: 0 },
      { limit: 500000, rate: 0.05 },
      { limit: 1000000, rate: 0.2 },
      { limit: Infinity, rate: 0.3 },
    ];

    let prevLimit = 0;
    for (let { limit, rate } of slabs) {
      if (taxableIncome > prevLimit) {
        let taxableAmount = Math.min(taxableIncome, limit) - prevLimit;
        tax += taxableAmount * rate;
        prevLimit = limit;
      } else break;
    }

    return { totalTax: tax };
  };

  const calculateTaxNew = (income) => {
    let tax = 0;
    const slabs = [
      { limit: 400000, rate: 0 },
      { limit: 800000, rate: 0.05 },
      { limit: 1200000, rate: 0.1 },
      { limit: 1600000, rate: 0.15 },
      { limit: 2000000, rate: 0.2 },
      { limit: 2400000, rate: 0.25 },
      { limit: Infinity, rate: 0.3 },
    ];

    let prevLimit = 0;
    for (let { limit, rate } of slabs) {
      if (income > prevLimit) {
        let taxableAmount = Math.min(income, limit) - prevLimit;
        tax += taxableAmount * rate;
        prevLimit = limit;
      } else break;
    }
    return { totalTax: tax };
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">Tax Calculation</h1>
      <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
        <label htmlFor="salary" className="block text-lg font-semibold text-gray-700">Enter your salary:</label>
        <input
          type="number"
          id="salary"
          value={salary}
          onChange={handleSalaryChange}
          className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter salary"
        />
      </div>
      {taxOld !== null || taxNew !== null ? (
        <div className="grid grid-cols-2 gap-6">
          {/* Old Tax Regime */}
          {taxOld && (
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">Old Tax Regime</h2>
              <p className="text-lg font-bold">Total Tax: ₹{taxOld.totalTax}</p>
              <div className="mt-4 space-y-2">
                {[{ label: "Standard Deduction", state: standardDeduction, setter: setStandardDeduction },
                  { label: "Section 80C", state: section80C, setter: setSection80C },
                  { label: "Section 80D", state: section80D, setter: setSection80D },
                  { label: "Section 24B", state: section24B, setter: setSection24B },
                  { label: "Section 80E", state: section80E, setter: setSection80E },
                  { label: "Section 80G", state: section80G, setter: setSection80G }].map((deduction, index) => (
                  <button
                    key={index}
                    onClick={() => deduction.setter(!deduction.state)}
                    className={`w-full text-white font-semibold p-2 rounded-lg transition-all duration-300 ${deduction.state ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 hover:bg-gray-500'}`}
                  >
                    {deduction.label} {deduction.state ? "(Applied)" : "(Removed)"}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* New Tax Regime */}
          {taxNew && (
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">New Tax Regime</h2>
              <p className="text-lg font-bold">Total Tax: ₹{taxNew.totalTax}</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
