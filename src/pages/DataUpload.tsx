
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { CityWasteData, WasteTypeComposition, wasteTypes, useWasteData, convertCompositionToArray } from "@/lib/calculation";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import WasteCompositionChart from "@/components/WasteCompositionChart";
import { ArrowLeft, CheckCircle, Clipboard, FileUp, Loader2, Upload } from "lucide-react";

const DataUpload = () => {
  const { isAuthenticated, canUploadData } = useAuth();
  const { addCity, getCityById, updateCity } = useWasteData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editCityId = searchParams.get("edit") || undefined;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"manual" | "file">("manual");
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formState, setFormState] = useState<{
    name: string;
    population: number;
    wasteGenerationPerCapita: number;
    totalWastePerDay: number;
    year: number;
    composition: WasteTypeComposition[];
    latitude?: number;
    longitude?: number;
  }>({
    name: "",
    population: 1000000,
    wasteGenerationPerCapita: 0.5,
    totalWastePerDay: 500,
    year: new Date().getFullYear(),
    composition: wasteTypes.map(type => ({
      wasteTypeId: type.id,
      percentage: type.defaultComposition,
    })),
    latitude: undefined,
    longitude: undefined,
  });
  
  // For file upload demo
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Load city data if editing
  useEffect(() => {
    if (editCityId) {
      const cityData = getCityById(editCityId);
      if (cityData) {
        setIsEditing(true);
        setFormState({
          name: cityData.name,
          population: cityData.population,
          wasteGenerationPerCapita: cityData.wasteGenerationPerCapita,
          totalWastePerDay: cityData.totalWastePerDay,
          year: cityData.year || new Date().getFullYear(),
          composition: convertCompositionToArray(cityData),
          latitude: cityData.latitude,
          longitude: cityData.longitude,
        });
      }
    }
  }, [editCityId, getCityById]);
  
  // Redirect if not authenticated or not allowed to upload
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!canUploadData()) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, canUploadData, navigate]);
  
  const handleInputChange = (
    name: keyof typeof formState,
    value: string | number
  ) => {
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Update total waste when population or waste per capita changes
    if (name === "population" || name === "wasteGenerationPerCapita") {
      const population = name === "population" ? Number(value) : formState.population;
      const wastePerCapita = name === "wasteGenerationPerCapita" ? Number(value) : formState.wasteGenerationPerCapita;
      
      setFormState(prev => ({
        ...prev,
        totalWastePerDay: Math.round((population * wastePerCapita) / 1000), // Convert to tons
      }));
    }
  };
  
  const updateComposition = (id: string, percentage: number) => {
    // Ensure percentages remain valid
    let newComposition = formState.composition.map(item => 
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
    
    setFormState(prev => ({
      ...prev,
      composition: newComposition,
    }));
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileSelected(file);
    }
  };
  
  const simulateFileUpload = () => {
    if (!fileSelected) {
      toast({
        title: "No file selected",
        description: "Please select a CSV or JSON file first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Simulate processing time
          setTimeout(() => {
            setIsUploading(false);
            toast({
              title: "File processed successfully",
              description: "The data has been processed and is ready for review.",
            });
            
            // Switch to manual tab with "parsed" data
            setActiveTab("manual");
          }, 1000);
          
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate the form
      if (!formState.name) {
        throw new Error("City name is required");
      }
      
      if (formState.population <= 0) {
        throw new Error("Population must be greater than 0");
      }
      
      if (formState.wasteGenerationPerCapita <= 0) {
        throw new Error("Waste generation per capita must be greater than 0");
      }
      
      if (formState.totalWastePerDay <= 0) {
        throw new Error("Total waste must be greater than 0");
      }
      
      // Convert composition array to object
      const compositionObj = formState.composition.reduce((obj, item) => {
        return {
          ...obj,
          [item.wasteTypeId]: item.percentage
        };
      }, {}) as any;
      
      // Create city data object
      const cityData: CityWasteData = {
        id: isEditing ? editCityId! : `city-${Date.now()}`,
        name: formState.name,
        population: formState.population,
        wasteGenerationPerCapita: formState.wasteGenerationPerCapita,
        totalWastePerDay: formState.totalWastePerDay,
        year: formState.year,
        composition: compositionObj,
        latitude: formState.latitude,
        longitude: formState.longitude,
      };
      
      // Add or update the city data
      if (isEditing) {
        updateCity(editCityId!, cityData);
        toast({
          title: "Data updated",
          description: `Waste data for ${cityData.name} has been updated successfully.`,
          variant: "default",
        });
      } else {
        addCity(cityData);
        toast({
          title: "Data added",
          description: `Waste data for ${cityData.name} has been added successfully.`,
          variant: "default",
        });
      }
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while saving the data.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isAuthenticated || !canUploadData()) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit City Waste Data" : "Upload City Waste Data"}
          </h1>
          <p className="text-gray-600">
            {isEditing 
              ? "Update the waste composition data for this city"
              : "Add new city waste data for energy potential analysis"
            }
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              {isEditing ? "Update Waste Data" : "Add Waste Data"}
            </CardTitle>
            <CardDescription>
              {isEditing 
                ? "Make changes to the existing waste data for this city"
                : "Enter city details and waste composition data"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab as (value: string) => void} 
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Input</TabsTrigger>
                <TabsTrigger value="file" disabled={isEditing}>File Upload</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual">
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="cityName">City Name</Label>
                        <Input
                          id="cityName"
                          value={formState.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter city name"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="population">Population</Label>
                          <Input
                            id="population"
                            type="number"
                            value={formState.population}
                            onChange={(e) => 
                              handleInputChange("population", Number(e.target.value))
                            }
                            placeholder="Enter population"
                            min={1}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="year">Year</Label>
                          <Input
                            id="year"
                            type="number"
                            value={formState.year}
                            onChange={(e) => 
                              handleInputChange("year", Number(e.target.value))
                            }
                            min={2000}
                            max={2100}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="wastePerCapita">
                          Waste Generation per Capita (kg/day)
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="wastePerCapita"
                            type="number"
                            value={formState.wasteGenerationPerCapita}
                            onChange={(e) => 
                              handleInputChange("wasteGenerationPerCapita", Number(e.target.value))
                            }
                            step={0.01}
                            min={0.01}
                            className="w-24"
                            required
                          />
                          <Slider
                            value={[formState.wasteGenerationPerCapita]}
                            min={0.1}
                            max={2}
                            step={0.01}
                            onValueChange={(values) => 
                              handleInputChange("wasteGenerationPerCapita", values[0])
                            }
                            className="flex-1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="totalWaste">Total Waste (tons/day)</Label>
                        <Input
                          id="totalWaste"
                          type="number"
                          value={formState.totalWastePerDay}
                          onChange={(e) => 
                            handleInputChange("totalWastePerDay", Number(e.target.value))
                          }
                          min={1}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          Calculated from population and waste per capita
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="latitude">Latitude (optional)</Label>
                          <Input
                            id="latitude"
                            type="number"
                            value={formState.latitude || ""}
                            onChange={(e) => 
                              handleInputChange("latitude", Number(e.target.value))
                            }
                            step={0.000001}
                            placeholder="e.g., 28.7041"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="longitude">Longitude (optional)</Label>
                          <Input
                            id="longitude"
                            type="number"
                            value={formState.longitude || ""}
                            onChange={(e) => 
                              handleInputChange("longitude", Number(e.target.value))
                            }
                            step={0.000001}
                            placeholder="e.g., 77.1025"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="mb-3 block">Waste Composition (%)</Label>
                      <div className="space-y-4">
                        <WasteCompositionChart composition={formState.composition} />
                        
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                          {formState.composition.map((item) => {
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
                        
                        <div className="text-sm text-muted-foreground">
                          Adjust sliders to match the waste composition. Total must equal 100%.
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-w2w-green-500 hover:bg-w2w-green-600"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {isEditing ? "Updating..." : "Saving..."}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {isEditing ? "Update Data" : "Save Data"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="file" className="pt-4">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="fileUpload" className="mb-2 block">
                      Upload CSV or JSON File
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <FileUp className="mx-auto h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-gray-600">
                        Drag and drop your file here, or click to browse
                      </p>
                      <Input
                        id="fileUpload"
                        type="file"
                        accept=".csv,.json"
                        onChange={handleFileUpload}
                        className="mt-4 mx-auto max-w-xs"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Supported formats: CSV, JSON
                      </p>
                    </div>
                    
                    {fileSelected && (
                      <div className="mt-4">
                        <p className="text-sm font-medium">
                          Selected file: {fileSelected.name}
                        </p>
                      </div>
                    )}
                    
                    {isUploading && (
                      <div className="mt-4 space-y-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-w2w-green-500 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {uploadProgress < 100
                            ? `Uploading... ${Math.round(uploadProgress)}%`
                            : "Processing file..."}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Template Format</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                      <p className="mb-2">Your CSV should include the following columns:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>city_name</li>
                        <li>population</li>
                        <li>waste_per_capita</li>
                        <li>total_waste</li>
                        <li>year</li>
                        <li>food_waste_pct</li>
                        <li>paper_waste_pct</li>
                        <li>... (and other waste types)</li>
                      </ul>
                      <div className="mt-3 flex items-center">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Clipboard className="h-3 w-3 mr-1" />
                          Download Template
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="button"
                      onClick={simulateFileUpload}
                      disabled={isUploading || !fileSelected}
                      className="bg-w2w-blue-500 hover:bg-w2w-blue-600"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload and Process
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DataUpload;
