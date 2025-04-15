
// Waste type definitions
export interface WasteType {
  id: string;
  name: string;
  heatingValue: number; // in MJ/kg
  defaultComposition: number; // as percentage
}

// Define common waste types and their heating values
export const wasteTypes: WasteType[] = [
  { id: 'food', name: 'Food Waste', heatingValue: 4.2, defaultComposition: 30 },
  { id: 'paper', name: 'Paper & Cardboard', heatingValue: 16.8, defaultComposition: 15 },
  { id: 'plastic', name: 'Plastics', heatingValue: 32.6, defaultComposition: 10 },
  { id: 'textile', name: 'Textiles', heatingValue: 15.9, defaultComposition: 5 },
  { id: 'garden', name: 'Garden & Park Waste', heatingValue: 6.0, defaultComposition: 10 },
  { id: 'wood', name: 'Wood', heatingValue: 18.6, defaultComposition: 5 },
  { id: 'rubber', name: 'Rubber & Leather', heatingValue: 25.5, defaultComposition: 3 },
  { id: 'inert', name: 'Inert Materials', heatingValue: 0, defaultComposition: 22 }
];

// Conversion technologies
export interface ConversionTechnology {
  id: string;
  name: string;
  efficiency: number;
  minWasteVolume: number; // tons per day
  capitalCostPerTon: number; // in INR
  operatingCostPerTon: number; // in INR per ton
  revenuePerMWh: number; // in INR
  co2PerTon: number; // CO2 emissions in kg per ton processed
}

export const conversionTechnologies: ConversionTechnology[] = [
  {
    id: 'incineration',
    name: 'Incineration',
    efficiency: 0.25, // 25% efficiency
    minWasteVolume: 100, // tons per day
    capitalCostPerTon: 7500000, // INR per ton/day capacity
    operatingCostPerTon: 2000, // INR per ton
    revenuePerMWh: 5000, // INR per MWh
    co2PerTon: 1200, // kg CO2 per ton
  },
  {
    id: 'gasification',
    name: 'Gasification',
    efficiency: 0.28, // 28% efficiency
    minWasteVolume: 50, // tons per day
    capitalCostPerTon: 8000000, // INR per ton/day capacity
    operatingCostPerTon: 2500, // INR per ton
    revenuePerMWh: 5500, // INR per MWh
    co2PerTon: 800, // kg CO2 per ton
  },
  {
    id: 'pyrolysis',
    name: 'Pyrolysis',
    efficiency: 0.26, // 26% efficiency
    minWasteVolume: 25, // tons per day
    capitalCostPerTon: 6500000, // INR per ton/day capacity
    operatingCostPerTon: 2300, // INR per ton
    revenuePerMWh: 5200, // INR per MWh
    co2PerTon: 600, // kg CO2 per ton
  }
];

// Waste composition interface
export interface WasteComposition {
  wasteTypeId: string;
  percentage: number;
}

// City waste data interface
export interface CityWasteData {
  id: string;
  name: string;
  population: number;
  wasteGenerationPerCapita: number; // kg per day per person
  totalWastePerDay: number; // tons per day
  composition: WasteComposition[];
  year: number;
  month?: number;
  latitude?: number;
  longitude?: number;
}

// Mock city data
export const mockCityData: CityWasteData[] = [
  {
    id: '1',
    name: 'Mumbai',
    population: 20667656,
    wasteGenerationPerCapita: 0.65,
    totalWastePerDay: 7500,
    composition: wasteTypes.map(type => ({
      wasteTypeId: type.id,
      percentage: type.defaultComposition,
    })),
    year: 2023,
    latitude: 19.0760,
    longitude: 72.8777
  },
  {
    id: '2',
    name: 'Delhi',
    population: 16787941,
    wasteGenerationPerCapita: 0.57,
    totalWastePerDay: 10500,
    composition: wasteTypes.map(type => ({
      wasteTypeId: type.id,
      percentage: type.defaultComposition + (Math.random() * 10 - 5),
    })),
    year: 2023,
    latitude: 28.7041,
    longitude: 77.1025
  },
  {
    id: '3',
    name: 'Bengaluru',
    population: 8443675,
    wasteGenerationPerCapita: 0.5,
    totalWastePerDay: 5000,
    composition: wasteTypes.map(type => ({
      wasteTypeId: type.id,
      percentage: type.defaultComposition + (Math.random() * 10 - 5),
    })),
    year: 2023,
    latitude: 12.9716,
    longitude: 77.5946
  },
  {
    id: '4',
    name: 'Chennai',
    population: 4646732,
    wasteGenerationPerCapita: 0.48,
    totalWastePerDay: 4000,
    composition: wasteTypes.map(type => ({
      wasteTypeId: type.id,
      percentage: type.defaultComposition + (Math.random() * 10 - 5),
    })),
    year: 2023,
    latitude: 13.0827,
    longitude: 80.2707
  },
  {
    id: '5',
    name: 'Kolkata',
    population: 4496694,
    wasteGenerationPerCapita: 0.44,
    totalWastePerDay: 3500,
    composition: wasteTypes.map(type => ({
      wasteTypeId: type.id,
      percentage: type.defaultComposition + (Math.random() * 10 - 5),
    })),
    year: 2023,
    latitude: 22.5726,
    longitude: 88.3639
  }
];

