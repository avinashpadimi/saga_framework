import { LoggerTypes } from "./../../logger/enums/LoggerTypes";
import { allowedMessageBrokers } from "../../broker/BaseBrokerConfigOptions";

export class InvalidLoggerTypeError extends Error {
  name = "InvalidLoggerTypeError";

  constructor(type: string) {
    super();
    Object.setPrototypeOf(this, InvalidLoggerTypeError.prototype);
    this.message = `Invalid Logger Type ${type}. Please use any of the following logger types : ${LoggerTypes.CONSOLE}--${LoggerTypes.FILE}--${LoggerTypes.CUSTOMLOGGER}`;
  }
}
