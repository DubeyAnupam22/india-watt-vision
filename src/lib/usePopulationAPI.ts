
import { useState, useEffect } from 'react';
import { useWasteData } from './calculation';

// This hook will handle fetching population data from an external API
export function usePopulationAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cities, updateCity } = useWasteData();

  // This function would normally fetch from a real API
  // For demonstration purposes, we're using simulated data
  const fetchPopulationData = async (cityName: string) => {
    // This simulates an API call
    return new Promise<number>((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // For demonstration purposes, generate population within ±5% of current value
        // In a real implementation, this would be replaced with actual API data
        const cityData = cities.find(c => c.name === cityName);
        if (cityData) {
          const variation = (Math.random() * 0.1) - 0.05; // -5% to +5%
          const updatedPopulation = Math.round(cityData.population * (1 + variation));
          resolve(updatedPopulation);
        } else {
          resolve(0);
        }
      }, 500);
    });
  };

  // Function to check ROI and update if needed
  const updateCityROI = (cityName: string) => {
    const city = cities.find(c => c.name === cityName);
    if (!city) return;
    
    // No need to update the ROI calculation here as it's already handled by calculateEnergyPotential
    // This is just a placeholder for additional ROI logic if needed
  };

  // Function to refresh population data for all cities
  const refreshAllCityData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Process cities in sequence to avoid overwhelming the API
      for (const city of cities) {
        // In a real implementation, this would actually call a real API
        const updatedPopulation = await fetchPopulationData(city.name);
        
        if (updatedPopulation > 0) {
          // Update the city with new population data
          updateCity(city.id, { 
            population: updatedPopulation,
            // Recalculate total waste based on updated population
            totalWastePerDay: Math.round((updatedPopulation * city.wasteGenerationPerCapita) / 1000)
          });
          
          // Update ROI calculations
          updateCityROI(city.name);
        }
      }
    } catch (err) {
      setError('Failed to fetch population data');
      console.error('Population API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically refresh data when the component mounts
  useEffect(() => {
    // Disabled for demo purposes to avoid confusing users with changing numbers
    // refreshAllCityData();
    
    // In a real app, you might want to refresh periodically:
    // const intervalId = setInterval(refreshAllCityData, 3600000); // refresh every hour
    // return () => clearInterval(intervalId);
  }, []);

  return {
    isLoading,
    error,
    refreshAllCityData
  };
}
