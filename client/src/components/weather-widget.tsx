import { Cloud, Thermometer } from "lucide-react";
import { useWeatherData } from "@/hooks/use-real-time-data";

export function WeatherWidget() {
  const weather = useWeatherData();

  if (weather.loading) {
    return (
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-4 rounded-lg shadow-lg min-w-[280px]">
        <div className="flex items-center space-x-2 mb-2">
          <Cloud className="w-5 h-5" />
          <span className="text-sm font-medium">Ob-havo</span>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold mb-1">...</div>
          <div className="text-sm opacity-90">Ma'lumot yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  if (weather.error) {
    return (
      <div className="bg-gradient-to-br from-gray-400 to-gray-500 text-white p-4 rounded-lg shadow-lg min-w-[280px]">
        <div className="flex items-center space-x-2 mb-2">
          <Cloud className="w-5 h-5" />
          <span className="text-sm font-medium">Ob-havo</span>
        </div>
        <div className="text-center">
          <div className="text-sm opacity-90">Ma'lumot olinmadi</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-4 rounded-lg shadow-lg min-w-[280px]">
      <div className="flex items-center space-x-2 mb-3">
        <Cloud className="w-5 h-5" />
        <span className="text-sm font-medium">Ob-havo</span>
      </div>
      
      <div className="text-center mb-4">
        <div className="text-3xl font-bold mb-1">
          {weather.temperature > 0 ? '+' : ''}{weather.temperature}°C
        </div>
        <div className="text-sm opacity-90 capitalize">
          {weather.location}, {weather.condition.toLowerCase()}
        </div>
      </div>

      <div className="flex justify-between text-center text-sm">
        <div>
          <div className="font-medium">Bugun</div>
          <div className="opacity-90">+{weather.forecast.today}°C</div>
        </div>
        <div>
          <div className="font-medium">Ertaga</div>
          <div className="opacity-90">+{weather.forecast.tomorrow}°C</div>
        </div>
        <div>
          <div className="font-medium">Indinga</div>
          <div className="opacity-90">+{weather.forecast.dayAfter}°C</div>
        </div>
      </div>
    </div>
  );
}