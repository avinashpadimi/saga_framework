import { Logger } from "./AbstractLogger";
import { LoggerType } from "./enums/LoggerTypes";
import { LoggerOptions } from "./LoggerOptions";
import { LoggerLevel } from "./enums/LogLevel";

export class FileLogger extends Logger {
  filePath: string;

  constructor(type: LoggerType, logOptions: LoggerOptions) {
    super(type, logOptions);
    this.filePath = logOptions.filePath;
  }

  printOutput(logLevel: LoggerLevel, message: string) {}
}
