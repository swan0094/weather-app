/* eslint-disable @typescript-eslint/no-explicit-any */
class MessageParser {
  actionProvider: any;
  constructor(actionProvider: any) {
    this.actionProvider = actionProvider;
  }

  async parse(message: string) {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (data.response) {
        this.actionProvider.handleBotResponse(data.response);
      } else {
        this.actionProvider.handleDefault();
      }
    } catch (error) {
      console.error("Error communicating with the chatbot API:", error);
      this.actionProvider.handleDefault();
    }
  }
}

export default MessageParser;
