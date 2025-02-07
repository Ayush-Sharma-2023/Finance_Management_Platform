'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Wallet } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import Link from 'next/link';

export default function BudgetManager() {
  const [income, setIncome] = useState(''); // Monthly income after tax
  const [categories, setCategories] = useState([]);
  const [savingsGoal, setSavingsGoal] = useState('');
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Fetch income after tax and expenses from localStorage
  useEffect(() => {
    const storedIncome = localStorage.getItem('income'); // Total income after tax
    const storedCategories = localStorage.getItem('categories'); // Expenses categories
    const storedSavingsGoal = localStorage.getItem('savingsGoal'); // Savings goal

    // Logging to check the stored data
    console.log('Stored Income:', storedIncome);
    console.log('Stored Categories:', storedCategories);

    if (storedIncome) {
      const incomeAfterTax = Number(storedIncome) / 12; // Divide by 12 to get monthly income
      setIncome(incomeAfterTax.toFixed(2)); // Set the monthly income value
    }

    if (storedCategories) {
      const categoriesData = JSON.parse(storedCategories);
      setCategories(categoriesData); // Set categories data

      // Log to check the categories data and their amounts
      console.log('Parsed Categories:', categoriesData);

      // Calculate total expenses from the stored categories
      const total = categoriesData.reduce((acc, cat) => {
        if (cat.name && !isNaN(Number(cat.amount)) && cat.amount !== '') {
          const expenseAmount = Number(cat.amount); // Ensure amount is converted to number
          console.log(`Category: ${cat.name}, Amount: ${cat.amount}, Parsed Amount: ${expenseAmount}`);
          return acc + expenseAmount; // Accumulate total expenses
        } else {
          console.log(`Skipping invalid category: ${cat.name}, Amount: ${cat.amount}`);
        }
        return acc; // Skip invalid categories
      }, 0);
      
      setTotalExpenses(total); // Set total expenses value

      // Log the total expenses to check if it's being calculated correctly
      console.log('Total Expenses:', total);
    }

    if (storedSavingsGoal) setSavingsGoal(storedSavingsGoal); // Set savings goal
  }, []);

  const remainingBudget = Number(income) - totalExpenses;

  const budgetData = [
    { name: 'Remaining Budget', years: remainingBudget },
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

          {/* Displaying Monthly Income After Tax */}
          <div className="flex justify-between text-sm">
            <span>Monthly Income (After Tax):</span>
            <span className="font-semibold">₹{Number(income).toLocaleString()}</span>
          </div>

          {/* Displaying Total Expenses */}
          <div className="flex justify-between text-sm">
            <span>Total Expenses:</span>
            <span className="font-semibold">₹{totalExpenses.toLocaleString()}</span>
          </div>

          {/* Displaying Remaining Budget */}
          <div className="flex justify-between text-sm">
            <span>Remaining Budget:</span>
            <span className={`font-semibold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
              ₹{remainingBudget.toLocaleString()}
            </span>
          </div>

          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="years" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Link to Investments Page */}
          <Link href={`/investments?monthlyInvestment=${remainingBudget}`} className="mt-4 inline-block">
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
            {categories.map((category, index) => (
              <div key={index} className="w-full md:w-1/3 lg:w-1/4 p-4 border rounded-lg bg-gray-50 relative">
                <h4 className="font-medium">{category.name}</h4>
                <p>Amount: ₹{category.amount}</p>
                <p>Recurring: {category.recurring ? 'Yes' : 'No'}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Savings Goal Card */}
        <Card className="p-6 mb-6 shadow-lg rounded-lg border border-gray-200">
          <h3 className="font-semibold">Savings Goal</h3>
          <p>Target Amount: ₹{savingsGoal}</p>
        </Card>
      </div>
    </>
  );
}
