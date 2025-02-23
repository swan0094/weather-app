import React, { useEffect, useState } from "react";
import { Forecast } from "../models/forecast";

type Location = {
  name: string;
  latitude: number;
  longitude: number;
};

function WeatherApp() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [weather, setWeather] = useState<Forecast | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/get-locations")
      .then((res) => res.json())
      .then((data) => setLocations(data.locations));
  }, []);

  const handleLocationClick = (location: Location) => {
    fetch(
      `http://127.0.0.1:8080/api/get-weather?latitude=${location.latitude}&longitude=${location.longitude}`
    )
      .then((res) => res.json())
      .then((data) => setWeather(data));
  };

  return (
    <div className="weather-app">
      <header>
        <h1>Weather App</h1>
        <h2>Select a location to see the weather</h2>
      </header>
      <div className="locations">
        {locations.map((location, index) => (
          <div
            key={index}
            className="location-tile"
            onClick={() => handleLocationClick(location)}
          >
            {location.name}
          </div>
        ))}
      </div>
      <div className="weather-info">
        <h3>Weather Information</h3>
        {weather ? (
          <div>
            <p>Temperature: {weather.temperature}</p>
            <p>Description: {weather.description}</p>
            <p>Feels Like: {weather.feels_like}</p>
            <p>Humidity: {weather.humidity}</p>
            <p>Wind Speed: {weather.wind_speed}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default WeatherApp;
