import { CurrentWeather, Forecast } from "../models/forecast";
import { getDayName } from "@/utils/utils";

export const formatWeatherResponse = (
  currentWeather: CurrentWeather | null,
  forecast: Forecast | null,
  days: number
): string => {
  let response = "";

  if (days === 1 && currentWeather) {
    response += `Current Temperature: ${currentWeather.main.temp.toFixed(
      1
    )}°C\n`;
    response += `Feels Like: ${currentWeather.main.feels_like.toFixed(1)}°C\n`;
    response += `Humidity: ${currentWeather.main.humidity}%\n`;
    response += `Wind Speed: ${currentWeather.wind.speed.toFixed(1)} km/h\n`;
    response += `Precipitation: ${
      currentWeather.rain?.one_h?.toFixed(1) || 0
    } mm\n`;
    response += `Min Temp: ${currentWeather.main.temp_min.toFixed(1)}°C\n`;
    response += `Max Temp: ${currentWeather.main.temp_max.toFixed(1)}°C\n`;
  } else if (forecast) {
    response += `The weather forecast for the next ${days} days is:\n\n`;
    forecast.daily_forecasts.slice(0, days).forEach((dailyForecast) => {
      response += `${getDayName(
        dailyForecast.dt
      )}: ${dailyForecast.temp.max.toFixed(1)}°C\n`;
    });
  } else {
    response = "Sorry, I couldn't fetch the weather information.";
  }

  return response;
};
