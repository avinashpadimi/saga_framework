import { EventEmitter } from "events";
import { LoggerType } from "./enums/LoggerTypes";
import { LoggerOptions } from "./LoggerOptions";
import { LoggerLevel, LogLevel } from "./enums/LogLevel";

export abstract class Logger {
  LOGGERCALLBACK = "LOGGERCALLBACK";
  WRITE = "WRITE";

  type: LoggerType;
  logLevel: LoggerLevel;
  logOptions: LoggerOptions;
  eventEmitter: EventEmitter;

  constructor(type: LoggerType, logOptions: LoggerOptions) {
    this.type = type;
    this.logOptions = logOptions;
    this.logLevel = logOptions.logLevel;
    this.registerEvents(logOptions);
  }

  warn(message: string) {
    this.log(LogLevel.WARN, message);
  }
  trace(message: string) {
    this.log(LogLevel.TRACE, message);
  }
  error(message: string) {
    this.log(LogLevel.ERROR, message);
  }
  info(message: string) {
    this.log(LogLevel.INFO, message);
  }
  debug(message: string) {
    this.log(LogLevel.DEBUG, message);
  }

  private registerEvents(logOptions) {
    if (logOptions.callbackHandler) {
      this.eventEmitter.on(this.LOGGERCALLBACK, logOptions.callbackHandler);
    }

    this.eventEmitter.on(this.WRITE, this.printOutput);
  }

  private triggerCallbackEvents(logLevel: LogLevel, msg: string) {
    this.eventEmitter.emit(this.WRITE, logLevel, msg);
    this.eventEmitter.emit(this.LOGGERCALLBACK, logLevel, msg);
  }

  abstract printOutput(logLevel: LogLevel, msg: string);

  private log(logLevel: LoggerLevel, message: string) {
    if (this.isValidLogLevel(logLevel)) return;
    const msg: string = this.formatLog(logLevel, message);
    this.triggerCallbackEvents(logLevel, msg);
  }

  private isValidLogLevel(logLevel: LoggerLevel): boolean {
    return logLevel !== this.logLevel;
  }

  formatLog(logLevel: LoggerLevel, message: string): string {
    return message;
  }
}
