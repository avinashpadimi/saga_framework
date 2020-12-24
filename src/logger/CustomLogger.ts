import { Logger } from "./AbstractLogger";
import { LoggerType } from "./enums/LoggerTypes";
import { LoggerOptions } from "./LoggerOptions";
import { LoggerLevel } from "./enums/LogLevel";

export class CustomLogger extends Logger {
  filePath: string;

  constructor(type: LoggerType, logOptions: LoggerOptions) {
    super(type, logOptions);
  }

  printOutput(logLevel: LoggerLevel, message: string) {
    // We can do whatever we want
  }
}
