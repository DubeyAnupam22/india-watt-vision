
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWasteData } from "@/lib/calculation";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Download, Map, FileBarChart2, LineChart, PieChart } from "lucide-react";
import WasteCompositionChart from "@/components/WasteCompositionChart";
import InvestmentAnalysis from "@/components/InvestmentAnalysis";
import { convertCompositionToArray } from "@/lib/calculation";
import { useToast } from "@/components/ui/use-toast";

const CityReport = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cities, getCityById } = useWasteData();
  const { toast } = useToast();
  
  const city = id ? getCityById(id) : undefined;

  if (!city) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">City not found</h1>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const compositionArray = convertCompositionToArray(city);
  
  const handleDownloadCSV = () => {
    // Generate CSV data
    const headers = ["Metric", "Value"];
    const rows = [
      ["City", city.name],
      ["Population", city.population],
      ["Total Waste Per Day (tons)", city.totalWastePerDay],
      ["Waste Generation Per Capita (kg/day)", city.wasteGenerationPerCapita],
      ["Year", city.year || "N/A"],
      ["Latitude", city.latitude || "N/A"],
      ["Longitude", city.longitude || "N/A"],
      ["Organic Waste (%)", city.composition.organic],
      ["Paper (%)", city.composition.paper],
      ["Plastic (%)", city.composition.plastic],
      ["Glass (%)", city.composition.glass],
      ["Metal (%)", city.composition.metal],
      ["Other (%)", city.composition.other]
    ];
    
    // Convert to CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${city.name.replace(/\s+/g, '_')}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "CSV Downloaded",
      description: `${city.name} data has been downloaded as CSV.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-4" 
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">{city.name}</h1>
          </div>
          
          <Button onClick={handleDownloadCSV} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Map className="h-4 w-4 mr-2 text-gray-500" />
                General Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Population:</dt>
                  <dd className="text-sm font-medium">{city.population.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Year:</dt>
                  <dd className="text-sm font-medium">{city.year || "N/A"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Location:</dt>
                  <dd className="text-sm font-medium">
                    {city.latitude && city.longitude ? 
                      `${city.latitude.toFixed(4)}, ${city.longitude.toFixed(4)}` : 
                      "N/A"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileBarChart2 className="h-4 w-4 mr-2 text-gray-500" />
                Waste Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Total Waste:</dt>
                  <dd className="text-sm font-medium">{city.totalWastePerDay.toLocaleString()} tons/day</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Per Capita:</dt>
                  <dd className="text-sm font-medium">{city.wasteGenerationPerCapita} kg/day</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Annual Generation:</dt>
                  <dd className="text-sm font-medium">{(city.totalWastePerDay * 365).toLocaleString()} tons/year</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <PieChart className="h-4 w-4 mr-2 text-gray-500" />
                Waste Composition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WasteCompositionChart 
                composition={compositionArray}
                className="h-40 mt-2" 
              />
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="investment" className="w-full">
          <TabsList className="bg-gray-200/70 dark:bg-gray-800/70 backdrop-blur-sm p-1 rounded-lg mb-6">
            <TabsTrigger value="investment">
              <LineChart className="h-4 w-4 mr-2" />
              Investment Analysis
            </TabsTrigger>
            <TabsTrigger value="composition">
              <PieChart className="h-4 w-4 mr-2" />
              Detailed Composition
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="investment">
            <InvestmentAnalysis city={city} />
          </TabsContent>
          
          <TabsContent value="composition">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Waste Composition</CardTitle>
                <CardDescription>
                  Breakdown of waste materials in {city.name} (% of total waste)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <WasteCompositionChart 
                      composition={compositionArray}
                      className="h-80" 
                    />
                  </div>
                  <div>
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left font-medium text-gray-500 pb-2">Material</th>
                          <th className="text-left font-medium text-gray-500 pb-2">Percentage</th>
                          <th className="text-left font-medium text-gray-500 pb-2">Daily Amount (tons)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2">Organic Waste</td>
                          <td>{city.composition.organic}%</td>
                          <td>{(city.totalWastePerDay * city.composition.organic / 100).toFixed(1)} tons</td>
                        </tr>
                        <tr>
                          <td className="py-2">Paper</td>
                          <td>{city.composition.paper}%</td>
                          <td>{(city.totalWastePerDay * city.composition.paper / 100).toFixed(1)} tons</td>
                        </tr>
                        <tr>
                          <td className="py-2">Plastic</td>
                          <td>{city.composition.plastic}%</td>
                          <td>{(city.totalWastePerDay * city.composition.plastic / 100).toFixed(1)} tons</td>
                        </tr>
                        <tr>
                          <td className="py-2">Glass</td>
                          <td>{city.composition.glass}%</td>
                          <td>{(city.totalWastePerDay * city.composition.glass / 100).toFixed(1)} tons</td>
                        </tr>
                        <tr>
                          <td className="py-2">Metal</td>
                          <td>{city.composition.metal}%</td>
                          <td>{(city.totalWastePerDay * city.composition.metal / 100).toFixed(1)} tons</td>
                        </tr>
                        <tr>
                          <td className="py-2">Other</td>
                          <td>{city.composition.other}%</td>
                          <td>{(city.totalWastePerDay * city.composition.other / 100).toFixed(1)} tons</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CityReport;
