import { ConsoleLogger } from "./ConsoleLogger";
import { FileLogger } from "./FileLogger";
import { LoggerOptions } from "./LoggerOptions";
import { LoggerType, LoggerTypes } from "./enums/LoggerTypes";
import { InvalidLoggerTypeError } from "../error/ConfigurationError/InvalidLoggerTypeError";

export type LoggerInstance = FileLogger | ConsoleLogger;

export class LoggerFactory {
  static create(type: LoggerType, logOptions: LoggerOptions): LoggerInstance {
    switch (type) {
      case LoggerTypes.FILE:
        return new FileLogger(type, logOptions);
      case LoggerTypes.CONSOLE:
        return new ConsoleLogger(type, logOptions);
      case LoggerTypes.CUSTOMLOGGER:
        return;
      default:
        throw new InvalidLoggerTypeError(type);
    }
  }
}
