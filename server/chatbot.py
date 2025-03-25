from transformers import pipeline
import requests
from geopy.geocoders import Nominatim
import re

model = "google/flan-t5-large"
chatbot_pipeline = pipeline("text2text-generation", model=model, tokenizer=model)

geolocator = Nominatim(user_agent="weather-app")

conversation_history = []

def get_weather_response(weather_query):
    location = weather_query.get("location")
    start_day = weather_query.get("startDay", 1)
    end_day = weather_query.get("endDay", 1)

    try:
        location_data = geolocator.geocode(location)
        if not location_data:
            return f"Could not find coordinates for location: {location}"

        latitude = location_data.latitude
        longitude = location_data.longitude
    except Exception as e:
        return f"Error fetching coordinates: {str(e)}"

    if start_day == end_day == 1:
        weather_response = requests.get(
            f"http://127.0.0.1:8080/api/get-current-weather?latitude={latitude}&longitude={longitude}"
        )
    else:
        days = end_day - start_day + 1
        weather_response = requests.get(
            f"http://127.0.0.1:8080/api/get-forecast?latitude={latitude}&longitude={longitude}&days={days}"
        )

    weather_data = weather_response.json()

    if "error" in weather_data:
        return weather_data["error"]

    if start_day == end_day == 1:
        description = weather_data["weather"][0]["description"]
        temperature = weather_data["main"]["temp"]
        return f"The current weather in {location} is {description} with a temperature of {temperature}°C."

    else:
        forecast = "\n".join(
            [
                f"Day {i+start_day}: {day['description']} with a temperature of {day['temperature']}°C."
                for i, day in enumerate(weather_data["daily_forecasts"])
            ]
        )
        return f"The forecast for {location} from day {start_day} to day {end_day} is:\n{forecast}"


waiting_for_location = False

def get_chatbot_response(user_input):
    global conversation_history, waiting_for_location

    if waiting_for_location:
        location = user_input.strip()
        waiting_for_location = False  

        weather_query = {"location": location, "startDay": 1, "endDay": 1}

        bot_response = get_weather_response(weather_query)
        conversation_history.append(f"Bot: {bot_response}")

        return bot_response


    conversation_history.append(f"User: {user_input}")

    analysis_prompt = (
        f"The user said: '{user_input}'. Determine if they are asking about the weather. "
        "If yes, extract the location and date range in the following format: "
        "is_weather: true/false, location: <location_name>, startDay: <start_day>, endDay: <end_day>. "
        "Replace <location_name> with the actual location name, <start_day> with the start day, and <end_day> with the end day. "
        "Ensure that <location_name> is replaced with a valid location from the input. "
        "Respond ONLY with this format and ensure all placeholders are replaced with actual values. Do not include any extra text or explanation."
    )
    analysis_response = chatbot_pipeline(
        analysis_prompt, max_length=500, num_return_sequences=1
    )
    analysis_result = analysis_response[0]["generated_text"]

    try:
        is_weather_match = re.search(r"is_weather:\s*(true|false)", analysis_result, re.IGNORECASE)
        location_match = re.search(r"location:\s*([\w\s]+)", analysis_result, re.IGNORECASE)
        start_day_match = re.search(r"startDay:\s*(\d+)", analysis_result, re.IGNORECASE)
        end_day_match = re.search(r"endDay:\s*(\d+)", analysis_result, re.IGNORECASE)

        is_weather = is_weather_match.group(1) == "true" if is_weather_match else False
        location = location_match.group(1).strip().replace(">", "") if location_match else None
        start_day = int(start_day_match.group(1)) if start_day_match else 1
        end_day = int(end_day_match.group(1)) if end_day_match else 1

        if location and location.lower() == "location_name":
            location = None

    except AttributeError:
        is_weather = False
        location = None
        start_day = 1
        end_day = 1

    if is_weather:
        if not location:
            bot_response = "I couldn't determine the location. Please specify the location for the weather."
            waiting_for_location = True  
        else:
            weather_query = {"location": location, "startDay": start_day, "endDay": end_day}
            bot_response = get_weather_response(weather_query)
    else:
        response = chatbot_pipeline(
            user_input, max_length=200, num_return_sequences=1, truncation=True
        )
        bot_response = response[0]["generated_text"]

    conversation_history.append(f"Bot: {bot_response}")

    if len(conversation_history) > 20:
        conversation_history = conversation_history[-20:]

    return bot_response