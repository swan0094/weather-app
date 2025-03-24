/* eslint-disable @typescript-eslint/no-explicit-any */
import nlp from "compromise";

class MessageParser {
  actionProvider: any;
  context: any;
  constructor(actionProvider: any) {
    this.actionProvider = actionProvider;
    this.context = {};
  }

  parse(message: string) {
    const doc = nlp(message.toLowerCase());

    const weatherTerms = [
      "weather",
      "forecast",
      "temperature",
      "rain",
      "sun",
      "cloud",
      "snow",
      "wind",
    ];
    const timeTerms = [
      "today",
      "tomorrow",
      "week",
      "days",
      "day",
      "hours",
      "hour",
      "now",
      "current",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const greetingTerms = [
      "hello",
      "hi",
      "hey",
      "greetings",
      "good morning",
      "good afternoon",
      "good evening",
    ];
    const howAreYouTerms = [
      "how are you",
      "how's it going",
      "how do you do",
      "how are you doing",
      "how's everything",
    ];

    const location = doc.places().out("text");
    const time = doc.match(timeTerms.join("|")).out("text");
    const daysMatch = doc.match("[0-9]+ days").out("text");
    const days = daysMatch ? parseInt(daysMatch.split(" ")[0], 10) : null;

    console.log("Parsed location:", location);
    console.log("Parsed time:", time);
    console.log("Parsed days:", days);

    if (greetingTerms.some((term) => doc.has(term))) {
      this.actionProvider.handleGreeting();
    } else if (howAreYouTerms.some((term) => doc.has(term))) {
      this.actionProvider.handleHowAreYou();
    } else if (weatherTerms.some((term) => doc.has(term))) {
      if (location) {
        this.context.location = location;
        if (time === "today") {
          console.log("Today");
          this.actionProvider.handleWeather(location, 1);
        } else if (time === "tomorrow") {
          console.log("Tomorrow");
          this.actionProvider.handleWeather(location, 2);
        } else if (time === "week") {
          console.log("Week");
          this.actionProvider.handleWeather(location, 7);
        } else if (days) {
          console.log("Days");
          this.actionProvider.handleWeather(location, days);
        } else {
          console.log("Default");
          this.actionProvider.handleWeather(location, 1);
        }
      } else {
        this.context.weatherQuery = true;
        this.actionProvider.handleAskLocation();
      }
    } else if (this.context.weatherQuery && location) {
      this.context.weatherQuery = false;
      this.actionProvider.handleWeather(location, 1);
    } else {
      this.actionProvider.handleDefault();
    }
  }
}

export default MessageParser;
