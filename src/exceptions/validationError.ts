export default class ValidationError {
  messages: Record<string, string>;

  constructor(messages: Record<string, string>) {
    this.messages = messages;
  }
}
