
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CityWasteData } from "@/lib/calculation";
import { toast } from "@/components/ui/use-toast";
import { Download, FileText, Loader2 } from "lucide-react";

interface ReportGeneratorProps {
  cities: CityWasteData[];
  selectedCityId?: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ cities, selectedCityId }) => {
  const [format, setFormat] = useState<"pdf" | "excel">("pdf");
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
      
      toast({
        title: "Report Generated",
        description: `Your ${format.toUpperCase()} report for ${cityName} has been generated successfully.`,
      });
    }, 2000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Generate Waste-to-Energy Report
        </CardTitle>
        <CardDescription>
          Create comprehensive reports based on your waste data and energy calculations
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">Select City</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger id="city">
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
              <Select value={format} onValueChange={(value: "pdf" | "excel") => setFormat(value)}>
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
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
      
      <CardFooter className="border-t pt-4 flex flex-col sm:flex-row sm:justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Report will include data from the selected city only.
        </div>
        
        <Button 
          onClick={handleGenerateReport} 
          disabled={isGenerating || !selectedCity}
          className="w-full sm:w-auto bg-w2w-blue-500 hover:bg-w2w-blue-600"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
