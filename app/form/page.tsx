'use client'
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle, XCircle } from 'lucide-react';
import Navbar from "../../components/Navbar"

// Expense category type
type Category = {
  name: string;
  amount: string;
  recurring: boolean;
};

export default function Form() {
  const [salary, setSalary] = useState<number | string>(''); 
  const [categories, setCategories] = useState<Category[]>([{ name: '', amount: '', recurring: false }]);
  const [savingsGoal, setSavingsGoal] = useState<number | string>('');

  // Handle category field changes
  const handleCategoryChange = (index: number, field: keyof Category, value: string | boolean) => {
    const updatedCategories = [...categories];
    updatedCategories[index][field] = value;
    setCategories(updatedCategories);
  };

  // Add new category
  const addCategory = () => {
    setCategories([...categories, { name: '', amount: '', recurring: false }]);
  };

  // Remove category
  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  // Save data to localStorage
  const saveToLocalStorage = () => {
    // Calculate total expenses from all categories
    const totalExpense = categories.reduce((total, category) => total + (parseFloat(category.amount) || 0), 0);

    // Calculate final income (consider any deductions or other logic here if necessary)
    const finalIncome = parseFloat(salary) || 0;

    // Calculate monthly income (final income / 12)
    const monthlyIncome = finalIncome / 12;

    // Calculate remaining budget (monthly income - total expense)
    const remainingBudget = monthlyIncome - totalExpense;

    // Prepare the data to save
    const budgetData = {
      salary: salary,
      categories: categories,
      savingsGoal: savingsGoal,
      finalIncome: finalIncome,
      monthlyIncome: monthlyIncome,
      totalExpense: totalExpense,
      remainingBudget: remainingBudget,
    };

    // Save the data to localStorage
    try {
      localStorage.setItem('budgetData', JSON.stringify(budgetData));
      alert('Budget data saved successfully!');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      alert('Failed to save data.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-8 bg-blue-50 text-gray-900">
        <div className="flex items-center space-x-2 mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Budget Form</h1>
        </div>

        <div className="p-6 mb-6 shadow-lg rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold mb-4">Enter Your Monthly Details</h2>

          <Label htmlFor="salary" className="font-medium text-black">
            Salary (₹)
          </Label>
          <Input
            id="salary"
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="Enter your salary"
            className="mb-4 bg-white"
          />

          <h3 className="mt-4 font-semibold text-black">Expense Components</h3>
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
        </div>

        <div className="p-6 mb-6 shadow-lg rounded-lg border border-gray-200">
          <h3 className="font-semibold">Savings Goal</h3>
          <Label htmlFor="savingsGoal">Target Amount (₹)</Label>
          <Input
            id="savingsGoal"
            type="number"
            value={savingsGoal}
            onChange={(e) => setSavingsGoal(e.target.value)}
            placeholder="Enter your savings goal"
          />
        </div>

        <a
  href="/taxations"
  onClick={(e) => {
    e.preventDefault(); // Prevents immediate navigation
    saveToLocalStorage(); // Calls your function before redirection
    window.location.href = "/taxations"; // Redirects after saving
  }}
  className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded text-center block"
>
  Save Budget Information
</a>

      </div>
    </>
  );
}
