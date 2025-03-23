from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime

@dataclass
class Coord:
    lat: float  # Geo location, latitude
    lon: float  # Geo location, longitude

@dataclass
class Weather:
    id: int  # Weather condition id
    main: str  # Group of weather parameters (Rain, Snow, Clouds etc.)
    description: str  # Weather condition within the group
    icon: str  # Weather icon id

@dataclass
class Temp:
    min: float  # Min daily temperature
    max: float  # Max daily temperature

@dataclass
class DailyForecast:
    dt: datetime  # Time of data forecasted
    sunrise: int  # Sunrise time
    sunset: int  # Sunset time
    temp: Temp
    humidity: int  # Humidity, %
    weather: List[Weather]
    speed: float  # Maximum wind speed for the day
    deg: int  # Wind direction relevant to the maximum wind speed, degrees (meteorological)
    clouds: int  # Cloudiness, %
    rain: Optional[float]  # Precipitation volume, mm
    snow: Optional[float]  # Snow volume, mm
    pop: float  # Probability of precipitation

@dataclass
class City:
    name: str  # City name
    coord: Coord
    country: str  # Country code (GB, JP etc.)

@dataclass
class Forecast:
    daily_forecasts: List[DailyForecast]  # List of daily forecasts
    city: City

@dataclass
class Main:
    temp: float  # Temperature
    feels_like: float  # Feels like temperature
    temp_min: float  # Minimum temperature at the moment
    temp_max: float  # Maximum temperature at the moment
    pressure: int  # Atmospheric pressure on the sea level, hPa
    humidity: int  # Humidity, %
    sea_level: Optional[int]  # Atmospheric pressure on the sea level, hPa
    grnd_level: Optional[int]  # Atmospheric pressure on the ground level, hPa

@dataclass
class Wind:
    speed: float  # Wind speed
    deg: int  # Wind direction, degrees (meteorological)
    gust: Optional[float]  # Wind gust

@dataclass
class Clouds:
    all: int  # Cloudiness, %

@dataclass
class Rain:
    one_h: Optional[float]  # Precipitation, mm/h

@dataclass
class Snow:
    one_h: Optional[float]  # Precipitation, mm/h

@dataclass
class CurrentWeather:
    coord: Coord
    weather: List[Weather]
    main: Main
    visibility: int  # Visibility, meter
    wind: Wind
    clouds: Clouds
    rain: Optional[Rain]
    dt: int  # Time of data calculation, unix, UTC
    timezone: int  # Shift in seconds from UTC
    name: str  # City name