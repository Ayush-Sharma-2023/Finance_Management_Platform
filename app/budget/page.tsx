'use client';


import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { BarChart3, PlusCircle, ChevronDown, Trash2, XCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title,  Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(Title,  Legend, ArcElement, CategoryScale, LinearScale);
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";





export default function BudgetManager() {
  const [income, setIncome] = useState('');
  const [categories, setCategories] = useState([{ name: '', amount: '', recurring: false }]);
  const [savingsGoal, setSavingsGoal] = useState('');
  const [showRecurringExpenses, setShowRecurringExpenses] = useState(false);
  const [nextMonthExpenses, setNextMonthExpenses] = useState([]);
  const [investmentOption, setInvestmentOption] = useState(''); // New state for investment type

  

 
  

  const handleCategoryChange = (index, field, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index][field] = value;
    setCategories(updatedCategories);
    
    if (field === 'recurring' && value) {
      setNextMonthExpenses([...nextMonthExpenses, updatedCategories[index]]);
    }
  };

  const addCategory = () => {
    setCategories([...categories, { name: '', amount: '', recurring: false }]);
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const removeNextMonthExpense = (index) => {
    setNextMonthExpenses(nextMonthExpenses.filter((_, i) => i !== index));
  };

  const totalExpenses = categories.reduce((acc, cat) => acc + Number(cat.amount || 0), 0);
  const remainingBudget = Number(income) - totalExpenses;
  const nextMonthFixedExpenses = nextMonthExpenses.reduce((acc, exp) => acc + Number(exp.amount || 0), 0);

  // Function for bank savings account
  function bankSavingsTime(initial: number, monthly: number, rate: number, target: number): number {
    if (initial >= target) return 0; // If already reached, return 0 months.
    
    let months = 0;
    let balance = initial;
    const monthlyRate = rate / 12 / 100; // Convert annual rate to monthly rate

    while (balance < target) {
        balance *= (1 + monthlyRate); // Apply compound interest
        balance += monthly; // Add monthly contribution
        months++;

        // Prevent infinite loop
        if (months > 1000) break;
    }

    return months;
}


  // Function for gold bonds



  // Function for FD, Govt. Bonds, and Index Funds
  function compoundInvestmentTime(initial: number, monthly: number, rate: number, target: number): number {
    if (initial >= target) return 0; // Already reached
    
    let months = 0;
    let balance = initial;
    const monthlyRate = rate / 12 / 100; // Convert annual rate to monthly rate

    while (balance < target) {
        balance *= (1 + monthlyRate); // Apply compound interest
        balance += monthly; // Add monthly deposit
        months++;

        if (months > 1000) break; // Prevent infinite loops
    }

    return months;
}


  const monthsToGoal = savingsGoal && remainingBudget > 0 ? Math.ceil(savingsGoal / remainingBudget) : 'N/A';

  
  const bankSavingsMonths = savingsGoal && remainingBudget > 0 ? bankSavingsTime(remainingBudget, remainingBudget, 2, savingsGoal) : 'N/A';
  //const goldBondMonths = savingsGoal && remainingBudget > 0 ? goldBondTime(remainingBudget, 3, savingsGoal) : 'N/A';
  const fdMonths = savingsGoal && remainingBudget > 0 ? compoundInvestmentTime(remainingBudget, remainingBudget, 6, savingsGoal) : 'N/A';
  const govtMonths = savingsGoal && remainingBudget > 0 ? compoundInvestmentTime(remainingBudget, remainingBudget, 9, savingsGoal) : 'N/A';
  const indexMonths = savingsGoal && remainingBudget > 0 ? compoundInvestmentTime(remainingBudget, remainingBudget, 13, savingsGoal) : 'N/A';
  
  const budgetData = [
    { name: "Default", months: monthsToGoal },
    { name: "Bank Savings", months: bankSavingsMonths },
    { name: "Fixed Deposit", months: fdMonths },
    { name: "Govt Investment", months: govtMonths },
    { name: "Index Investment", months: indexMonths },
  ];
  
  const categoryLabels = categories.map(cat => cat.name);
  const categoryAmounts = categories.map(cat => Number(cat.amount || 0));
  const categoryBudget = categories.map(cat => 0);

  const pieData = useMemo(() => ({
    labels: categoryLabels,
    datasets: [
      {
        label: 'Expenses Distribution',
        data: categoryAmounts,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
        borderWidth: 1,
      },
      {
        label: 'Budget Distribution',
        data: categoryBudget,
        backgroundColor: ['#FF7373', '#5BC0EB', '#FFD166', '#6B8B3A', '#FF6A13'],
        borderColor: ['#FF7373', '#5BC0EB', '#FFD166', '#6B8B3A', '#FF6A13'],
        borderWidth: 1,
      },
    ],
  }), [categoryLabels, categoryAmounts, categoryBudget]);

  return (
    <> <Navbar/>
    <div className="container py-8 bg-blue-50 text-gray-90">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="h-6 w-6 text-blue-700" />
        <h1 className="text-2xl font-bold text-blue-800">Budget Manager</h1>
      </div>

      <Card className="p-6 mb-6 shadow-lg rounded-lg border border-blue-200">
        <h2 className="text-lg font-semibold mb-4">Enter Your Monthly Details</h2>
        
        <Label htmlFor="income" className="font-medium text-black">Monthly Income</Label>
        <Input
          id="income"
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value < 1 ? '' : e.target.value)}
          placeholder="Enter your income"
          className="mb-4 bg-white"
        />
        
        <h3 className="mt-4 font-semibold text-black">Expenses</h3>
        <div className="flex flex-wrap gap-4">
          {categories.map((category, index) => (
            <div key={index} className="w-full md:w-1/3 lg:w-1/4 p-4 border rounded-lg bg-gray-50 relative">
              <h4 className="font-medium">{index + 1}. Expense Category</h4>
              <Label className="mt-2">Category Type</Label>
              <select
                className="w-full border rounded p-2"
                value={category.name}
                onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="Rent">Rent</option>
                <option value="Food, Travel & Bills">Food, Travel & Bills</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Loan">Loan</option>
                <option value="EMI">EMI</option>
              </select>
              <Label className="mt-2">Amount</Label>
              <Input
                type="number"
                value={category.amount}
                onChange={(e) => handleCategoryChange(index, 'amount', e.target.value)}
                placeholder="Enter amount"
              />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={category.recurring}
                  onChange={() => handleCategoryChange(index, 'recurring', !category.recurring)}
                  className="mr-2"
                />
                <Label>Recurring</Label>
              </div>
              <button onClick={() => removeCategory(index)} className="absolute top-2 right-2 text-red-500">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        <Button onClick={addCategory} className="mt-2">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </Card>

      <Card className="p-6 mb-6 shadow-lg rounded-lg border border-gray-200">
        <h3 className="font-semibold">Savings Goal</h3>
        <Label htmlFor="savingsGoal">Target Amount</Label>
        <Input
          id="savingsGoal"
          type="number"
          value={savingsGoal}
          onChange={(e) => setSavingsGoal(e.target.value)}
          placeholder="Enter your savings goal"
        />
      </Card>

      {/* import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"; */}

<Card className="p-6 shadow-lg rounded-lg border border-gray-200">
  <h2 className="text-lg font-semibold mb-4">Budget Summary</h2>

  <div className="flex justify-between text-sm">
    <span>Total Expenses:</span>
    <span className="font-semibold">₹{totalExpenses.toLocaleString()}</span>
  </div>
  <div className="flex justify-between text-sm">
    <span>Remaining Budget:</span>
    <span className={`font-semibold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>₹{remainingBudget.toLocaleString()}</span>
  </div>

  <div className="mt-4 h-64">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={budgetData} layout="vertical">
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={120} />
        <Tooltip />
        <Bar dataKey="months" fill="#4A90E2" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  <div className="mt-4">
    <Button onClick={() => setShowRecurringExpenses(!showRecurringExpenses)}>
      Next Month Fixed Expenses ₹{nextMonthFixedExpenses} <ChevronDown className="ml-2 h-4 w-4" />
    </Button>
    {showRecurringExpenses && (
      <ul className="mt-2 border p-2 rounded bg-gray-100">
        {nextMonthExpenses.map((exp, index) => (
          <li key={index} className="flex justify-between items-center">
            {exp.name}: ₹{exp.amount}
            <button onClick={() => removeNextMonthExpense(index)} className="text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>

  <Progress value={(totalExpenses / (Number(income) || 1)) * 100} className="mt-4" />
</Card>


    </div>
    </>
  );
}
