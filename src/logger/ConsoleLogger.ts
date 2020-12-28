import { Logger } from "./AbstractLogger";
import { LoggerType } from "./enums/LoggerTypes";
import { LoggerOptions } from "./LoggerOptions";
import { LoggerLevel } from "./enums/LogLevel";
import { Logger as ExternalLogger } from "../utils/logger";

export class ConsoleLogger extends Logger {
  constructor(type: LoggerType, logOptions: LoggerOptions) {
    super(type, logOptions);
  }

  protected printOutput(
    instance: ConsoleLogger,
    logLevel: LoggerLevel,
    message: string
  ) {
    instance.extLogger.push(logLevel, message);
  }
}
