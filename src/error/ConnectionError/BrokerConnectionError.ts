export class BrokerConnectionError extends Error {
  name = "BrokerConnectionError";

  constructor(error) {
    super();
    Object.setPrototypeOf(this, BrokerConnectionError.prototype);
    this.message = error.message;
  }
}
