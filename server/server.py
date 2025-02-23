from flask import Flask, request, jsonify
from flask_cors import CORS
from models.forecast import Forecast
from python_weather.enums import Kind, UltraViolet, WindDirection, Phase, HeatIndex

import python_weather
import asyncio
import os
import time
from cachetools import TTLCache
from utils import serialize_daily_forecast, serialize_hourly_forecast

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

cache = TTLCache(maxsize=100, ttl=600)

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

@app.route("/api/get-weather", methods=["GET"])
async def get_weather():
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")
    location = f"{latitude},{longitude}"

    if location in cache:
        return jsonify(cache[location])

    try:
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
            cache[location] = forecast
            return jsonify(forecast)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8080)