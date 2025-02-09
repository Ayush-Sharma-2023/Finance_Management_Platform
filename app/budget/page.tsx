'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Wallet } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
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

  // Calculate actual expenses and savings
  const actualExpenses = budgetData.categories.reduce((acc, cat) => acc + Number(cat.amount || 0), 0);
  const actualSavings = budgetData.remainingBudget > 0 ? budgetData.remainingBudget : 0;

  // Data for actual expenses and savings pie chart
  const actualData = [
    ...budgetData.categories.map((cat) => ({
      name: cat.name,
      value: Number(cat.amount || 0),
    })),
    { name: 'Savings', value: actualSavings },
  ];

  // Logging for debugging
  console.log('Actual Data for Pie Chart:', actualData);

  // Colors for the actual pie chart
  const actualColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#FF7373', '#5BC0EB'];

  // Calculate recommended expenses and savings
  const recommendedExpenses = {
    rentFoodTravelLoanEMI: 0.5 * budgetData.monthlyIncome,
    lifestyleEntertainment: 0.3 * budgetData.monthlyIncome,
    savings: 0.2 * budgetData.monthlyIncome,
  };

  // Data for recommended expenses and savings pie chart
  const recommendedData = [
    { name: 'Rent, Food, Travel, Loan, EMI', value: recommendedExpenses.rentFoodTravelLoanEMI },
    { name: 'Lifestyle, Entertainment', value: recommendedExpenses.lifestyleEntertainment },
    { name: 'Savings', value: recommendedExpenses.savings },
  ];

  // Colors for the recommended pie chart
  const recommendedColors = ['#8884d8', '#82ca9d', '#ffc658'];

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

          {/* Link to Investments Page */}
          <Link href={`/investments`} className="mt-4 inline-block">
            <Button className="w-full bg-blue-300 hover:bg-blue-500">
              <Wallet className="mr-2 h-4 w-4" />
              Optimize Investments with Remaining Budget
            </Button>
          </Link>
        </Card>

        {/* Container for both charts */}
<div className="flex justify-between space-x-4 mb-6">
  {/* Actual Expenses and Savings Pie Chart */}
  <Card className="w-1/2 p-6 shadow-lg rounded-lg border border-gray-200">
    <h3 className="text-lg font-semibold mb-4">Actual Expenses and Savings</h3>
    <div className="h-72"> {/* Increased height from h-64 to h-72 */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={actualData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
            labelLine={false}
          >
            {actualData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={actualColors[index % actualColors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </Card>

  {/* Recommended Expenses and Savings Pie Chart */}
  <Card className="w-1/2 p-6 shadow-lg rounded-lg border border-gray-200">
    <h3 className="text-lg font-semibold mb-4">Recommended Expenses and Savings</h3>
    <div className="h-72"> {/* Increased height from h-64 to h-72 */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={recommendedData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
            labelLine={false}
          >
            {recommendedData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={recommendedColors[index % recommendedColors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </Card>
</div>



        {/* Investment Time Calculation Bar Chart */}
        <Card className="p-6 mb-6 shadow-lg rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Investment Time Calculation</h3>
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
      </div>
    </>
  );
}