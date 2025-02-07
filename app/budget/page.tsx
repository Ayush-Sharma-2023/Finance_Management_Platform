'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Wallet } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Link from 'next/link';

export default function BudgetManager() {
  const [budgetData, setBudgetData] = useState({
    salary: '',
    categories: [],
    savingsGoal: '',
    finalIncome: 0,
    monthlyIncome: 0,
    totalExpense: 0,
    remainingBudget: 0,
    investments: [],
  });

  // Fetch data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('budgetData');

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setBudgetData(parsedData);

      // Logging for debugging
      console.log('Stored Budget Data:', parsedData);
    }
  }, []);

  const chartData = [
    { name: 'Income', value: budgetData.monthlyIncome },
    { name: 'Expenses', value: budgetData.totalExpense },
    ...(budgetData.investments ? budgetData.investments.map((inv) => ({ name: inv.name, value: inv.amount })) : []),
    { name: 'Remaining Budget', value: budgetData.remainingBudget },
  ];

  const calculateInvestmentTime = (goal, monthlySavings, rate) => {
    let months = 0;
    let balance = 0;
    const monthlyRate = rate / 12 / 100;

    while (balance < goal) {
      balance = (balance + monthlySavings) * (1 + monthlyRate);
      months++;
    }
    return months;
  };

  const investmentTimeData = [
    { name: 'Bank Savings (2%)', months: calculateInvestmentTime(budgetData.savingsGoal, budgetData.remainingBudget, 2) },
    { name: 'Fixed Deposit (6%)', months: calculateInvestmentTime(budgetData.savingsGoal, budgetData.remainingBudget, 6) },
    { name: 'Govt Bonds (9%)', months: calculateInvestmentTime(budgetData.savingsGoal, budgetData.remainingBudget, 9) },
    { name: 'Index Funds (13%)', months: calculateInvestmentTime(budgetData.savingsGoal, budgetData.remainingBudget, 13) },
  ];

  return (
    <>
      <Navbar />
      <div className="container py-8 bg-blue-50 text-gray-90">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="h-6 w-6 text-blue-700" />
          <h1 className="text-2xl font-bold text-blue-800">Budget Manager</h1>
        </div>

        {/* Budget Summary Card */}
        <Card className="p-6 mb-6 shadow-lg rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold mb-4">Budget Summary</h2>

          {/* Monthly Income */}
          <div className="flex justify-between text-sm">
            <span>Monthly Income (After Tax):</span>
            <span className="font-semibold">₹{Number(budgetData.monthlyIncome).toLocaleString()}</span>
          </div>

          {/* Total Expenses */}
          <div className="flex justify-between text-sm">
            <span>Total Expenses:</span>
            <span className="font-semibold">₹{Number(budgetData.totalExpense).toLocaleString()}</span>
          </div>

          {/* Investments */}
          {(budgetData.investments || []).map((investment, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{investment.name}:</span>
              <span className="font-semibold">₹{Number(investment.amount).toLocaleString()}</span>
            </div>
          ))}

          {/* Remaining Budget */}
          <div className="flex justify-between text-sm">
            <span>Remaining Budget:</span>
            <span className={`font-semibold ${budgetData.remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>₹{Number(budgetData.remainingBudget).toLocaleString()}</span>
          </div>

          {/* Bar Chart for Budget Breakdown */}
          {/* <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          </div> */}
          <Card className="p-6 mb-6 shadow-lg rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Investment Time Calculation Bar Chart</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={investmentTimeData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="months" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
          {/* Link to Investments Page */}
          {/* <Link href={`/investments?monthlyInvestment=${budgetData.remainingBudget}`} className="mt-4 inline-block"> */}
          <Link href={`/investments`} className="mt-4 inline-block">
            <Button className="w-full bg-blue-300 hover:bg-blue-500">
              <Wallet className="mr-2 h-4 w-4" />
              Optimize Investments with Remaining Budget
            </Button>
          </Link>
        </Card>

        {/* Investment Time Calculation Section */}
        {/* <Card className="p-6 mb-6 shadow-lg rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Investment Time Calculation</h3>
          <p>
            Estimated months required to reach your savings goal:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Bank Savings (2%):</strong> {calculateInvestmentTime(budgetData.savingsGoal, budgetData.remainingBudget, 2)} months</li>
            <li><strong>Fixed Deposit (6%):</strong> {calculateInvestmentTime(budgetData.savingsGoal, budgetData.remainingBudget, 6)} months</li>
            <li><strong>Govt Bonds (9%):</strong> {calculateInvestmentTime(budgetData.savingsGoal, budgetData.remainingBudget, 9)} months</li>
            <li><strong>Index Funds (13%):</strong> {calculateInvestmentTime(budgetData.savingsGoal, budgetData.remainingBudget, 13)} months</li>
          </ul>
        </Card> */}

        {/* Investment Time Calculation Bar Chart */}
   
      </div>
    </>
  );
}