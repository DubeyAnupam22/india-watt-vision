
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CityWasteData, calculateEnergyPotential, convertCompositionToArray } from "@/lib/calculation";
import { useNavigate } from "react-router-dom";
import { File, Trash, Pencil, ZapIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useWasteData } from "@/lib/calculation";
import { toast } from "@/components/ui/use-toast";
import WasteCompositionChart from "./WasteCompositionChart";

interface CityDataCardProps {
  city: CityWasteData;
  showActions?: boolean;
}

const CityDataCard: React.FC<CityDataCardProps> = ({
  city,
  showActions = true,
}) => {
  const navigate = useNavigate();
  const { canEditData } = useAuth();
  const { deleteCity } = useWasteData();
  
  const energyPotential = calculateEnergyPotential(city);
  const dailyEnergyMWh = (energyPotential.dailyEnergy / 1000).toFixed(2);
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete data for ${city.name}?`)) {
      deleteCity(city.id);
      toast({
        title: "Data deleted",
        description: `Data for ${city.name} has been removed.`,
      });
    }
  };
  
  const handleViewDetails = () => {
    navigate(`/dashboard?city=${city.id}`);
  };

  // Convert composition to array format for the chart
  const compositionArray = convertCompositionToArray(city);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="bg-gradient-energy text-white pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{city.name}</CardTitle>
            <CardDescription className="text-white/90">
              Population: {city.population.toLocaleString()} | Year: {city.year}
            </CardDescription>
          </div>
          
          {showActions && canEditData() && (
            <div className="flex space-x-1">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 bg-white/20 hover:bg-white/30 border-white/30"
                onClick={() => navigate(`/data-upload?edit=${city.id}`)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 bg-white/20 hover:bg-white/30 border-white/30"
                onClick={handleDelete}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-gray-500 mb-2">Waste Data</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Waste per capita:</span>
                <span className="font-medium">{city.wasteGenerationPerCapita} kg/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total waste:</span>
                <span className="font-medium">{city.totalWastePerDay.toLocaleString()} tons/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Energy potential:</span>
                <span className="font-medium flex items-center">
                  <ZapIcon className="h-4 w-4 text-w2w-amber-500 mr-1" />
                  {dailyEnergyMWh} MWh/day
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Best technology:</span>
                <span className="font-medium">{energyPotential.bestTechnology.name}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-500 mb-2">Waste Composition</h4>
            <WasteCompositionChart composition={compositionArray} className="h-32" />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-gray-50 flex justify-between py-3">
        {showActions && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-gray-600" 
            onClick={handleViewDetails}
          >
            <File className="h-4 w-4 mr-2" />
            View Details
          </Button>
        )}
        
        <div className="text-sm text-gray-500">
          ROI: {energyPotential.paybackPeriodYears.toFixed(1)} years
        </div>
      </CardFooter>
    </Card>
  );
};

export default CityDataCard;
