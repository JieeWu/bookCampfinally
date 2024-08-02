
class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;

  }
  

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();
    
    if (lowerCaseMessage.includes("你")) {
        this.actionProvider.greet();
        return;
    }
    
    const shippingRegex = /運費/;
    if (shippingRegex.test(lowerCaseMessage)) {
        this.actionProvider.shippingCost();
        return;
    }

    const  a = /推薦/;
    if (a.test(lowerCaseMessage)) {
        this.actionProvider.b();
        return;
    }









    return this.actionProvider.handleOptions({ withAvatar: true });
}

}
export default MessageParser;