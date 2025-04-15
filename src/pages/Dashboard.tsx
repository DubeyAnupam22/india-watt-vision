
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CityWasteData, useWasteData, calculateEnergyPotential } from "@/lib/calculation";
import { useAuth } from "@/lib/auth";
import CityDataCard from "@/components/CityDataCard";
import Navbar from "@/components/Navbar";
import EnergyCalculator from "@/components/EnergyCalculator";
import DataAnalysis from "@/components/DataAnalysis";
import ReportGenerator from "@/components/ReportGenerator";
import { BarChart4, FileBarChart, Gauge, Leaf, MapPin, Plus, Recycle, RefreshCw, Download, Globe, Banknote } from "lucide-react";
import { usePopulationAPI } from "@/lib/usePopulationAPI";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCityId = searchParams.get("city") || undefined;
  
  const { cities, getCityById } = useWasteData();
  const [selectedCity, setSelectedCity] = useState<CityWasteData | undefined>(
    selectedCityId ? getCityById(selectedCityId) : undefined
  );

  const { isLoading: isLoadingPopulation } = usePopulationAPI();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    if (selectedCityId) {
      const city = getCityById(selectedCityId);
      setSelectedCity(city);
    }
  }, [selectedCityId, getCityById]);
  
  // Calculate summary statistics
  const totalWaste = cities.reduce((sum, city) => sum + city.totalWastePerDay, 0);
  const totalEnergyPotential = cities.reduce((sum, city) => {
    const energy = calculateEnergyPotential(city);
    return sum + energy.dailyEnergy / 1000; // Convert to MWh
  }, 0);
  const totalCO2Savings = cities.reduce((sum, city) => {
    const energy = calculateEnergyPotential(city);
    return sum + energy.co2Savings / 1000; // Convert to tons
  }, 0);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <Globe className="mr-2 h-8 w-8 text-green-600" />
              Waste2Watt Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 ml-10">
              {user?.role === "admin" ? "Manage and analyze waste-to-energy data" : "Analyze waste-to-energy data"}
            </p>
          </div>
          
          <div className="flex gap-2">
            {isLoadingPopulation && (
              <Button disabled variant="outline" size="sm" className="bg-white">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Updating Data...
              </Button>
            )}
            
            {user && (user.role === "admin" || user.role === "researcher") && (
              <Button
                onClick={() => navigate("/data-upload")}
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add City Data
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-zinc-800 border-0 shadow overflow-hidden">
            <div className="h-1 bg-green-500" />
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Cities</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{cities.length}</p>
                <p className="text-xs text-gray-500 mt-1">Data sources</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-zinc-800 border-0 shadow overflow-hidden">
            <div className="h-1 bg-blue-500" />
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Waste</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalWaste.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </p>
                <p className="text-xs text-gray-500 mt-1">tons per day</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <Recycle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-zinc-800 border-0 shadow overflow-hidden">
            <div className="h-1 bg-amber-500" />
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Energy Potential</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalEnergyPotential.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </p>
                <p className="text-xs text-gray-500 mt-1">MWh per day</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <Gauge className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-zinc-800 border-0 shadow overflow-hidden">
            <div className="h-1 bg-emerald-500" />
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CO₂ Savings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalCO2Savings.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </p>
                <p className="text-xs text-gray-500 mt-1">tons per year</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <Tabs defaultValue={selectedCity ? "calculator" : "cities"} className="w-full">
            <div className="px-4 pt-4 border-b border-gray-200 dark:border-gray-700">
              <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <TabsTrigger value="cities" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
                  <MapPin className="h-4 w-4 mr-2" />
                  Cities
                </TabsTrigger>
                <TabsTrigger value="calculator" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
                  <Gauge className="h-4 w-4 mr-2" />
                  Calculator
                </TabsTrigger>
                <TabsTrigger value="analysis" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
                  <BarChart4 className="h-4 w-4 mr-2" />
                  Analysis
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
                  <FileBarChart className="h-4 w-4 mr-2" />
                  Reports
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-4">
              <TabsContent value="cities" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cities.map((city) => (
                    <CityDataCard key={city.id} city={city} />
                  ))}
                </div>
                
                {cities.length === 0 && (
                  <Card className="bg-gray-50 border-dashed">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <MapPin className="h-6 w-6 text-gray-400" />
                      </div>
                      <CardTitle className="text-xl mb-2">No cities data available</CardTitle>
                      <CardDescription className="mb-4">
                        Start by adding data for a city to analyze waste-to-energy potential
                      </CardDescription>
                      <Button 
                        onClick={() => navigate("/data-upload")}
                        className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add City Data
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="calculator" className="mt-0">
                <EnergyCalculator cityData={selectedCity} />
              </TabsContent>
              
              <TabsContent value="analysis" className="mt-0">
                <DataAnalysis cities={cities} />
              </TabsContent>
              
              <TabsContent value="reports" className="mt-0">
                <ReportGenerator cities={cities} selectedCityId={selectedCityId} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
