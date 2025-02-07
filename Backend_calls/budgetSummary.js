// BudgetSummary.js
import React from 'react';

const BudgetSummary = ({ remainingBudget, totalExpenses }) => {
  return (
    <div className="p-6 shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Budget Summary</h2>

      <div className="flex justify-between text-sm">
        <span>Total Expenses:</span>
        <span className="font-semibold">₹{totalExpenses.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Remaining Budget:</span>
        <span className={`font-semibold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>₹{remainingBudget.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default BudgetSummary;
