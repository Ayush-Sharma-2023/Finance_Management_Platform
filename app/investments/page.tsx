'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { LineChart, Wallet } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

export default function InvestmentAdvisor() {
  const [riskProfile, setRiskProfile] = useState<RiskProfile>('moderate');
  const [monthlyInvestment, setMonthlyInvestment] = useState('');

  const handleSubmit = async () => {
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('investment_preferences').upsert({
      user_id: user.id,
      risk_tolerance: riskProfile,
      investment_horizon: '5+ years',
      monthly_investment: Number(monthlyInvestment),
    });
  };

  const allocation = portfolioAllocations[riskProfile];

  return (
    <div className="container py-10">
      {/* Header Section */}
      <div className="flex items-center space-x-3 mb-8 text-gray-800">
        <LineChart className="h-7 w-7 text-blue-500" />
        <h1 className="text-2xl font-semibold">Investment Advisor</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Risk Profile Card */}
        <Card className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-medium mb-4 text-gray-900">Risk Profile Assessment</h2>

          <div className="space-y-5">
            <div>
              <Label className="text-gray-700">What is your risk tolerance?</Label>
              <RadioGroup
                value={riskProfile}
                onValueChange={(value: RiskProfile) => setRiskProfile(value)}
                className="space-y-3 mt-2"
              >
                {(['conservative', 'moderate', 'aggressive'] as RiskProfile[]).map((profile) => (
                  <div key={profile} className="flex items-center space-x-3">
                    <RadioGroupItem value={profile} id={profile} className="border-blue-500" />
                    <Label htmlFor={profile} className="text-gray-700">
                      {profile.charAt(0).toUpperCase() + profile.slice(1)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="monthly" className="text-gray-700">Monthly Investment Amount</Label>
              <Input
                id="monthly"
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(e.target.value)}
                placeholder="Enter amount"
                className="mt-2"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <Wallet className="mr-2 h-5 w-5" />
              Save Preferences
            </Button>
          </div>
        </Card>

        {/* Recommended Portfolio Card */}
        <Card className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-lg font-medium mb-4 text-gray-900">Recommended Portfolio</h2>

          <div className="space-y-3">
            {Object.entries(allocation).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span className="font-medium text-blue-600">{value}%</span>
              </div>
            ))}

            {monthlyInvestment && (
              <div className="pt-4">
                <h3 className="font-medium mb-2 text-gray-900">Monthly Allocation</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {Object.entries(allocation).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                      <span className="text-blue-500 font-medium">₹{Math.round(Number(monthlyInvestment) * value / 100).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
