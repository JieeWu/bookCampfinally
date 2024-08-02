


class ActionProvider {
  constructor(createChatBotMessage, setStateFunc,createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }
  
  handleOptions = (options) => {
    const message = this.createChatBotMessage(
      "噢，看來我的電路有點混亂了。你能否用更清晰的方式再說一遍或輸入一遍呢？畢竟我在這裡就是為了幫助你！",
      {
        widget: "overview",
        loading: true,
        terminateLoading: true,
        ...options
      }
    );

    this.updateChatbotState(message);
  };

  
  greet() {
    const greetingMessage = this.createChatBotMessage("你好")
    this.updateChatbotState(greetingMessage)
  }
  shippingCost() {
    const shippingMessage = this.createChatBotMessage("我們書營運費是150元")
    this.updateChatbotState(shippingMessage);
}
b() {
  const c = this.createChatBotMessage("好的")
  this.updateChatbotState(c);
}
handleBookCamp() {
  const message = this.createChatBotMessage("書營是我們的特色活動，提供讀者一個沉浸在書籍世界中的經驗。");
  this.updateChatbotState(message);
}

handleBook() {
  const message = this.createChatBotMessage(
    "成為會員很簡單點選以下的'加入我們'",
    { widget: "LinkComponent" }
  );
  this.updateChatbotState(message);
}




  
updateChatbotState(message) {
  this.setState(prevState => ({
    ...prevState,
    messages: [...prevState.messages, message]
  }));
}
}


export default ActionProvider