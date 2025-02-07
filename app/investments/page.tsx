'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { supabase } from '@/lib/supabase';
import Navbar from '../../components/Navbar';
import { useSearchParams } from 'next/navigation';

type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

type PortfolioAllocation = {
  equity: number;
  debt: number;
  gold: number;
  fd?: number;
  crypto?: number;
};

const portfolioAllocations: Record<RiskProfile, PortfolioAllocation> = {
  conservative: { equity: 20, debt: 50, gold: 20, fd: 10 },
  moderate: { equity: 50, debt: 40, gold: 10 },
  aggressive: { equity: 70, debt: 15, gold: 5, crypto: 10 },
};

const generateInvestmentGrowthData = (initialInvestment: number) => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    value: initialInvestment * (1 + i * 0.02), // Simulating 2% growth per month
  }));
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F'];

export default function InvestmentAdvisor() {
  const searchParams = useSearchParams();
  const [remainingBudget, setRemainingBudget] = useState<number>(0);

  // Load remaining budget from localStorage when the component mounts
  useEffect(() => {
    const storedRemainingBudget = localStorage.getItem('remainingBudget');
    if (storedRemainingBudget) {
      setRemainingBudget(Number(storedRemainingBudget));
    } else {
      const budgetFromParams = Number(searchParams.get('monthlyInvestment')) || 0;
      setRemainingBudget(budgetFromParams);
      localStorage.setItem('remainingBudget', budgetFromParams.toString());
    }
  }, [searchParams]);

  // Determine risk profile based on remaining budget
  const getRiskProfile = (budget: number): RiskProfile => {
    if (budget <= 10000) return 'conservative';
    else if (budget >= 10000 && budget <= 50000) return 'moderate';
    else return 'aggressive';
  };

  const [riskProfile, setRiskProfile] = useState<RiskProfile>(getRiskProfile(remainingBudget));
  const allocation = portfolioAllocations[riskProfile];
  const investmentGrowthData = generateInvestmentGrowthData(remainingBudget);

  const handleSubmit = async () => {
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('investment_preferences').upsert({
      user_id: user.id,
      risk_tolerance: riskProfile,
      investment_horizon: '5+ years',
      monthly_investment: remainingBudget,
    });
  };

  return (
    <>
      <Navbar />
      <div className="container py-10">
        <div className="flex items-center space-x-3 mb-8 text-gray-800">
          <LineChart className="h-7 w-7 text-blue-500" />
          <h1 className="text-2xl font-semibold text-gray-900">Investment Advisor</h1>
        </div>

        <div className="bg-blue-500 p-8 rounded-lg shadow-lg">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Risk Profile Assessment */}
            <Card className="p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-lg font-medium mb-4 text-gray-900">Risk Profile Assessment</h2>
              <div className="space-y-5">
                <div>
                  <Label className="text-gray-700">Your Risk Profile</Label>
                  <div className="mt-2 text-gray-700">
                    Based on your remaining budget of ₹{remainingBudget.toLocaleString()}, we recommend a{' '}
                    <span className="font-semibold text-blue-600">{riskProfile}</span> portfolio.
                  </div>
                </div>

                <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Wallet className="mr-2 h-5 w-5" />
                  Save Preferences
                </Button>
              </div>
            </Card>

            {/* Recommended Portfolio */}
            <Card className="p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-lg font-medium mb-4 text-gray-900">Recommended Portfolio</h2>
              <div className="space-y-3">
                {Object.entries(allocation).map(([key, value], index) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <span className="font-medium text-blue-600">{value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Graphs Section */}
          <div className="grid gap-6 md:grid-cols-2 mt-8">
            {/* Pie Chart for Portfolio Allocation */}
            <Card className="p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-lg font-medium mb-4 text-gray-900">Portfolio Allocation</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(allocation).map(([key, value]) => ({ name: key, value }))}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    label
                    outerRadius={100}
                  >
                    {Object.entries(allocation).map(([key, _], index) => (
                      <Cell key={key} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Line Chart for Investment Growth */}
            <Card className="p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-lg font-medium mb-4 text-gray-900">Investment Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={investmentGrowthData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}