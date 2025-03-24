import { createChatBotMessage } from "react-chatbot-kit";

const botName = "WeatherBot";

const config = {
  botName: botName,
  initialMessages: [
    createChatBotMessage(`Hi! I'm ${botName}. How can I help you today?`, {}),
  ],
};

export default config;
