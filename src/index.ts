import { LoggerLevel, LogLevel } from "./logger/enums/LogLevel";
import { LoggerOptions } from "./logger/LoggerOptions";
import { ProducerTypes } from "./broker/types/ProducerTypes";
import { Configuration } from "./config/Configuration";
import { timeStamp } from "console";
import { ConsumerTypes } from "./broker/types/ConsumerTypes";
import { Consumer } from "./consumer/Consumer";
import { Producer } from "./producer/Producer";
import { AbstractSaga } from "./AbstractSaga";
import { LoggerTypes } from "./logger/enums/LoggerTypes";

export default async function loadConfiguration(
  filePath: string,
  logOptions: LoggerOptions
) {
  const configuration:
    | Configuration
    | Error = await Configuration.loadConfiguration(filePath, logOptions);

  if (configuration instanceof Error) {
    console.log("---configurations instance is", configuration);
  }

  configuration.logger.debug("instance got crated");
  return configuration;
}

class MeetingType extends AbstractSaga {}

async function sample() {
  const logOptions: LoggerOptions = {
    type: LoggerTypes.CONSOLE,
    logLevel: LogLevel.DEBUG,
  };
  const configInstance: Configuration = await loadConfiguration(
    "/Users/avinash.padimi/workspace/saga_framework/config.json",
    logOptions
  );
}

sample();
