import { LoggerOptions } from "./../logger/LoggerOptions";
import { LoggerLevel, LogLevel } from "./../logger/enums/LogLevel";
import * as pino from "pino";
import * as fs from "fs";
import { LoggerTypes } from "../logger/enums/LoggerTypes";

export class Logger {
  static instance: Logger;
  private loggerInstance: pino.Logger;

  static getInstance(logOptions: LoggerOptions): Logger {
    if (Logger.instance) {
      return Logger.instance;
    }
    return new Logger(logOptions);
  }

  private constructor(logOptions: LoggerOptions) {
    this.initializePinoLogger(logOptions);
  }

  private initializePinoLogger(logOptions: LoggerOptions) {
    this.loggerInstance =
      logOptions.type === LoggerTypes.FILE
        ? this.fileLogger(logOptions)
        : this.consoleLogger(logOptions);
  }
  private consoleLogger(logOptions: {
    readonly logLevel: LoggerLevel;
  }): pino.Logger {
    return pino({ level: logOptions.logLevel, prettyPrint: true });
  }
  private fileLogger(logOptions): pino.Logger {
    return pino(
      { level: logOptions.logLevel, prettyPrint: true },
      fs.createWriteStream(logOptions.filePath)
    );
  }

  push(logLevel: LoggerLevel, message: string) {
    switch (logLevel) {
      case LogLevel.DEBUG:
        this.loggerInstance.debug(message);
      case LogLevel.ERROR:
        this.loggerInstance.error(message);
      case LogLevel.INFO:
        this.loggerInstance.info(message);
      case LogLevel.TRACE:
        this.loggerInstance.trace(message);
      case LogLevel.WARN:
        this.loggerInstance.warn(message);
    }
  }
}
