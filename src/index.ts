import { Configuration } from "./config/Configuration";

export default async function loadConfiguration(filePath: string) {
  const configuration:
    | Configuration
    | Error = await Configuration.loadConfiguration(filePath);

  if (configuration instanceof Error) {
    console.log("---configurations instance is", configuration);
  }
  return configuration;
}

loadConfiguration("/Users/avinash.padimi/workspace/saga_framework/config.json");
