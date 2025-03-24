import React from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "@/utils/chatbot_config";
import MessageParser from "@/utils/message_parser";
import ActionProvider from "@/utils/action_provider";

const ChatbotComponent: React.FC = () => {
  return (
    <div className="chatbot">
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
};

export default ChatbotComponent;
