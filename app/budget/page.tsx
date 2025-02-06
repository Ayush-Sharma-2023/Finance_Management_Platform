'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { BarChart3, PlusCircle, ChevronDown, Trash2, XCircle } from 'lucide-react';

export default function BudgetManager() {
  const [income, setIncome] = useState('');
  const [categories, setCategories] = useState([{ name: '', amount: '', recurring: false }]);
  const [savingsGoal, setSavingsGoal] = useState('');
  const [showRecurringExpenses, setShowRecurringExpenses] = useState(false);
  const [nextMonthExpenses, setNextMonthExpenses] = useState([]);

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
  const monthsToGoal = savingsGoal && remainingBudget > 0 ? Math.ceil(savingsGoal / remainingBudget) : 'N/A';

  return (
    <div className="container py-8">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="h-6 w-6 padding+" />
        <h1 className="text-2xl font-bold">Budget Manager</h1>
      </div>

      <Card className="p-6 mb-6 shadow-lg rounded-lg border border-gray-200" >
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
        <div className="flex justify-between text-sm mt-2">
          <span>Months to Reach Goal:</span>
          <span className="font-semibold">{monthsToGoal}</span>
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
  );
}
