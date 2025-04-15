
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CityWasteData, WasteComposition, calculateEnergyPotential, conversionTechnologies, wasteTypes } from "@/lib/calculation";
import WasteCompositionChart from "./WasteCompositionChart";
import { BarChart3, Calculator, Zap } from "lucide-react";

interface EnergyCalculatorProps {
  cityData?: CityWasteData;
}

const EnergyCalculator: React.FC<EnergyCalculatorProps> = ({ cityData }) => {
  const [waste, setWaste] = useState<CityWasteData>({
    id: "calculator",
    name: cityData?.name || "Custom City",
    population: cityData?.population || 1000000,
    wasteGenerationPerCapita: cityData?.wasteGenerationPerCapita || 0.5,
    totalWastePerDay: cityData?.totalWastePerDay || 500,
    composition: cityData?.composition || wasteTypes.map(type => ({
      wasteTypeId: type.id,
      percentage: type.defaultComposition,
    })),
    year: new Date().getFullYear(),
  });
  
  const [selectedTechnology, setSelectedTechnology] = useState<string>(
    conversionTechnologies[0].id
  );
  
  const energyResult = calculateEnergyPotential(waste);
  
  const updateComposition = (id: string, percentage: number) => {
    // Ensure percentages remain valid
    let newComposition = waste.composition.map(item => 
      item.wasteTypeId === id 
        ? { ...item, percentage } 
        : item
    );
    
    // Calculate the sum of all percentages
    const totalPercentage = newComposition.reduce((sum, item) => sum + item.percentage, 0);
    
    // If the total is not 100%, adjust the other values proportionally
    if (totalPercentage !== 100) {
      // Calculate how much to adjust other items
      const itemsToAdjust = newComposition.filter(item => item.wasteTypeId !== id);
      const currentOthersTotal = itemsToAdjust.reduce((sum, item) => sum + item.percentage, 0);
      const targetOthersTotal = 100 - percentage;
      
      if (currentOthersTotal > 0) {
        const adjustmentFactor = targetOthersTotal / currentOthersTotal;
        
        newComposition = newComposition.map(item => 
          item.wasteTypeId === id 
            ? item 
            : { ...item, percentage: Math.max(0, item.percentage * adjustmentFactor) }
        );
      }
    }
    
    setWaste({
      ...waste,
      composition: newComposition,
    });
  };
  
  const updateWastePerCapita = (value: number) => {
    setWaste({
      ...waste,
      wasteGenerationPerCapita: value,
      totalWastePerDay: (value * waste.population) / 1000, // Convert kg to tons
    });
  };
  
  const updatePopulation = (value: number) => {
    setWaste({
      ...waste,
      population: value,
      totalWastePerDay: (waste.wasteGenerationPerCapita * value) / 1000, // Convert kg to tons
    });
  };
  
  const updateTotalWaste = (value: number) => {
    setWaste({
      ...waste,
      totalWastePerDay: value,
      // We don't adjust population here, as total waste might be affected by other factors
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Energy Potential Calculator
          </CardTitle>
          <CardDescription>
            Adjust waste parameters to calculate energy generation potential
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Population</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={waste.population}
                    onChange={(e) => updatePopulation(Number(e.target.value))}
                    min={1000}
                    className="w-24"
                  />
                  <Slider
                    value={[waste.population]}
                    min={10000}
                    max={20000000}
                    step={10000}
                    onValueChange={(values) => updatePopulation(values[0])}
                    className="flex-1"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  City population affects total waste generation
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Waste per capita (kg/day)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={waste.wasteGenerationPerCapita}
                    onChange={(e) => updateWastePerCapita(Number(e.target.value))}
                    step={0.01}
                    min={0.1}
                    max={2}
                    className="w-24"
                  />
                  <Slider
                    value={[waste.wasteGenerationPerCapita]}
                    min={0.1}
                    max={2}
                    step={0.01}
                    onValueChange={(values) => updateWastePerCapita(values[0])}
                    className="flex-1"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Average waste generation per person
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Total waste (tons/day)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={waste.totalWastePerDay}
                    onChange={(e) => updateTotalWaste(Number(e.target.value))}
                    step={10}
                    min={1}
                    className="w-24"
                  />
                  <Slider
                    value={[waste.totalWastePerDay]}
                    min={1}
                    max={10000}
                    step={10}
                    onValueChange={(values) => updateTotalWaste(values[0])}
                    className="flex-1"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Total municipal solid waste generated daily
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Technology</Label>
                <Select
                  value={selectedTechnology}
                  onValueChange={setSelectedTechnology}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select technology" />
                  </SelectTrigger>
                  <SelectContent>
                    {conversionTechnologies.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name} (Efficiency: {tech.efficiency * 100}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground">
                  Select waste-to-energy conversion technology
                </div>
              </div>
            </div>
            
            <div>
              <Label className="mb-3 block">Waste Composition (%)</Label>
              <div className="space-y-4">
                <WasteCompositionChart composition={waste.composition} />
                
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {waste.composition.map((item) => {
                    const wasteType = wasteTypes.find(
                      (w) => w.id === item.wasteTypeId
                    );
                    return (
                      <div key={item.wasteTypeId} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{wasteType?.name}</span>
                          <span>{item.percentage.toFixed(1)}%</span>
                        </div>
                        <Slider
                          value={[item.percentage]}
                          min={0}
                          max={100}
                          step={0.1}
                          onValueChange={(values) =>
                            updateComposition(item.wasteTypeId, values[0])
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Calculated Energy Potential
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-energy p-4 rounded-lg text-white">
              <div className="text-sm opacity-80">Daily Energy</div>
              <div className="text-2xl font-bold flex items-center">
                <Zap className="h-5 w-5 mr-1" />
                {(energyResult.dailyEnergy / 1000).toFixed(2)} MWh
              </div>
              <div className="text-sm opacity-80 mt-1">
                {Math.round(energyResult.dailyEnergy).toLocaleString()} kWh
              </div>
            </div>
            
            <div className="bg-w2w-blue-500 p-4 rounded-lg text-white">
              <div className="text-sm opacity-80">Monthly Energy</div>
              <div className="text-2xl font-bold">
                {(energyResult.monthlyEnergy / 1000).toFixed(2)} MWh
              </div>
              <div className="text-sm opacity-80 mt-1">
                {Math.round(energyResult.monthlyEnergy).toLocaleString()} kWh
              </div>
            </div>
            
            <div className="bg-w2w-amber-500 p-4 rounded-lg text-white">
              <div className="text-sm opacity-80">Annual Energy</div>
              <div className="text-2xl font-bold">
                {(energyResult.yearlyEnergy / 1000).toFixed(2)} MWh
              </div>
              <div className="text-sm opacity-80 mt-1">
                {Math.round(energyResult.yearlyEnergy).toLocaleString()} kWh
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium">Financial Analysis</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-500">Capital Cost</div>
                  <div className="font-medium">
                    ₹{(energyResult.capitalCost / 10000000).toFixed(2)} Cr
                  </div>
                </div>
                
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-500">Operating Cost (Annual)</div>
                  <div className="font-medium">
                    ₹{(energyResult.annualOperatingCost / 10000000).toFixed(2)} Cr/yr
                  </div>
                </div>
                
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-500">Revenue (Annual)</div>
                  <div className="font-medium text-w2w-green-600">
                    ₹{(energyResult.annualRevenue / 10000000).toFixed(2)} Cr/yr
                  </div>
                </div>
                
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-500">Payback Period</div>
                  <div className="font-medium">
                    {energyResult.paybackPeriodYears.toFixed(1)} years
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Environmental Impact</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-500">Best Technology</div>
                  <div className="font-medium">
                    {energyResult.bestTechnology.name}
                  </div>
                </div>
                
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-500">Efficiency</div>
                  <div className="font-medium">
                    {(energyResult.bestTechnology.efficiency * 100).toFixed(1)}%
                  </div>
                </div>
                
                <div className="border rounded p-3 col-span-2">
                  <div className="text-sm text-gray-500">CO₂ Savings vs. Landfill</div>
                  <div className="font-medium text-w2w-green-600">
                    {(energyResult.co2Savings / 1000).toFixed(1)} tonnes CO₂/year
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t bg-muted/50 flex flex-col sm:flex-row items-center justify-between gap-2 py-3">
          <div className="text-sm text-muted-foreground">
            Equivalent to powering approximately {Math.round(energyResult.yearlyEnergy / (900 * 12))} households for a year
          </div>
          
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Generate Full Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EnergyCalculator;
