export enum LogLevel {
  WARN = "WARN",
  INFO = "INFO",
  TRACE = "TRACE",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

export type LoggerLevel =
  | LogLevel.WARN
  | LogLevel.TRACE
  | LogLevel.INFO
  | LogLevel.ERROR
  | LogLevel.DEBUG;
