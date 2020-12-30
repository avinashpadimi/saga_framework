export class BrokerDisconnectedError extends Error {
  name = "BrokerDisconnectedError";

  constructor() {
    super();
    Object.setPrototypeOf(this, BrokerDisconnectedError.prototype);
    this.message = `Broker got disconnected from PubSub Server.`;
  }
}
