import "react-loading-skeleton/dist/skeleton.css";
import React, { useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import Weather from "../components/weather";
import ChatbotComponent from "../components/chatbot";
import { Forecast, CurrentWeather } from "../models/forecast";
import { Location } from "../models/location";

function WeatherApp() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/get-locations")
      .then((res) => res.json())
      .then((data) => setLocations(data.locations));
  }, []);

  const handleLocationClick = (location: Location) => {
    setLoading(true);
    setSelectedLocation(location);

    fetch(
      `http://127.0.0.1:8080/api/get-current-weather?latitude=${location.latitude}&longitude=${location.longitude}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCurrentWeather(data);
      });
    fetch(
      `http://127.0.0.1:8080/api/get-forecast?latitude=${location.latitude}&longitude=${location.longitude}`
    )
      .then((res) => res.json())
      .then((data) => {
        setForecast(data);
        setLoading(false);
      });
  };

  const handleClearClick = () => {
    setCurrentWeather(null);
    setForecast(null);
    setSelectedLocation(null);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

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
      <Weather
        loading={loading}
        currentWeather={currentWeather}
        forecast={forecast}
        selectedLocation={selectedLocation}
        handleClearClick={handleClearClick}
      />
      <ChatbotComponent />
    </div>
  );
}

export default WeatherApp;
