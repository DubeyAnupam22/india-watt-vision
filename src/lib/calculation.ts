
import { create } from "zustand";

// Waste data types
export interface WasteComposition {
  organic: number;
  paper: number;
  plastic: number;
  glass: number;
  metal: number;
  other: number;
}

export interface CityWasteData {
  id: string;
  name: string;
  population: number;
  totalWastePerDay: number;
  wasteGenerationPerCapita: number;
  composition: WasteComposition;
  year?: number;
  latitude?: number;
  longitude?: number;
}

// Type for waste composition with wasteTypeId and percentage
export interface WasteType {
  id: string;
  name: string;
  defaultComposition: number;
  caloricValue: number; // MJ/kg
}

export interface WasteTypeComposition {
  wasteTypeId: string;
  percentage: number;
}

// Define waste types
export const wasteTypes: WasteType[] = [
  { id: "organic", name: "Organic Waste", defaultComposition: 55, caloricValue: 4 },
  { id: "paper", name: "Paper", defaultComposition: 12, caloricValue: 16 },
  { id: "plastic", name: "Plastic", defaultComposition: 12, caloricValue: 35 },
  { id: "glass", name: "Glass", defaultComposition: 4, caloricValue: 0 },
  { id: "metal", name: "Metal", defaultComposition: 4, caloricValue: 0 },
  { id: "other", name: "Other", defaultComposition: 13, caloricValue: 10 },
];

export interface TechnologyData {
  id: string;
  name: string;
  efficiency: number;
  minCapacity: number;
  maxCapacity: number;
  capitalCostPerTon: number;
  operatingCostPerTon: number;
  revenuePerMWh: number;
}

export interface EnergyCalculationResult {
  dailyEnergy: number;
  monthlyEnergy: number;
  yearlyEnergy: number;
  bestTechnology: TechnologyData;
  paybackPeriodYears: number;
  annualRevenue: number;
  annualOperatingCost: number;
  capitalCost: number;
  co2Savings: number;
}

export interface WasteDataStore {
  cities: CityWasteData[];
  addCity: (city: CityWasteData) => void;
  updateCity: (id: string, data: Partial<CityWasteData>) => void;
  deleteCity: (id: string) => void;
  getCityById: (id: string) => CityWasteData | undefined;
}

// Waste conversion technologies
export const conversionTechnologies: TechnologyData[] = [
  {
    id: "incineration",
    name: "Mass Burn Incineration",
    efficiency: 0.25,
    minCapacity: 300,
    maxCapacity: 3000,
    capitalCostPerTon: 600000,
    operatingCostPerTon: 8000,
    revenuePerMWh: 5500
  },
  {
    id: "gasification",
    name: "Gasification",
    efficiency: 0.28,
    minCapacity: 200,
    maxCapacity: 1500,
    capitalCostPerTon: 750000,
    operatingCostPerTon: 10000,
    revenuePerMWh: 6000
  },
  {
    id: "pyrolysis",
    name: "Pyrolysis",
    efficiency: 0.22,
    minCapacity: 50,
    maxCapacity: 500,
    capitalCostPerTon: 500000,
    operatingCostPerTon: 7000,
    revenuePerMWh: 5000
  },
  {
    id: "plasma",
    name: "Plasma Arc Gasification",
    efficiency: 0.30,
    minCapacity: 250,
    maxCapacity: 2000,
    capitalCostPerTon: 900000,
    operatingCostPerTon: 12000,
    revenuePerMWh: 6500
  }
];

