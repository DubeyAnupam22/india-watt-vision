
import React, { useState } from "react";
import InvestmentAnalysis from "@/components/InvestmentAnalysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  // Sample city data for demonstration
  const [selectedCity, setSelectedCity] = useState({
    name: "New Delhi",
    population: 21000000,
    wastePerCapita: 0.65, // kg per day
    energyProduction: 450, // kWh per ton
  });

  // Additional sample cities
  const sampleCities = [
    {
      name: "New Delhi",
      population: 21000000,
      wastePerCapita: 0.65,
      energyProduction: 450,
    },
    {
      name: "Mumbai",
      population: 20400000,
      wastePerCapita: 0.7,
      energyProduction: 430,
    },
    {
      name: "Bangalore",
      population: 12500000,
      wastePerCapita: 0.6,
      energyProduction: 480,
    }
  ];

  const handleCityChange = (city) => {
    setSelectedCity(city);
    toast.success(`Selected ${city.name} for analysis`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Waste2Watt Investment Platform</h1>
          <p className="mt-2 text-gray-600">Analyze waste-to-energy investment opportunities in Indian cities</p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with city selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Select City</CardTitle>
                <CardDescription>Choose a city to analyze investment potential</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {sampleCities.map((city) => (
                  <Button 
                    key={city.name}
                    variant={selectedCity.name === city.name ? "default" : "outline"}
                    className="w-full mb-2 justify-start"
                    onClick={() => handleCityChange(city)}
                  >
                    {city.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
          
          {/* Main investment analysis */}
          <div className="lg:col-span-3">
            <InvestmentAnalysis cityData={selectedCity} />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Waste2Watt</h2>
            <p>© {new Date().getFullYear()} Waste2Watt. All rights reserved.</p>
            <p className="mt-2 text-sm text-gray-400">Transforming waste management into energy solutions for India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
