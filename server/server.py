from flask import Flask, request, jsonify
from flask_cors import CORS
from models.forecast import Forecast, DailyForecast, HourlyForecast
from python_weather.enums import Kind, UltraViolet, WindDirection, Phase, HeatIndex

import python_weather

import asyncio
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/api/get-locations", methods=["GET"])
def get_locations():
    locations = [
        {"name": "Cumbria", "latitude": 54.4609, "longitude": -3.0886},
        {"name": "Corfe Castle", "latitude": 50.6395, "longitude": -2.0566},
        {"name": "The Cotswolds", "latitude": 51.8330, "longitude": -1.8433},
        {"name": "Cambridge", "latitude": 52.2053, "longitude": 0.1218},
        {"name": "Bristol", "latitude": 51.4545, "longitude": -2.5879},
        {"name": "Oxford", "latitude": 51.7520, "longitude": -1.2577},
        {"name": "Norwich", "latitude": 52.6309, "longitude": 1.2974},
        {"name": "Stonehenge", "latitude": 51.1789, "longitude": -1.8262},
        {"name": "Watergate Bay", "latitude": 50.4429, "longitude": -5.0553},
        {"name": "Birmingham", "latitude": 52.4862, "longitude": -1.8904}
    ]
    return jsonify({"locations": locations})

def serialize_daily_forecast(daily_forecast: DailyForecast) -> dict:
    return {
        "date": daily_forecast.date.isoformat(),
        "highest_temperature": daily_forecast.highest_temperature,
        "hourly_forecasts": [serialize_hourly_forecast(hf) for hf in daily_forecast.hourly_forecasts],
        "lowest_temperature": daily_forecast.lowest_temperature,
        "moon_illumination": daily_forecast.moon_illumination,
        "moon_phase": daily_forecast.moon_phase.name,
        "moonrise": daily_forecast.moonrise.isoformat() if daily_forecast.moonrise else None,
        "moonset": daily_forecast.moonset.isoformat() if daily_forecast.moonset else None,
        "snowfall": daily_forecast.snowfall,
        "sunlight": daily_forecast.sunlight,
        "sunrise": daily_forecast.sunrise.isoformat() if daily_forecast.sunrise else None,
        "sunset": daily_forecast.sunset.isoformat() if daily_forecast.sunset else None,
        "temperature": daily_forecast.temperature
    }

def serialize_hourly_forecast(hourly_forecast: HourlyForecast) -> dict:
    return {
        "chances_of_fog": hourly_forecast.chances_of_fog,
        "chances_of_frost": hourly_forecast.chances_of_frost,
        "chances_of_high_temperature": hourly_forecast.chances_of_high_temperature,
        "chances_of_overcast": hourly_forecast.chances_of_overcast,
        "chances_of_rain": hourly_forecast.chances_of_rain,
        "chances_of_remaining_dry": hourly_forecast.chances_of_remaining_dry,
        "chances_of_snow": hourly_forecast.chances_of_snow,
        "chances_of_sunshine": hourly_forecast.chances_of_sunshine,
        "chances_of_thunder": hourly_forecast.chances_of_thunder,
        "chances_of_windy": hourly_forecast.chances_of_windy,
        "cloud_cover": hourly_forecast.cloud_cover,
        "description": hourly_forecast.description,
        "dew_point": hourly_forecast.dew_point,
        "feels_like": hourly_forecast.feels_like,
        "heat_index": hourly_forecast.heat_index.name,
        "humidity": hourly_forecast.humidity,
        "kind": hourly_forecast.kind.name,
        "precipitation": hourly_forecast.precipitation,
        "pressure": hourly_forecast.pressure,
        "temperature": hourly_forecast.temperature,
        "time": hourly_forecast.time.isoformat(),
        "ultraviolet": hourly_forecast.ultraviolet.name,
        "visibility": hourly_forecast.visibility,
        "wind_chill": hourly_forecast.wind_chill,
        "wind_direction": hourly_forecast.wind_direction.name,
        "wind_gust": hourly_forecast.wind_gust,
        "wind_speed": hourly_forecast.wind_speed
    }

@app.route("/api/get-weather", methods=["GET"])
async def get_weather():
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")
    location = f"{latitude},{longitude}"
    async with python_weather.Client() as client:
        weather = await client.get(location)
        forecast = {
            "coordinates": (latitude, longitude),
            "country": weather.country,
            "daily_forecasts": [serialize_daily_forecast(df) for df in weather.daily_forecasts],
            "datetime": weather.datetime.isoformat(),
            "description": weather.description,
            "feels_like": weather.feels_like,
            "humidity": weather.humidity,
            "kind": weather.kind.name,
            "local_population": weather.local_population,
            "location": weather.location,
            "precipitation": weather.precipitation,
            "pressure": weather.pressure,
            "region": weather.region,
            "temperature": weather.temperature,
            "ultraviolet": weather.ultraviolet.name,
            "visibility": weather.visibility,
            "wind_direction": weather.wind_direction.name,
            "wind_speed": weather.wind_speed
        }
        return jsonify(forecast)

if __name__ == "__main__":
    app.run(debug=True, port=8080)