// Sample data - extended with more cities
const sampleCities: CityWasteData[] = [
  {
    id: "1",
    name: "Mumbai",
    population: 20667656,
    totalWastePerDay: 7500,
    wasteGenerationPerCapita: 0.65,
    composition: {
      organic: 55,
      paper: 14,
      plastic: 16,
      glass: 3,
      metal: 3,
      other: 9
    },
    year: 2023,
    latitude: 19.076,
    longitude: 72.8777
  },
  {
    id: "2",
    name: "Delhi",
    population: 16753235,
    totalWastePerDay: 10500,
    wasteGenerationPerCapita: 0.57,
    composition: {
      organic: 60,
      paper: 11,
      plastic: 9,
      glass: 2,
      metal: 2,
      other: 16
    },
    year: 2023,
    latitude: 28.7041,
    longitude: 77.1025
  },
  {
    id: "3",
    name: "Bengaluru", 
    population: 8443675,
    totalWastePerDay: 3500,
    wasteGenerationPerCapita: 0.58,
    composition: {
      organic: 62,
      paper: 10,
      plastic: 12,
      glass: 3,
      metal: 2,
      other: 11
    },
    year: 2023,
    latitude: 12.9716,
    longitude: 77.5946
  },
  {
    id: "4",
    name: "Chennai",
    population: 7088000,
    totalWastePerDay: 5500,
    wasteGenerationPerCapita: 0.71,
    composition: {
      organic: 40,
      paper: 10,
      plastic: 13,
      glass: 4,
      metal: 4,
      other: 29
    },
    year: 2023,
    latitude: 13.0827,
    longitude: 80.2707
  },
  {
    id: "5",
    name: "Kolkata",
    population: 4496694,
    totalWastePerDay: 3600,
    wasteGenerationPerCapita: 0.48,
    composition: {
      organic: 51,
      paper: 11,
      plastic: 11,
      glass: 2,
      metal: 3,
      other: 22
    },
    year: 2023,
    latitude: 22.5726,
    longitude: 88.3639
  },
  {
    id: "6",
    name: "Hyderabad",
    population: 6809970,
    totalWastePerDay: 4200,
    wasteGenerationPerCapita: 0.62,
    composition: {
      organic: 54,
      paper: 12,
      plastic: 15,
      glass: 3,
      metal: 4,
      other: 12
    },
    year: 2023,
    latitude: 17.385,
    longitude: 78.4867
  },
  {
    id: "7",
    name: "Ahmedabad",
    population: 5570585,
    totalWastePerDay: 3300,
    wasteGenerationPerCapita: 0.59,
    composition: {
      organic: 48,
      paper: 13,
      plastic: 14,
      glass: 4,
      metal: 3,
      other: 18
    },
    year: 2023,
    latitude: 23.0225,
    longitude: 72.5714
  },
  {
    id: "8",
    name: "Pune",
    population: 3124458,
    totalWastePerDay: 1800,
    wasteGenerationPerCapita: 0.58,
    composition: {
      organic: 59,
      paper: 12,
      plastic: 10,
      glass: 3,
      metal: 2,
      other: 14
    },
    year: 2023,
    latitude: 18.5204,
    longitude: 73.8567
  },
  {
    id: "9",
    name: "Surat",
    population: 4467797,
    totalWastePerDay: 2200,
    wasteGenerationPerCapita: 0.49,
    composition: {
      organic: 57,
      paper: 9,
      plastic: 13,
      glass: 2,
      metal: 3,
      other: 16
    },
    year: 2023,
    latitude: 21.1702,
    longitude: 72.8311
  },
  {
    id: "10",
    name: "Jaipur",
    population: 3046163,
    totalWastePerDay: 1490,
    wasteGenerationPerCapita: 0.49,
    composition: {
      organic: 45,
      paper: 11,
      plastic: 14,
      glass: 3,
      metal: 2,
      other: 25
    },
    year: 2023,
    latitude: 26.9124,
    longitude: 75.7873
  },
  {
    id: "11",
    name: "Lucknow",
    population: 2815601,
    totalWastePerDay: 1350,
    wasteGenerationPerCapita: 0.48,
    composition: {
      organic: 54,
      paper: 10,
      plastic: 12,
      glass: 2,
      metal: 2,
      other: 20
    },
    year: 2023,
    latitude: 26.8467,
    longitude: 80.9462
  },
  {
    id: "12",
    name: "Kanpur",
    population: 2767031,
    totalWastePerDay: 1300,
    wasteGenerationPerCapita: 0.47,
    composition: {
      organic: 52,
      paper: 8,
      plastic: 13,
      glass: 3,
      metal: 2,
      other: 22
    },
    year: 2023,
    latitude: 26.4499,
    longitude: 80.3319
  },
  {
    id: "13",
    name: "Indore",
    population: 1994397,
    totalWastePerDay: 950,
    wasteGenerationPerCapita: 0.48,
    composition: {
      organic: 50,
      paper: 12,
      plastic: 15,
      glass: 3,
      metal: 3,
      other: 17
    },
    year: 2023,
    latitude: 22.7196,
    longitude: 75.8577
  },
  {
    id: "14",
    name: "Kochi",
    population: 602046,
    totalWastePerDay: 420,
    wasteGenerationPerCapita: 0.7,
    composition: {
      organic: 62,
      paper: 8,
      plastic: 11,
      glass: 4,
      metal: 3,
      other: 12
    },
    year: 2023,
    latitude: 9.9312,
    longitude: 76.2673
  },
  {
    id: "15",
    name: "Bhopal",
    population: 1798218,
    totalWastePerDay: 830,
    wasteGenerationPerCapita: 0.46,
    composition: {
      organic: 55,
      paper: 10,
      plastic: 12,
      glass: 3,
      metal: 2,
      other: 18
    },
    year: 2023,
    latitude: 23.2599,
    longitude: 77.4126
  },
  {
    id: "16",
    name: "Guwahati",
    population: 957352,
    totalWastePerDay: 550,
    wasteGenerationPerCapita: 0.57,
    composition: {
      organic: 58,
      paper: 9,
      plastic: 13,
      glass: 2,
      metal: 2,
      other: 16
    },
    year: 2023,
    latitude: 26.1445,
    longitude: 91.7362
  },
  {
    id: "17",
    name: "Chandigarh",
    population: 1055450,
    totalWastePerDay: 480,
    wasteGenerationPerCapita: 0.45,
    composition: {
      organic: 50,
      paper: 13,
      plastic: 16,
      glass: 4,
      metal: 4,
      other: 13
    },
    year: 2023,
    latitude: 30.7333,
    longitude: 76.7794
  },
  {
    id: "18",
    name: "Nagpur",
    population: 2405665,
    totalWastePerDay: 1100,
    wasteGenerationPerCapita: 0.46,
    composition: {
      organic: 53,
      paper: 11,
      plastic: 14,
      glass: 3,
      metal: 3,
      other: 16
    },
    year: 2023,
    latitude: 21.1458,
    longitude: 79.0882
  },
  {
    id: "19",
    name: "Visakhapatnam",
    population: 2035922,
    totalWastePerDay: 990,
    wasteGenerationPerCapita: 0.49,
    composition: {
      organic: 56,
      paper: 10,
      plastic: 13,
      glass: 3,
      metal: 2,
      other: 16
    },
    year: 2023,
    latitude: 17.6868,
    longitude: 83.2185
  }
];

