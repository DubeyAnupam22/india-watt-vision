
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

interface InvestmentAnalysisProps {
  cityData: {
    name: string;
    population: number;
    wastePerCapita: number;
    energyProduction: number;
  };
}

// Investment parameters
const INITIAL_INVESTMENT = 5000000; // $5 million
const OPERATIONAL_COST_PER_TON = 20; // $20 per ton
const REVENUE_PER_KWH = 0.12; // $0.12 per kWh
const YEARS_TO_ANALYZE = 10;

interface InvestmentMetric {
  name: string;
  value: number;
}

interface YearlyData {
  year: number;
  revenue: number;
  costs: number;
  profit: number;
  cumulativeROI: number;
}

const InvestmentAnalysis: React.FC<InvestmentAnalysisProps> = ({ cityData }) => {
  // Calculate total waste per year in tons
  const annualWaste = cityData.population * cityData.wastePerCapita * 365 / 1000;
  
  // Calculate annual energy production in kWh
  const annualEnergy = cityData.energyProduction * annualWaste;
  
  // Calculate annual revenue
  const annualRevenue = annualEnergy * REVENUE_PER_KWH;
  
  // Calculate annual operational costs
  const annualCosts = annualWaste * OPERATIONAL_COST_PER_TON * 365;
  
  // Calculate annual profit
  const annualProfit = annualRevenue - annualCosts;
  
  // Calculate payback period in years
  const paybackPeriod = INITIAL_INVESTMENT / annualProfit;
  
  // Calculate ROI over 10 years
  const tenYearROI = ((annualProfit * YEARS_TO_ANALYZE) - INITIAL_INVESTMENT) / INITIAL_INVESTMENT * 100;
  
  const keyMetrics: InvestmentMetric[] = [
    { name: "Initial Investment", value: INITIAL_INVESTMENT },
    { name: "Annual Revenue", value: annualRevenue },
    { name: "Annual Operational Costs", value: annualCosts },
    { name: "Annual Profit", value: annualProfit },
    { name: "Payback Period (years)", value: paybackPeriod },
    { name: "10-Year ROI (%)", value: tenYearROI }
  ];
  
  // Calculate yearly data for chart
  const yearlyData: YearlyData[] = Array.from({ length: YEARS_TO_ANALYZE }, (_, i) => {
    const year = i + 1;
    const revenue = annualRevenue;
    const costs = annualCosts;
    const profit = revenue - costs;
    const cumulativeProfit = profit * year;
    const cumulativeInvestment = INITIAL_INVESTMENT + (costs * year);
    const cumulativeROI = ((cumulativeProfit - INITIAL_INVESTMENT) / INITIAL_INVESTMENT) * 100;
    
    return {
      year,
      revenue,
      costs,
      profit,
      cumulativeROI: cumulativeROI < 0 ? 0 : cumulativeROI
    };
  });
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-md shadow-md">
          <p className="font-bold">{`Year ${label}`}</p>
          <p className="text-emerald-600">{`Revenue: $${formatNumber(payload[0].value as number)}`}</p>
          <p className="text-red-500">{`Costs: $${formatNumber(payload[1].value as number)}`}</p>
          <p className="text-blue-500">{`Profit: $${formatNumber(payload[2].value as number)}`}</p>
          <p className="text-purple-500">{`ROI: ${formatNumber(payload[3].value as number)}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Format large numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    } else {
      return num.toFixed(2);
    }
  };
  
  // Format currency values
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Investment Analysis for {cityData.name}</CardTitle>
        <CardDescription>Financial projections for waste-to-energy facility</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {keyMetrics.map((metric) => (
            <div key={metric.name} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500">{metric.name}</h3>
              <p className="text-xl font-bold">
                {metric.name.includes("ROI") ? `${metric.value.toFixed(2)}%` : 
                 metric.name.includes("Payback") ? `${metric.value.toFixed(2)} years` : 
                 formatCurrency(metric.value)}
              </p>
            </div>
          ))}
        </div>
        
        <div className="h-80 mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={yearlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" 
                label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" 
                label={{ value: 'ROI (%)', angle: -90, position: 'insideRight' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#4ade80" />
              <Bar yAxisId="left" dataKey="costs" name="Costs" fill="#f87171" />
              <Bar yAxisId="left" dataKey="profit" name="Profit" fill="#60a5fa" />
              <Bar yAxisId="right" dataKey="cumulativeROI" name="Cumulative ROI (%)" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold mb-2">Investment Summary</h3>
          <p className="text-gray-700 mb-1">
            This waste-to-energy project requires an initial investment of {formatCurrency(INITIAL_INVESTMENT)}.
          </p>
          <p className="text-gray-700 mb-1">
            With {cityData.name}'s population of {cityData.population.toLocaleString()} and waste generation of {cityData.wastePerCapita} kg/day per capita,
            the facility would process approximately {Math.round(annualWaste).toLocaleString()} tons of waste annually.
          </p>
          <p className="text-gray-700 mb-1">
            The project is expected to generate {formatCurrency(annualRevenue)} in annual revenue,
            with operational costs of {formatCurrency(annualCosts)}, resulting in an annual profit of {formatCurrency(annualProfit)}.
          </p>
          <p className="text-gray-700 mb-1">
            The investment is projected to be paid back in {paybackPeriod.toFixed(2)} years,
            with a {tenYearROI.toFixed(2)}% return on investment over a 10-year period.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentAnalysis;
