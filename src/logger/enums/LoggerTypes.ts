export enum LoggerTypes {
  CONSOLE = "CONSOLE",
  FILE = "FILE",
  CUSTOMLOGGER = "CUSTOM",
}

export type LoggerType =
  | LoggerTypes.CONSOLE
  | LoggerTypes.CUSTOMLOGGER
  | LoggerTypes.FILE;
