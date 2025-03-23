from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from cachetools import TTLCache
from utils import serialize_daily_forecast, serialize_current_weather
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

cache = TTLCache(maxsize=100, ttl=600)

load_dotenv()
API_KEY = os.getenv("OPEN_WEATHER_API_KEY")

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

@app.route("/api/get-forecast", methods=["GET"])
def get_forecast():
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")
    days = request.args.get("days", default=6, type=int)
    location = f"{latitude},{longitude}"

    if location in cache:
        return jsonify(cache[location])

    try:
        response = requests.get(
            f"https://api.openweathermap.org/data/2.5/forecast/daily?lat={latitude}&lon={longitude}&units=metric&cnt={days}&appid={API_KEY}",
        )
        response.raise_for_status()
        weather_data = response.json()

        forecast = {
            "coordinates": (latitude, longitude),
            "country": weather_data["city"]["country"],
            "daily_forecasts": [serialize_daily_forecast(df) for df in weather_data["list"]],
            "city": weather_data["city"]["name"],
            "population": weather_data["city"]["population"],
            "timezone": weather_data["city"]["timezone"]
        }
        cache[location] = forecast
        return jsonify(forecast)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/get-current-weather", methods=["GET"])
def get_current_weather():
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")
    location = f"{latitude},{longitude}"

    if location in cache:
        return jsonify(cache[location])

    try:
        response = requests.get(
            f"https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&units=metric&appid={API_KEY}",
        )
        response.raise_for_status()
        weather_data = response.json()

        current_weather = serialize_current_weather(weather_data)
        cache[location] = current_weather
        return jsonify(current_weather)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8080)