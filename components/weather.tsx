import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { getDayName } from "@/utils/utils";
import { Forecast, CurrentWeather } from "../models/forecast";
import { Location } from "../models/location";

type WeatherProps = {
  loading: boolean;
  currentWeather: CurrentWeather | null;
  forecast: Forecast | null;
  selectedLocation: Location | null;
  handleClearClick: () => void;
};

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const Weather: React.FC<WeatherProps> = ({
  loading,
  currentWeather,
  forecast,
  selectedLocation,
  handleClearClick,
}) => {
  return (
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
                  .slice(1, 6)
                  .map((dailyForecast, index) => (
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
  );
};

export default Weather;
