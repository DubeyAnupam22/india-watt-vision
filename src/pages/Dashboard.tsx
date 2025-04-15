
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
import { Gauge, Leaf, MapPin, Plus, Recycle } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Waste-to-Energy Dashboard</h1>
            <p className="text-gray-600">
              {user?.role === "admin" ? "Manage and analyze city waste data" : "Analyze city waste data"}
            </p>
          </div>
          
          {user && (user.role === "admin" || user.role === "researcher") && (
            <Button
              onClick={() => navigate("/data-upload")}
              className="bg-w2w-green-500 hover:bg-w2w-green-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add City Data
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Cities</p>
                <p className="text-2xl font-bold">{cities.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-w2w-green-500 opacity-80" />
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Waste</p>
                <p className="text-2xl font-bold">
                  {cities.reduce((sum, city) => sum + city.totalWastePerDay, 0).toLocaleString()} t/day
                </p>
              </div>
              <Recycle className="h-8 w-8 text-w2w-blue-500 opacity-80" />
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Potential Energy</p>
                <p className="text-2xl font-bold">4,800 MWh/day</p>
              </div>
              <Gauge className="h-8 w-8 text-w2w-amber-500 opacity-80" />
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">CO₂ Savings</p>
                <p className="text-2xl font-bold">112k tons/year</p>
              </div>
              <Leaf className="h-8 w-8 text-green-500 opacity-80" />
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue={selectedCity ? "calculator" : "cities"} className="space-y-8">
          <TabsList className="mb-4 w-full sm:w-auto">
            <TabsTrigger value="cities">Cities Overview</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cities" className="space-y-6">
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
                    className="bg-w2w-green-500 hover:bg-w2w-green-600"
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
