import React, { useEffect, useState } from "react";
import { Forecast, DailyForecast, CurrentWeather } from "../models/forecast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { getDayName } from "@/utils/utils";

type Location = {
  name: string;
  latitude: number;
  longitude: number;
};

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

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
      <div className="weather-info">
        {loading ? (
          <div className="weather-details">
            <Skeleton height={30} width={200} style={{ marginBottom: 10 }} />
            <Skeleton height={30} width={300} style={{ marginBottom: 10 }} />
            <Skeleton height={30} width={250} style={{ marginBottom: 10 }} />
            <Skeleton height={30} width={150} style={{ marginBottom: 10 }} />
            <Skeleton height={30} width={180} style={{ marginBottom: 10 }} />
          </div>
        ) : currentWeather ? (
          <>
            <div className="weather-details">
              <h3>
                Forecast for {getDayName(currentWeather.dt)} (
                {new Date(currentWeather.dt).toLocaleDateString()})
              </h3>
              <Image
                src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                alt={currentWeather.weather[0].description}
                width={100}
                height={100}
                style={{ margin: 0, padding: 0 }}
              />
              <p className="current-temp">
                Current Temperature: {currentWeather.main.temp.toFixed(1)}°C
              </p>
              <p>Feels Like: {currentWeather.main.feels_like.toFixed(1)}°C</p>
              <p>Humidity: {currentWeather.main.humidity}%</p>
              <p>Wind Speed: {currentWeather.wind.speed.toFixed(1)} km/h</p>
              <p>
                Precipitation: {currentWeather.rain?.one_h?.toFixed(1) || 0} mm
              </p>
              <p className="min-temp">
                Min Temp: {currentWeather.main.temp_min.toFixed(1)}°C
              </p>
              <p className="max-temp">
                Max Temp: {currentWeather.main.temp_max.toFixed(1)}°C
              </p>
              <button className="clear-button" onClick={handleClearClick}>
                Clear
              </button>

              <div className="week-overview">
                {forecast != null &&
                  forecast.daily_forecasts
                    // Get the next 5 days forecast and ignore the current day as it has
                    // already been displayed.
                    .slice(1, 6)
                    .map((dailyForecast: DailyForecast, index: number) => (
                      <div key={index} className="day-forecast">
                        <p>{getDayName(dailyForecast.dt)}</p>
                        <Image
                          src={`http://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`}
                          alt={dailyForecast.weather[0].description}
                          width={50}
                          height={50}
                        />
                        <p>{dailyForecast.temp.max.toFixed(1)}°C</p>
                      </div>
                    ))}
              </div>
            </div>
            {selectedLocation && (
              <div className="map-container">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={{
                    lat: selectedLocation.latitude,
                    lng: selectedLocation.longitude,
                  }}
                  zoom={13}
                  options={{
                    disableDefaultUI: true,
                    draggable: false,
                    zoomControl: false,
                    scrollwheel: false,
                    disableDoubleClickZoom: true,
                  }}
                >
                  <Marker
                    position={{
                      lat: selectedLocation.latitude,
                      lng: selectedLocation.longitude,
                    }}
                  />
                </GoogleMap>
              </div>
            )}
          </>
        ) : (
          <p>Select a location to see the weather information.</p>
        )}
      </div>
    </div>
  );
}

export default WeatherApp;
