"use client";
import React, { useState, useEffect } from "react";

export default function Taxations() {
  const [salary, setSalary] = useState("");
  const [taxOld, setTaxOld] = useState(null);
  const [taxNew, setTaxNew] = useState(null);

  // State for toggles for deductions
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
    let slabBreakdown = [];
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
        let taxForSlab = taxableAmount * rate;
        slabBreakdown.push({ slab: `₹${prevLimit} - ₹${limit}`, rate: `${rate * 100}%`, taxPaid: taxForSlab });
        tax += taxForSlab;
        prevLimit = limit;
      } else break;
    }

    return { totalTax: tax, slabBreakdown };
  };

  const calculateTaxNew = (income) => {
    if (income <= 1200000) {
      return { totalTax: 0, slabBreakdown: [] };
    }

    let tax = 0;
    let slabBreakdown = [];
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
        let taxForSlab = taxableAmount * rate;
        slabBreakdown.push({ slab: `₹${prevLimit} - ₹${limit}`, rate: `${rate * 100}%`, taxPaid: taxForSlab });
        tax += taxForSlab;
        prevLimit = limit;
      } else break;
    }

    const excessIncome = income - 1200000;
    if (tax > excessIncome) {
      tax = excessIncome;
    }

    return { totalTax: tax, slabBreakdown };
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tax Calculation</h1>
      <div className="mb-4">
        <label htmlFor="salary" className="block text-lg">
          Enter your salary:
        </label>
        <input
          type="number"
          id="salary"
          value={salary}
          onChange={handleSalaryChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter salary"
        />
      </div>

      {taxOld !== null || taxNew !== null ? (
        <div className="mt-8 flex space-x-8">
          {/* Old Tax Regime Section */}
          {taxOld && (
            <div className="w-1/2">
              <h2 className="text-xl font-semibold mb-4">Old Tax Regime</h2>
              <p>Total Tax: ₹{taxOld.totalTax}</p>

              <h3 className="text-lg font-medium mt-4">Tax Breakdown per Slab</h3>
              <table className="table-auto w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border p-2">Slab</th>
                    <th className="border p-2">Tax Rate</th>
                    <th className="border p-2">Tax Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {taxOld.slabBreakdown.map((slab, index) => (
                    <tr key={index}>
                      <td className="border p-2">{slab.slab}</td>
                      <td className="border p-2">{slab.rate}</td>
                      <td className="border p-2">₹{slab.taxPaid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Deduction Toggle Section */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Deductions</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setStandardDeduction(!standardDeduction)}
                    className={`p-2 ${standardDeduction ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    Standard Deduction
                  </button>
                  <button
                    onClick={() => setSection80C(!section80C)}
                    className={`p-2 ${section80C ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    Section 80C
                  </button>
                  <button
                    onClick={() => setSection80D(!section80D)}
                    className={`p-2 ${section80D ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    Section 80D
                  </button>
                  <button
                    onClick={() => setSection24B(!section24B)}
                    className={`p-2 ${section24B ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    Section 24B
                  </button>
                  <button
                    onClick={() => setSection80E(!section80E)}
                    className={`p-2 ${section80E ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    Section 80E
                  </button>
                  <button
                    onClick={() => setSection80G(!section80G)}
                    className={`p-2 ${section80G ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    Section 80G
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* New Tax Regime Section */}
          {taxNew && (
            <div className="w-1/2">
              <h2 className="text-xl font-semibold mb-4">New Tax Regime</h2>
              <p>Total Tax: ₹{taxNew.totalTax}</p>

              <h3 className="text-lg font-medium mt-4">Tax Breakdown per Slab</h3>
              <table className="table-auto w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border p-2">Slab</th>
                    <th className="border p-2">Tax Rate</th>
                    <th className="border p-2">Tax Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {taxNew.slabBreakdown.map((slab, index) => (
                    <tr key={index}>
                      <td className="border p-2">{slab.slab}</td>
                      <td className="border p-2">{slab.rate}</td>
                      <td className="border p-2">₹{slab.taxPaid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
