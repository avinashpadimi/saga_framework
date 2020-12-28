import { EventEmitter } from "events";
import { LoggerType } from "./enums/LoggerTypes";
import { LoggerOptions } from "./LoggerOptions";
import { LoggerLevel, LogLevel } from "./enums/LogLevel";
import { Logger as ExternalLogger } from "../utils/logger";

export abstract class Logger {
  protected LOGGERCALLBACK = "LOGGERCALLBACK";
  protected WRITE = "WRITE";

  type: LoggerType;
  private logOptions: LoggerOptions;
  private eventEmitter: EventEmitter;
  protected extLogger: ExternalLogger;

  constructor(type: LoggerType, logOptions: LoggerOptions) {
    this.type = type;
    this.logOptions = logOptions;
    this.eventEmitter = new EventEmitter();
    this.initializeLoggerComponent();
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

  private triggerCallbackEvents(
    instance: Logger,
    logLevel: LogLevel,
    msg: string
  ) {
    this.eventEmitter.emit(this.WRITE, instance, logLevel, msg);
    this.eventEmitter.emit(this.LOGGERCALLBACK, instance, logLevel, msg);
  }

  protected abstract printOutput(
    instance: Logger,
    logLevel: LogLevel,
    msg: string
  ): void;

  private log(logLevel: LoggerLevel, message: string) {
    const msg: string = this.formatLog(logLevel, message);
    this.triggerCallbackEvents(this, logLevel, msg);
  }

  protected formatLog(logLevel: LoggerLevel, message: string): string {
    return message;
  }

  private initializeLoggerComponent() {
    this.extLogger = ExternalLogger.getInstance(this.logOptions);
  }
}
