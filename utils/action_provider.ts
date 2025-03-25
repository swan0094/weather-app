/* eslint-disable @typescript-eslint/no-explicit-any */

class ActionProvider {
  createChatBotMessage: any;
  setState: any;
  constructor(createChatBotMessage: any, setStateFunc: any) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleBotResponse = (response: string) => {
    const message = this.createChatBotMessage(response);
    this.setState((prev: { messages: any }) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleDefault = () => {
    const message = this.createChatBotMessage(
      "Sorry, I couldn't fetch the weather information."
    );
    this.setState((prev: { messages: any }) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };
}

export default ActionProvider;
