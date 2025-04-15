
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { CityWasteData, calculateEnergyPotential } from "@/lib/calculation";
import WasteCompositionChart from "./WasteCompositionChart";
import { WasteDataTable } from "./WasteDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { BarChart2, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react";

interface DataAnalysisProps {
  cities: CityWasteData[];
}

interface TableCityData {
  id: string;
  name: string;
  population: number;
  waste: number;
  wastePerCapita: number;
  energyPotential: number;
  payback: number;
  technology: string;
}

const DataAnalysis: React.FC<DataAnalysisProps> = ({ cities }) => {
  const [activeTab, setActiveTab] = useState("energy");
  
  // Prepare data for the charts
  const energyData = cities.map(city => {
    const energyResult = calculateEnergyPotential(city);
    return {
      name: city.name,
      dailyEnergy: Number((energyResult.dailyEnergy / 1000).toFixed(2)),
      monthlyEnergy: Number((energyResult.monthlyEnergy / 1000).toFixed(2)),
      yearlyEnergy: Number((energyResult.yearlyEnergy / 1000).toFixed(2)),
      payback: Number(energyResult.paybackPeriodYears.toFixed(1)),
      technology: energyResult.bestTechnology.name,
      revenue: Number((energyResult.annualRevenue / 10000000).toFixed(2)),
      cost: Number((energyResult.annualOperatingCost / 10000000).toFixed(2)),
    };
  });
  
  const wasteData = cities.map(city => {
    return {
      name: city.name,
      totalWaste: city.totalWastePerDay,
      wastePerCapita: city.wasteGenerationPerCapita,
      population: city.population / 1000000, // Convert to millions
    };
  });

  // Prepare data for the table
  const tableData: TableCityData[] = cities.map(city => {
    const energyResult = calculateEnergyPotential(city);
    return {
      id: city.id,
      name: city.name,
      population: city.population,
      waste: city.totalWastePerDay,
      wastePerCapita: city.wasteGenerationPerCapita,
      energyPotential: Number((energyResult.dailyEnergy / 1000).toFixed(2)),
      payback: Number(energyResult.paybackPeriodYears.toFixed(1)),
      technology: energyResult.bestTechnology.name
    };
  });
  
  const columns: ColumnDef<TableCityData>[] = [
    {
      accessorKey: "name",
      header: "City",
    },
    {
      accessorKey: "population",
      header: "Population",
      cell: ({ row }) => (
        <div className="text-right">
          {row.getValue("population").toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "waste",
      header: "Waste (t/day)",
      cell: ({ row }) => (
        <div className="text-right">
          {row.getValue("waste").toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "wastePerCapita",
      header: "Waste per capita (kg)",
      cell: ({ row }) => (
        <div className="text-right">
          {row.getValue("wastePerCapita")}
        </div>
      ),
    },
    {
      accessorKey: "energyPotential",
      header: "Energy (MWh/day)",
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.getValue("energyPotential")}
        </div>
      ),
    },
    {
      accessorKey: "technology",
      header: "Technology",
    },
    {
      accessorKey: "payback",
      header: "Payback (yrs)",
      cell: ({ row }) => (
        <div className="text-right">
          {row.getValue("payback")}
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Comparative Data Analysis
        </CardTitle>
        <CardDescription>
          Compare waste data and energy potential across different cities
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-3">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="energy" className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Energy</span>
              <span className="sm:hidden">E</span>
            </TabsTrigger>
            <TabsTrigger value="waste" className="flex items-center">
              <LineChartIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Waste</span>
              <span className="sm:hidden">W</span>
            </TabsTrigger>
            <TabsTrigger value="composition" className="flex items-center">
              <PieChartIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Composition</span>
              <span className="sm:hidden">C</span>
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center">
              <svg
                className="h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
                <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
                <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
                <rect width="12" height="12" x="6" y="6" rx="1"></rect>
                <path d="M6 12h12"></path>
                <path d="M12 6v12"></path>
              </svg>
              <span className="hidden sm:inline">Table</span>
              <span className="sm:hidden">T</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="energy" className="mt-4 pt-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Daily Energy Production Potential (MWh/day)</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={energyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} MWh`, `Daily Energy`]}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="dailyEnergy" name="Energy Potential" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">ROI Analysis (Years to Payback)</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={energyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === "revenue") return [`₹${value} Cr`, "Annual Revenue"];
                          if (name === "cost") return [`₹${value} Cr`, "Annual Cost"];
                          if (name === "payback") return [`${value} years`, "Payback Period"];
                          return [value, name];
                        }}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" name="Annual Revenue (Cr)" fill="#2196F3" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="cost" name="Annual Cost (Cr)" fill="#FFC107" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="payback" name="Payback Period (Years)" fill="#FF5722" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="waste" className="mt-4 pt-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Total Waste Generation (tons/day)</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={wasteData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} tons`, `Daily Waste`]}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="totalWaste" name="Total Waste" fill="#795548" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Waste Generation vs Population</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={wasteData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === "wastePerCapita") return [`${value} kg/day`, "Waste per Capita"];
                          if (name === "population") return [`${value} million`, "Population"];
                          return [value, name];
                        }}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Legend />
                      <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="wastePerCapita" 
                        name="Waste per Capita (kg/day)" 
                        stroke="#FF5722" 
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="population" 
                        name="Population (millions)" 
                        stroke="#2196F3" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="composition" className="mt-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cities.map((city) => (
                <div key={city.id} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{city.name}</h3>
                  <WasteCompositionChart composition={city.composition} className="h-64" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table" className="mt-4 pt-2">
            <WasteDataTable 
              columns={columns} 
              data={tableData} 
              caption="City Waste and Energy Data Comparison"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataAnalysis;
