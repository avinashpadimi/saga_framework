import { ProducerTypes } from "./broker/types/ProducerTypes";
import { Configuration } from "./config/Configuration";
import { timeStamp } from "console";
import { ConsumerTypes } from "./broker/types/ConsumerTypes";
import { Consumer } from "./consumer/Consumer";
import { Producer } from "./producer/Producer";
import { AbstractSaga } from "./AbstractSaga";

export default async function loadConfiguration(filePath: string) {
  const configuration:
    | Configuration
    | Error = await Configuration.loadConfiguration(filePath);

  if (configuration instanceof Error) {
    console.log("---configurations instance is", configuration);
  }
  return configuration;
}

class MeetingType extends AbstractSaga {}

async function sample() {
  const configInstance: Configuration = await loadConfiguration(
    "/Users/avinash.padimi/workspace/saga_framework/config.json"
  );
}

sample();