// Helper function to convert city composition to array format
export const convertCompositionToArray = (cityData: CityWasteData): WasteTypeComposition[] => {
  return wasteTypes.map(type => ({
    wasteTypeId: type.id,
    percentage: cityData.composition[type.id as keyof WasteComposition]
  }));
};

// Energy potential calculation
export const calculateEnergyPotential = (cityData: CityWasteData): EnergyCalculationResult => {
  // Calculate calorific values based on waste composition
  const calorificValues = {
    organic: 4, // MJ/kg
    paper: 16,
    plastic: 35,
    glass: 0,
    metal: 0,
    other: 10
  };
  
  // Calculate weighted average calorific value
  const averageCaloricValue = (
    (calorificValues.organic * cityData.composition.organic / 100) +
    (calorificValues.paper * cityData.composition.paper / 100) +
    (calorificValues.plastic * cityData.composition.plastic / 100) +
    (calorificValues.glass * cityData.composition.glass / 100) +
    (calorificValues.metal * cityData.composition.metal / 100) +
    (calorificValues.other * cityData.composition.other / 100)
  );
  
  // Find the appropriate technology based on capacity
  const suitableTechnologies = conversionTechnologies.filter(tech => 
    cityData.totalWastePerDay >= tech.minCapacity && 
    cityData.totalWastePerDay <= tech.maxCapacity
  );
  
  // If no suitable technology, use the first one (default)
  const bestTechnology = suitableTechnologies.length > 0
    ? suitableTechnologies.reduce((best, current) => 
        current.efficiency > best.efficiency ? current : best
      )
    : conversionTechnologies[0];

  // Energy calculation (MJ to kWh conversion: 1 MJ = 0.277778 kWh)
  const dailyEnergyMJ = cityData.totalWastePerDay * 1000 * averageCaloricValue * bestTechnology.efficiency;
  const dailyEnergy = dailyEnergyMJ * 0.277778;
  const monthlyEnergy = dailyEnergy * 30;
  const yearlyEnergy = dailyEnergy * 365;
  
  // Financial calculation
  const capitalCost = cityData.totalWastePerDay * bestTechnology.capitalCostPerTon;
  const annualOperatingCost = cityData.totalWastePerDay * bestTechnology.operatingCostPerTon * 365;
  const annualRevenue = (dailyEnergy / 1000) * bestTechnology.revenuePerMWh * 365; // Revenue from electricity sales
  const annualNetRevenue = annualRevenue - annualOperatingCost;
  const paybackPeriodYears = capitalCost / annualNetRevenue;
  
  // CO2 savings calculation (rough estimate)
  const co2Savings = yearlyEnergy * 0.7; // kg CO2 saved per kWh
  
  return {
    dailyEnergy,
    monthlyEnergy,
    yearlyEnergy,
    bestTechnology,
    paybackPeriodYears,
    annualRevenue,
    annualOperatingCost,
    capitalCost,
    co2Savings
  };
};

// Create store
export const useWasteData = create<WasteDataStore>((set, get) => ({
  cities: sampleCities,
  addCity: (city) => set((state) => ({ cities: [...state.cities, city] })),
  updateCity: (id, data) => set((state) => ({
    cities: state.cities.map(city => 
      city.id === id ? { ...city, ...data } : city
    )
  })),
  deleteCity: (id) => set((state) => ({
    cities: state.cities.filter(city => city.id !== id)
  })),
  getCityById: (id) => get().cities.find(city => city.id === id)
}));
