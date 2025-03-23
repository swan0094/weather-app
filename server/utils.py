from datetime import datetime
from models.forecast import DailyForecast, Weather, CurrentWeather, Main, Wind, Clouds, Rain, Snow, Coord

def serialize_daily_forecast(daily_forecast: DailyForecast) -> dict:
    return {
        "dt": datetime.fromtimestamp(daily_forecast["dt"]).strftime('%Y-%m-%d'),  # Convert Unix timestamp to date string
        "sunrise": daily_forecast["sunrise"],
        "sunset": daily_forecast["sunset"],
        "temp": {
            "min": daily_forecast["temp"]["min"],
            "max": daily_forecast["temp"]["max"]
        },
        "humidity": daily_forecast["humidity"],
        "weather": [serialize_weather(w) for w in daily_forecast["weather"]],
        "speed": daily_forecast["speed"],
        "deg": daily_forecast["deg"],
        "clouds": daily_forecast["clouds"],
        "rain": daily_forecast.get("rain", 0),
        "snow": daily_forecast.get("snow", 0),
        "pop": daily_forecast["pop"]
    }

def serialize_weather(weather: Weather) -> dict:
    return {
        "id": weather["id"],
        "main": weather["main"],
        "description": weather["description"],
        "icon": weather["icon"]
    }

def serialize_current_weather(current_weather: CurrentWeather) -> dict:
    return {
        "weather": [serialize_weather(w) for w in current_weather["weather"]],
        "base": current_weather["base"],
        "main": serialize_main(current_weather["main"]),
        "visibility": current_weather["visibility"],
        "wind": serialize_wind(current_weather["wind"]),
        "clouds": serialize_clouds(current_weather["clouds"]),
        "rain": serialize_rain(current_weather.get("rain", {})),
        "snow": serialize_snow(current_weather.get("snow", {})),
        "dt": datetime.fromtimestamp(current_weather["dt"]).strftime('%Y-%m-%d'),  # Convert Unix timestamp to date string
        "name": current_weather["name"],
    }

def serialize_coord(coord: Coord) -> dict:
    return {
        "lat": coord["lat"],
        "lon": coord["lon"]
    }

def serialize_main(main: Main) -> dict:
    return {
        "temp": main["temp"],
        "feels_like": main["feels_like"],
        "temp_min": main["temp_min"],
        "temp_max": main["temp_max"],
        "pressure": main["pressure"],
        "humidity": main["humidity"],
        "sea_level": main.get("sea_level"),
        "grnd_level": main.get("grnd_level")
    }

def serialize_wind(wind: Wind) -> dict:
    return {
        "speed": wind["speed"],
        "deg": wind["deg"],
        "gust": wind.get("gust")
    }

def serialize_clouds(clouds: Clouds) -> dict:
    return {
        "all": clouds["all"]
    }

def serialize_rain(rain: Rain) -> dict:
    return {
        "one_h": rain.get("1h", 0)
    }

def serialize_snow(snow: Snow) -> dict:
    return {
        "one_h": snow.get("1h", 0)
    }