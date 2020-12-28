export enum LogLevel {
  WARN = "warn",
  INFO = "info",
  TRACE = "trace",
  ERROR = "error",
  DEBUG = "debug",
}

export type LoggerLevel =
  | LogLevel.WARN
  | LogLevel.TRACE
  | LogLevel.INFO
  | LogLevel.ERROR
  | LogLevel.DEBUG;
