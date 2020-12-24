import { Logger } from "./AbstractLogger";
import { LoggerType } from "./enums/LoggerTypes";
import { LoggerOptions } from "./LoggerOptions";
import { LoggerLevel } from "./enums/LogLevel";

export class ConsoleLogger extends Logger {
  constructor(type: LoggerType, logOptions: LoggerOptions) {
    super(type, logOptions);
  }

  printOutput(logLevel: LoggerLevel, message: string) {
    console.log(message);
  }
}
