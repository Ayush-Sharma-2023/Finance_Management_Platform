'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Wallet } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
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

          {/* Remaining Budget */}
          <div className="flex justify-between text-sm">
            <span>Remaining Budget:</span>
            <span className={`font-semibold ${budgetData.remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
              ₹{Number(budgetData.remainingBudget).toLocaleString()}
            </span>
          </div>

          {/* Bar Chart for Remaining Budget */}
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: 'Remaining Budget', value: budgetData.remainingBudget }]} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Link to Investments Page */}
          <Link href={`/investments?monthlyInvestment=${budgetData.remainingBudget}`} className="mt-4 inline-block">
            <Button className="w-full bg-blue-300 hover:bg-blue-500">
              <Wallet className="mr-2 h-4 w-4" />
              Optimize Investments with Remaining Budget
            </Button>
          </Link>
        </Card>

        {/* Categories Card - Display Expenses */}
        <Card className="p-6 mb-6 shadow-lg rounded-lg border border-gray-200">
          <h3 className="font-semibold">Expenses</h3>
          <div className="flex flex-wrap gap-4">
          {(budgetData.categories || []).map((category, index) => (
              <div key={index} className="w-full md:w-1/3 lg:w-1/4 p-4 border rounded-lg bg-gray-50 relative">
                <h4 className="font-medium">{category.name}</h4>
                <p>Amount: ₹{Number(category.amount).toLocaleString()}</p>
                <p>Recurring: {category.recurring ? 'Yes' : 'No'}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Savings Goal Card */}
        <Card className="p-6 mb-6 shadow-lg rounded-lg border border-gray-200">
          <h3 className="font-semibold">Savings Goal</h3>
          <p>Target Amount: ₹{Number(budgetData.savingsGoal).toLocaleString()}</p>
        </Card>
      </div>
    </>
  );
}
