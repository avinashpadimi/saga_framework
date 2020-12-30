import { LoggerOptions } from "./logger/LoggerOptions";
import { Configuration } from "./config/Configuration";
import { LoggerTypes } from "./logger/enums/LoggerTypes";
import { LogLevel } from "./logger/enums/LogLevel";

export * from "./payload/ProducerMessageStruct";
export * from "./AbstractSaga";
export { LoggerOptions } from "./logger/LoggerOptions";
export { LoggerTypes } from "./logger/enums/LoggerTypes";
export { LogLevel } from "./logger/enums/LogLevel";

export async function loadConfiguration(
  filePath: string,
  logOptions: LoggerOptions
) {
  const configuration:
    | Configuration
    | Error = await Configuration.loadConfiguration(filePath, logOptions);

  if (configuration instanceof Error) {
    Configuration.logger.info(
      `Error Configuration Information ${configuration}`
    );
  }
  Configuration.logger.debug(`Configuration Information ${configuration}`);
  Configuration.logger.debug("Configuration got created successfully");
  return configuration;
}

// async function sample() {
//   const logOptions: LoggerOptions = {
//     type: LoggerTypes.CONSOLE,
//     logLevel: LogLevel.DEBUG,
//   };
//   const configInstance: Configuration = await loadConfiguration(
//     "/Users/avinash.padimi/workspace/saga_framework/config.json",
//     logOptions
//   );
// }

// sample();
