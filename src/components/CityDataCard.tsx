
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CityWasteData, calculateEnergyPotential, convertCompositionToArray } from "@/lib/calculation";
import { useNavigate } from "react-router-dom";
import { File, Trash, Pencil, ZapIcon, Users, Banknote, Clock } from "lucide-react";
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
    navigate(`/city/${city.id}`);
  };

  // Convert composition to array format for the chart
  const compositionArray = convertCompositionToArray(city);

  const roi = energyPotential.paybackPeriodYears;
  const roiClass = roi <= 3 ? "text-green-600" : roi <= 5 ? "text-amber-600" : "text-red-500";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-700 text-white pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{city.name}</CardTitle>
            <div className="flex items-center mt-1 text-white/90">
              <Users className="h-3.5 w-3.5 mr-1" />
              <CardDescription className="text-white/90 text-sm">
                {city.population.toLocaleString()} | Year: {city.year}
              </CardDescription>
            </div>
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
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Waste per capita</p>
              <p className="font-medium">{city.wasteGenerationPerCapita} kg/day</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Total waste</p>
              <p className="font-medium">{city.totalWastePerDay.toLocaleString()} t/day</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Energy potential</p>
              <div className="font-medium flex items-center">
                <ZapIcon className="h-4 w-4 text-amber-500 mr-1" />
                {dailyEnergyMWh} MWh/day
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Best technology</p>
              <p className="font-medium truncate">{energyPotential.bestTechnology.name}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-500 mb-2">Waste Composition</h4>
            <WasteCompositionChart composition={compositionArray} className="h-36" />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-gray-50 flex justify-between items-center py-3">
        {showActions && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-gray-600" 
            onClick={handleViewDetails}
          >
            <File className="h-4 w-4 mr-2" />
            Details
          </Button>
        )}
        
        <div className="flex items-center">
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1 text-gray-500" />
              <span className={`text-sm font-medium ${roiClass}`}>
                ROI: {energyPotential.paybackPeriodYears.toFixed(1)} years
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ₹{(energyPotential.annualRevenue / 10000000).toFixed(1)} Cr/year
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CityDataCard;
