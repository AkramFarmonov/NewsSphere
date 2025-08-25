import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  condition: string;
  loading: boolean;
  error: string | null;
}

interface CurrencyData {
  rate: number;
  loading: boolean;
  error: string | null;
}

export function useWeatherData() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 0,
    condition: '',
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Toshkent koordinatalari: 41.31°N, 69.28°E
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=41.31&longitude=69.28&current_weather=true&timezone=Asia%2FTashkent'
        );
        
        if (!response.ok) throw new Error('Weather API failed');
        
        const data = await response.json();
        const currentWeather = data.current_weather;
        
        setWeather({
          temperature: Math.round(currentWeather.temperature),
          condition: getWeatherCondition(currentWeather.weathercode),
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Weather fetch error:', error);
        setWeather(prev => ({
          ...prev,
          loading: false,
          error: 'Ma\'lumot olinmadi'
        }));
      }
    };

    fetchWeather();
    // Har 10 daqiqada yangilash
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return weather;
}

export function useCurrencyData() {
  const [currency, setCurrency] = useState<CurrencyData>({
    rate: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD'
        );
        
        if (!response.ok) throw new Error('Currency API failed');
        
        const data = await response.json();
        const uzsRate = data.rates.UZS;
        
        setCurrency({
          rate: Math.round(uzsRate),
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Currency fetch error:', error);
        setCurrency(prev => ({
          ...prev,
          loading: false,
          error: 'Ma\'lumot olinmadi'
        }));
      }
    };

    fetchCurrency();
    // Har 30 daqiqada yangilash
    const interval = setInterval(fetchCurrency, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return currency;
}

export function useTashkentTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const updateTime = () => {
      const tashkentTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Tashkent"
      });
      setTime(new Date(tashkentTime));
    };

    updateTime();
    // Har daqiqa yangilash
    const interval = setInterval(updateTime, 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return time;
}

function getWeatherCondition(code: number): string {
  // Open-Meteo weather codes
  if (code === 0) return 'Musaffo';
  if ([1, 2, 3].includes(code)) return 'Qisman bulutli';
  if ([45, 48].includes(code)) return 'Tumanli';
  if ([51, 53, 55].includes(code)) return 'Yomg\'ir';
  if ([61, 63, 65].includes(code)) return 'Yomg\'ir';
  if ([71, 73, 75].includes(code)) return 'Qor';
  if ([80, 81, 82].includes(code)) return 'Kuchli yomg\'ir';
  if ([95, 96, 99].includes(code)) return 'Momaqaldiroq';
  return 'Aniqlanmagan';
}