// Calculate heating value based on waste composition
export const calculateHeatingValue = (composition: WasteComposition[]): number => {
  let totalHeatingValue = 0;
  let totalPercentage = 0;
  
  composition.forEach(item => {
    const wasteType = wasteTypes.find(wt => wt.id === item.wasteTypeId);
    if (wasteType) {
      totalHeatingValue += (item.percentage / 100) * wasteType.heatingValue;
      totalPercentage += item.percentage;
    }
  });
  
  // Normalize if percentages don't add up to 100%
  if (totalPercentage > 0 && totalPercentage !== 100) {
    totalHeatingValue = (totalHeatingValue / totalPercentage) * 100;
  }
  
  return totalHeatingValue; // MJ/kg
};

// Calculate energy potential
export interface EnergyPotentialResult {
  dailyEnergy: number; // kWh per day
  monthlyEnergy: number; // kWh per month
  yearlyEnergy: number; // kWh per year
  bestTechnology: ConversionTechnology;
  capitalCost: number; // INR
  annualOperatingCost: number; // INR per year
  annualRevenue: number; // INR per year
  paybackPeriodYears: number;
  co2Savings: number; // kg CO2 saved per year compared to landfill
}

export const calculateEnergyPotential = (cityData: CityWasteData): EnergyPotentialResult => {
  // Calculate average heating value
  const avgHeatingValue = calculateHeatingValue(cityData.composition);
  
  // Calculate energy potentials for each technology
  const results = conversionTechnologies.map(tech => {
    // Skip if waste volume is too small for this technology
    if (cityData.totalWastePerDay < tech.minWasteVolume) {
      return null;
    }
    
    // Basic energy calculation: Waste × Heating Value × Efficiency
    // Convert from MJ to kWh (1 MJ = 0.2778 kWh)
    const dailyEnergyMJ = cityData.totalWastePerDay * 1000 * avgHeatingValue * tech.efficiency;
    const dailyEnergy = dailyEnergyMJ * 0.2778; // kWh per day
    
    const monthlyEnergy = dailyEnergy * 30; // kWh per month (approximate)
    const yearlyEnergy = dailyEnergy * 365; // kWh per year
    
    // Financial calculations
    const capitalCost = cityData.totalWastePerDay * tech.capitalCostPerTon;
    const annualOperatingCost = cityData.totalWastePerDay * 365 * tech.operatingCostPerTon;
    const annualRevenue = yearlyEnergy / 1000 * tech.revenuePerMWh; // Convert kWh to MWh
    
    // Payback period in years
    const annualProfit = annualRevenue - annualOperatingCost;
    const paybackPeriodYears = annualProfit > 0 ? capitalCost / annualProfit : 999;
    
    // Environmental impact
    // Assuming landfill emissions are 1600 kg CO2/ton
    const landfillEmissions = cityData.totalWastePerDay * 365 * 1600; // kg CO2 per year
    const techEmissions = cityData.totalWastePerDay * 365 * tech.co2PerTon; // kg CO2 per year
    const co2Savings = landfillEmissions - techEmissions;
    
    return {
      technology: tech,
      dailyEnergy,
      monthlyEnergy,
      yearlyEnergy,
      capitalCost,
      annualOperatingCost,
      annualRevenue,
      paybackPeriodYears,
      co2Savings
    };
  }).filter(Boolean);
  
  // Choose best technology based on payback period and energy output
  const validResults = results.filter(r => r !== null) as any[];
  const bestResult = validResults.length > 0 ? 
    validResults.reduce((prev, current) => 
      (current.paybackPeriodYears < prev.paybackPeriodYears) ? current : prev
    ) : null;
  
  if (!bestResult) {
    // Fallback if no suitable technology found
    const fallbackTech = conversionTechnologies.find(t => t.id === 'pyrolysis')!;
    return {
      dailyEnergy: 0,
      monthlyEnergy: 0,
      yearlyEnergy: 0,
      bestTechnology: fallbackTech,
      capitalCost: 0,
      annualOperatingCost: 0,
      annualRevenue: 0,
      paybackPeriodYears: 0,
      co2Savings: 0
    };
  }
  
  return {
    dailyEnergy: bestResult.dailyEnergy,
    monthlyEnergy: bestResult.monthlyEnergy,
    yearlyEnergy: bestResult.yearlyEnergy,
    bestTechnology: bestResult.technology,
    capitalCost: bestResult.capitalCost,
    annualOperatingCost: bestResult.annualOperatingCost,
    annualRevenue: bestResult.annualRevenue,
    paybackPeriodYears: bestResult.paybackPeriodYears,
    co2Savings: bestResult.co2Savings
  };
};

// Data store for city waste data
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WasteDataState {
  cities: CityWasteData[];
  addCity: (data: CityWasteData) => void;
  updateCity: (id: string, data: Partial<CityWasteData>) => void;
  deleteCity: (id: string) => void;
  getCityById: (id: string) => CityWasteData | undefined;
}

export const useWasteData = create<WasteDataState>()(
  persist(
    (set, get) => ({
      cities: mockCityData,
      
      addCity: (data: CityWasteData) => {
        set((state) => ({
          cities: [...state.cities, data]
        }));
      },
      
      updateCity: (id: string, data: Partial<CityWasteData>) => {
        set((state) => ({
          cities: state.cities.map((city) => 
            city.id === id ? { ...city, ...data } : city
          )
        }));
      },
      
      deleteCity: (id: string) => {
        set((state) => ({
          cities: state.cities.filter((city) => city.id !== id)
        }));
      },
      
      getCityById: (id: string) => {
        return get().cities.find((city) => city.id === id);
      }
    }),
    {
      name: 'waste2watt-data',
    }
  )
);
