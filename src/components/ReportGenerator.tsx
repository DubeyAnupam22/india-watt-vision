
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CityWasteData } from "@/lib/calculation";
import { toast } from "@/components/ui/use-toast";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";

interface ReportGeneratorProps {
  cities: CityWasteData[];
  selectedCityId?: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ cities, selectedCityId }) => {
  const [format, setFormat] = useState<"pdf" | "excel" | "csv">("pdf");
  const [selectedCity, setSelectedCity] = useState<string>(selectedCityId || (cities[0]?.id || ""));
  const [includeOptions, setIncludeOptions] = useState({
    wasteData: true,
    energyCalculation: true,
    financialAnalysis: true,
    environmentalImpact: true,
    recommendations: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  
  // For custom title
  const [useCustomTitle, setUseCustomTitle] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  
  const handleGenerateReport = () => {
    if (!selectedCity) {
      toast({
        title: "Error",
        description: "Please select a city to generate a report",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      
      const cityName = cities.find(c => c.id === selectedCity)?.name || "Unknown";
      
      if (format === "csv") {
        // Generate and download CSV file
        generateAndDownloadCSV(cityName);
      } else {
        // Show toast for PDF and Excel formats
        toast({
          title: "Report Generated",
          description: `Your ${format.toUpperCase()} report for ${cityName} has been generated successfully.`,
        });
      }
    }, 2000);
  };

  // Function to generate and download CSV file
  const generateAndDownloadCSV = (cityName: string) => {
    const selectedCityData = cities.find(c => c.id === selectedCity);
    if (!selectedCityData) return;
    
    // Create CSV header row based on selected options
    const headers = ['City', 'Population', 'Total Waste (t/day)', 'Waste Per Capita (kg/day)'];
    let dataRows = [`${cityName},${selectedCityData.population},${selectedCityData.totalWastePerDay},${selectedCityData.wasteGenerationPerCapita}`];

    // Add waste composition if selected
    if (includeOptions.wasteData) {
      headers.push('Organic (%)', 'Paper (%)', 'Plastic (%)', 'Glass (%)', 'Metal (%)', 'Other (%)');
      const composition = selectedCityData.composition;
      dataRows[0] += `,${composition.organic},${composition.paper},${composition.plastic},${composition.glass},${composition.metal},${composition.other}`;
    }

    // Add energy data if selected
    if (includeOptions.energyCalculation) {
      headers.push('Energy Potential (MWh/day)', 'Recommended Technology');
      // Simple energy calculation for CSV
      const energyPerDay = (selectedCityData.totalWastePerDay * 500) / 1000; // Simplified MWh calculation
      dataRows[0] += `,${energyPerDay.toFixed(2)},"Mass Burn Incineration"`;
    }

    // Add financial data if selected
    if (includeOptions.financialAnalysis) {
      headers.push('Estimated Capital Cost (₹ Cr)', 'Estimated Annual Revenue (₹ Cr)', 'Payback Period (years)');
      // Simplified financial data
      const capitalCost = selectedCityData.totalWastePerDay * 0.5; // Crores
      const annualRevenue = selectedCityData.totalWastePerDay * 0.08; // Crores
      const payback = capitalCost / annualRevenue;
      dataRows[0] += `,${capitalCost.toFixed(2)},${annualRevenue.toFixed(2)},${payback.toFixed(1)}`;
    }

    // Add environmental impact if selected
    if (includeOptions.environmentalImpact) {
      headers.push('CO2 Savings (tons/year)', 'Landfill Space Saved (m²/year)');
      // Simplified environmental data
      const co2Savings = selectedCityData.totalWastePerDay * 365 * 0.5;
      const landfillSaved = selectedCityData.totalWastePerDay * 365 * 0.8;
      dataRows[0] += `,${co2Savings.toFixed(0)},${landfillSaved.toFixed(0)}`;
    }

    // Combine headers and data
    const csvContent = [headers.join(','), ...dataRows].join('\n');
    
    // Create downloadable CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set file name - use custom title or default
    const fileName = useCustomTitle && customTitle 
      ? `${customTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`
      : `waste_energy_report_${cityName.toLowerCase().replace(/\s/g, '_')}.csv`;
      
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "CSV Downloaded",
      description: `Your CSV report for ${cityName} has been downloaded.`,
    });
  };
  
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
          Generate Waste-to-Energy Report
        </CardTitle>
        <CardDescription>
          Create comprehensive reports based on your waste data and energy calculations
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">Select City</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger id="city" className="bg-white dark:bg-gray-900">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="format">Report Format</Label>
              <Select value={format} onValueChange={(value: "pdf" | "excel" | "csv") => setFormat(value)}>
                <SelectTrigger id="format" className="bg-white dark:bg-gray-900">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV File</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="customTitle" 
                checked={useCustomTitle} 
                onCheckedChange={(checked) => setUseCustomTitle(checked === true)}
              />
              <label htmlFor="customTitle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Use custom report title
              </label>
            </div>
            
            {useCustomTitle && (
              <div className="grid gap-2">
                <Label htmlFor="title">Custom Title</Label>
                <Input
                  id="title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter custom report title"
                  className="bg-white dark:bg-gray-900"
                />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Include in Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="wasteData" 
                  checked={includeOptions.wasteData}
                  onCheckedChange={(checked) => 
                    setIncludeOptions({...includeOptions, wasteData: checked === true})
                  }
                />
                <label htmlFor="wasteData" className="text-sm font-medium leading-none">
                  Waste Composition Data
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="energyCalculation" 
                  checked={includeOptions.energyCalculation}
                  onCheckedChange={(checked) => 
                    setIncludeOptions({...includeOptions, energyCalculation: checked === true})
                  }
                />
                <label htmlFor="energyCalculation" className="text-sm font-medium leading-none">
                  Energy Potential Calculation
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="financialAnalysis" 
                  checked={includeOptions.financialAnalysis}
                  onCheckedChange={(checked) => 
                    setIncludeOptions({...includeOptions, financialAnalysis: checked === true})
                  }
                />
                <label htmlFor="financialAnalysis" className="text-sm font-medium leading-none">
                  Financial Analysis
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="environmentalImpact" 
                  checked={includeOptions.environmentalImpact}
                  onCheckedChange={(checked) => 
                    setIncludeOptions({...includeOptions, environmentalImpact: checked === true})
                  }
                />
                <label htmlFor="environmentalImpact" className="text-sm font-medium leading-none">
                  Environmental Impact
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="recommendations" 
                  checked={includeOptions.recommendations}
                  onCheckedChange={(checked) => 
                    setIncludeOptions({...includeOptions, recommendations: checked === true})
                  }
                />
                <label htmlFor="recommendations" className="text-sm font-medium leading-none">
                  Recommendations & Next Steps
                </label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex flex-col sm:flex-row sm:justify-between gap-3 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="text-sm text-muted-foreground">
          Report will include data from the selected city only.
        </div>
        
        <Button 
          onClick={handleGenerateReport} 
          disabled={isGenerating || !selectedCity}
          className={`w-full sm:w-auto ${format === 'csv'
            ? 'bg-emerald-600 hover:bg-emerald-700'
            : format === 'excel'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-w2w-blue-500 hover:bg-w2w-blue-600'
          }`}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : format === 'csv' ? (
            <FileSpreadsheet className="h-4 w-4 mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Generate {format.toUpperCase()} Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportGenerator;
