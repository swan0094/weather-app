/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatWeatherResponse } from "@/utils/format_weather_response";

class ActionProvider {
  createChatBotMessage: any;
  setState: any;
  constructor(createChatBotMessage: any, setStateFunc: any) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleWeather = async (locationName: string, days: number) => {
    try {
      // Fetch coordinates
      const coordinatesResponse = await fetch(
        `http://127.0.0.1:8080/api/get-coordinates?location=${locationName}`
      );
      const coordinates = await coordinatesResponse.json();

      if (coordinates.error) {
        const errorMessage = this.createChatBotMessage(coordinates.error);
        this.setState((prev: { messages: any }) => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
        }));
        return;
      }

      const { latitude, longitude } = coordinates;
      let currentWeather = null;
      let forecast = null;

      if (days === 1) {
        // Fetch current weather
        const currentWeatherResponse = await fetch(
          `http://127.0.0.1:8080/api/get-current-weather?latitude=${latitude}&longitude=${longitude}`
        );
        currentWeather = await currentWeatherResponse.json();
      } else {
        // Fetch forecast
        const forecastResponse = await fetch(
          `http://127.0.0.1:8080/api/get-forecast?latitude=${latitude}&longitude=${longitude}&days=${days}`
        );
        forecast = await forecastResponse.json();
      }

      if (currentWeather?.error || forecast?.error) {
        const errorMessage = this.createChatBotMessage(
          currentWeather?.error || forecast?.error
        );
        this.setState((prev: { messages: any }) => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
        }));
      } else {
        const message = this.createChatBotMessage(
          formatWeatherResponse(currentWeather, forecast, days)
        );
        this.setState((prev: { messages: any }) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = this.createChatBotMessage(
        "Sorry, I couldn't fetch the weather information."
      );
      this.setState((prev: { messages: any }) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    }
  };

  handleGreeting = () => {
    const message = this.createChatBotMessage("Hello! How can I assist you today?");
    this.setState((prev: { messages: any }) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleHowAreYou = () => {
    const message = this.createChatBotMessage("I'm just a bot, but I'm here to help you!");
    this.setState((prev: { messages: any }) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleAskLocation = () => {
    const message = this.createChatBotMessage(
      "Where would you like to see the weather?"
    );
    this.setState((prev: { messages: any }) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleDefault = () => {
    const message = this.createChatBotMessage(
      "I'm not sure how to help with that."
    );
    this.setState((prev: { messages: any }) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };
}

export default ActionProvider;