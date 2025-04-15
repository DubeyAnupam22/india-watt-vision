
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
}

interface TechnologyData {
  name: string;
  efficiency: number;
  minCapacity: number;
  maxCapacity: number;
  capitalCostPerTon: number;
  operatingCostPerTon: number;
  revenuePerMWh: number;
}

interface EnergyCalculationResult {
  dailyEnergy: number;
  monthlyEnergy: number;
  yearlyEnergy: number;
  bestTechnology: TechnologyData;
  paybackPeriodYears: number;
  annualRevenue: number;
  annualOperatingCost: number;
}

export interface WasteDataStore {
  cities: CityWasteData[];
  addCity: (city: CityWasteData) => void;
  updateCity: (id: string, data: Partial<CityWasteData>) => void;
  getCityById: (id: string) => CityWasteData | undefined;
}

// Waste conversion technologies
const technologies: TechnologyData[] = [
  {
    name: "Mass Burn Incineration",
    efficiency: 0.25,
    minCapacity: 300,
    maxCapacity: 3000,
    capitalCostPerTon: 600000,
    operatingCostPerTon: 8000,
    revenuePerMWh: 5500
  },
  {
    name: "Gasification",
    efficiency: 0.28,
    minCapacity: 200,
    maxCapacity: 1500,
    capitalCostPerTon: 750000,
    operatingCostPerTon: 10000,
    revenuePerMWh: 6000
  },
  {
    name: "Pyrolysis",
    efficiency: 0.22,
    minCapacity: 50,
    maxCapacity: 500,
    capitalCostPerTon: 500000,
    operatingCostPerTon: 7000,
    revenuePerMWh: 5000
  },
  {
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
  }
];

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
  const suitableTechnologies = technologies.filter(tech => 
    cityData.totalWastePerDay >= tech.minCapacity && 
    cityData.totalWastePerDay <= tech.maxCapacity
  );
  
  // If no suitable technology, use the first one (default)
  const bestTechnology = suitableTechnologies.length > 0
    ? suitableTechnologies.reduce((best, current) => 
        current.efficiency > best.efficiency ? current : best
      )
    : technologies[0];

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
  
  return {
    dailyEnergy,
    monthlyEnergy,
    yearlyEnergy,
    bestTechnology,
    paybackPeriodYears,
    annualRevenue,
    annualOperatingCost
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
  getCityById: (id) => get().cities.find(city => city.id === id)
}));
