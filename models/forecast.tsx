export type Coord = {
  lat: number; // Geo location, latitude
  lon: number; // Geo location, longitude
};

export type Weather = {
  id: number; // Weather condition id
  main: string; // Group of weather parameters (Rain, Snow, Clouds etc.)
  description: string; // Weather condition within the group
  icon: string; // Weather icon id
};

export type Temp = {
  min: number; // Min daily temperature
  max: number; // Max daily temperature
};

export type DailyForecast = {
  dt: Date; // Time of data forecasted
  sunrise: number; // Sunrise time
  sunset: number; // Sunset time
  temp: Temp;
  humidity: number; // Humidity, %
  weather: Weather[];
  speed: number; // Maximum wind speed for the day
  deg: number; // Wind direction relevant to the maximum wind speed, degrees (meteorological)
  clouds: number; // Cloudiness, %
  rain?: number; // Precipitation volume, mm
  snow?: number; // Snow volume, mm
  pop: number; // Probability of precipitation
};

export type City = {
  name: string; // City name
  coord: Coord;
  country: string; // Country code (GB, JP etc.)
};

export type Forecast = {
  daily_forecasts: DailyForecast[]; // List of daily forecasts
  city: City;
};

export type Main = {
  temp: number; // Temperature
  feels_like: number; // Feels like temperature
  temp_min: number; // Minimum temperature at the moment
  temp_max: number; // Maximum temperature at the moment
  pressure: number; // Atmospheric pressure on the sea level, hPa
  humidity: number; // Humidity, %
  sea_level?: number; // Atmospheric pressure on the sea level, hPa
  grnd_level?: number; // Atmospheric pressure on the ground level, hPa
};

export type Wind = {
  speed: number; // Wind speed
  deg: number; // Wind direction, degrees (meteorological)
  gust?: number; // Wind gust
};

export type Clouds = {
  all: number; // Cloudiness, %
};

export type Rain = {
  one_h?: number; // Precipitation, mm/h
};

export type CurrentWeather = {
  coord: Coord;
  weather: Weather[];
  main: Main;
  visibility: number; // Visibility, meter
  wind: Wind;
  clouds: Clouds;
  rain?: Rain;
  dt: Date; // Time of data calculation, unix, UTC
  timezone: number; // Shift in seconds from UTC
  name: string; // City name
};
