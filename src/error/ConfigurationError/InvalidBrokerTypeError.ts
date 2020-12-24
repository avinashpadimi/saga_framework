import { allowedMessageBrokers } from "../../broker/BaseBrokerConfigOptions";

export class InvalidBrokerTypeError extends Error {
  name = "InvalidBrokerTypeError";

  constructor() {
    super();
    Object.setPrototypeOf(this, InvalidBrokerTypeError.prototype);
    this.message = `Broker Type should be in this list : ${allowedMessageBrokers}`;
  }
}
