import { Logger } from "./AbstractLogger";
import { LoggerType } from "./enums/LoggerTypes";
import { LoggerOptions } from "./LoggerOptions";
import { LoggerLevel } from "./enums/LogLevel";
export class FileLogger extends Logger {
  constructor(type: LoggerType, logOptions: LoggerOptions) {
    super(type, logOptions);
  }

  protected printOutput(
    instance: FileLogger,
    logLevel: LoggerLevel,
    message: string
  ) {
    this.extLogger.push(logLevel, message);
  }
}
