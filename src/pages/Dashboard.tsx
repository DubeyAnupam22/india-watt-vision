
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CityWasteData, useWasteData } from "@/lib/calculation";
import { useAuth } from "@/lib/auth";
import CityDataCard from "@/components/CityDataCard";
import Navbar from "@/components/Navbar";
import EnergyCalculator from "@/components/EnergyCalculator";
import DataAnalysis from "@/components/DataAnalysis";
import ReportGenerator from "@/components/ReportGenerator";
import { BarChart4, FileBarChart, Gauge, Leaf, MapPin, Plus, Recycle } from "lucide-react";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCityId = searchParams.get("city") || undefined;
  
  const { cities, getCityById } = useWasteData();
  const [selectedCity, setSelectedCity] = useState<CityWasteData | undefined>(
    selectedCityId ? getCityById(selectedCityId) : undefined
  );
  
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
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Waste2Watt Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {user?.role === "admin" ? "Manage and analyze city waste data" : "Analyze city waste data"}
            </p>
          </div>
          
          {user && (user.role === "admin" || user.role === "researcher") && (
            <Button
              onClick={() => navigate("/data-upload")}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add City Data
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/30 border-0 shadow-md overflow-hidden">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Cities</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{cities.length}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/40 dark:to-sky-900/30 border-0 shadow-md overflow-hidden">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Waste</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {cities.reduce((sum, city) => sum + city.totalWastePerDay, 0).toLocaleString()} t/day
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Recycle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/30 border-0 shadow-md overflow-hidden">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Energy Potential</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">4,800 MWh/day</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Gauge className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/40 dark:to-green-900/30 border-0 shadow-md overflow-hidden">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CO₂ Savings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">112k tons/year</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue={selectedCity ? "calculator" : "cities"} className="space-y-8">
          <TabsList className="mb-4 w-full sm:w-auto bg-gray-200/70 dark:bg-gray-800/70 backdrop-blur-sm p-1 rounded-lg">
            <TabsTrigger value="cities" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400">
              <MapPin className="h-4 w-4 mr-2" />
              Cities
            </TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400">
              <Gauge className="h-4 w-4 mr-2" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400">
              <BarChart4 className="h-4 w-4 mr-2" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400">
              <FileBarChart className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="cities" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add City Data
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="calculator">
            <EnergyCalculator cityData={selectedCity} />
          </TabsContent>
          
          <TabsContent value="analysis">
            <DataAnalysis cities={cities} />
          </TabsContent>
          
          <TabsContent value="reports">
            <ReportGenerator cities={cities} selectedCityId={selectedCityId} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
