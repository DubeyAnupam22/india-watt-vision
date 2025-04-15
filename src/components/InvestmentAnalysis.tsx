
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CityWasteData, calculateEnergyPotential } from "@/lib/calculation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Banknote, TrendingUp, Clock, DollarSign } from "lucide-react";

interface InvestmentAnalysisProps {
  city: CityWasteData;
}

const InvestmentAnalysis: React.FC<InvestmentAnalysisProps> = ({ city }) => {
  const energyPotential = calculateEnergyPotential(city);
  
  // Calculate investment metrics
  const capitalCost = energyPotential.capitalCost;
  const annualRevenue = energyPotential.annualRevenue;
  const annualOpex = energyPotential.annualOperatingCost;
  const roi = energyPotential.paybackPeriodYears;
  
  // Format for display
  const capitalCostCr = (capitalCost / 10000000).toFixed(2);
  const annualRevenueCr = (annualRevenue / 10000000).toFixed(2);
  const annualOpexCr = (annualOpex / 10000000).toFixed(2);
  
  // Prepare data for charts
  const cashFlowData = [];
  let cumulativeCashFlow = -capitalCost;
  
  for (let year = 1; year <= 10; year++) {
    cumulativeCashFlow += (annualRevenue - annualOpex);
    cashFlowData.push({
      year: `Year ${year}`,
      cashFlow: (cumulativeCashFlow / 10000000).toFixed(2),
      annualProfit: ((annualRevenue - annualOpex) / 10000000).toFixed(2)
    });
  }
  
  const costBreakdown = [
    { name: 'Capital Expenditure', value: Number(capitalCostCr) },
    { name: 'Annual Operating Cost', value: Number(annualOpexCr) * 10 }, // 10-year opex
  ];
  
  const revenueBreakdown = [
    { name: 'Energy Sales', value: Number(annualRevenueCr) * 0.85 },
    { name: 'Carbon Credits', value: Number(annualRevenueCr) * 0.1 },
    { name: 'Tipping Fees', value: Number(annualRevenueCr) * 0.05 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Investment Analysis</CardTitle>
            <CardDescription className="text-blue-100">
              Financial metrics for {city.name}'s waste-to-energy project
            </CardDescription>
          </div>
          <div className="h-10 w-10 bg-blue-500/30 rounded-full flex items-center justify-center">
            <Banknote className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key metrics */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 flex items-center mb-1">
                  <DollarSign className="h-4 w-4 mr-1 text-blue-500" />
                  Capital Investment
                </div>
                <div className="text-2xl font-bold">₹{capitalCostCr} Cr</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 flex items-center mb-1">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  Annual Revenue
                </div>
                <div className="text-2xl font-bold">₹{annualRevenueCr} Cr</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 flex items-center mb-1">
                  <Clock className="h-4 w-4 mr-1 text-amber-500" />
                  ROI Period
                </div>
                <div className="text-2xl font-bold">{roi.toFixed(1)} Years</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 flex items-center mb-1">
                  <Banknote className="h-4 w-4 mr-1 text-red-500" />
                  Annual Opex
                </div>
                <div className="text-2xl font-bold">₹{annualOpexCr} Cr</div>
              </div>
            </div>
            
            <div className="h-72">
              <p className="text-sm font-medium mb-2">10-Year Cash Flow Projection (₹ Cr)</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={cashFlowData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cashFlow" name="Cumulative Cash Flow" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="annualProfit" name="Annual Profit" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Charts */}
          <div className="space-y-6">
            <div className="h-72">
              <p className="text-sm font-medium mb-2">Cost Breakdown (10-Year Projection)</p>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value} Cr`, 'Amount']}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-72">
              <p className="text-sm font-medium mb-2">Revenue Streams</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueBreakdown}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toFixed(2)} Cr`, 'Annual Revenue']}/>
                  <Bar dataKey="value" name="Annual Revenue (₹ Cr)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentAnalysis;
