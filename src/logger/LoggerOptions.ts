import { LoggerType } from "./enums/LoggerTypes";
import { LoggerLevel } from "./enums/LogLevel";

export interface LoggerOptions {
  type: LoggerType;
  logLevel: LoggerLevel;
  filePath?: string;
  callbackHandler?: (logLevel, message) => void;
}
