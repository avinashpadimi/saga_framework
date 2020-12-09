import { InvalidFileExtensionError } from "./../error/ConfigurationError/InvalidFileExtensionError";
import { InvalidConfigurationUrlError } from "../error/ConfigurationError/InvalidConfigurationUrlError";
import { ConfigurationParser } from "./ConfigurationParser";
import { ConfigurationOptions } from "./ConfigurationOptions";
import { MissingLoadConfiguration } from "../error/ConfigurationError/missingLoadConfiguration";

export class Configuration {
  static instance: Configuration;

  configurationOptions: ConfigurationOptions;

  static async loadConfiguration(
    filePath: string
  ): Promise<Configuration | Error> {
    if (filePath === undefined) {
      return new InvalidConfigurationUrlError(filePath);
    }

    const options: ConfigurationOptions = await ConfigurationParser.read(
      filePath
    );

    if (!options) return new InvalidFileExtensionError(filePath);

    Configuration.instance = new Configuration(options);
    return Configuration.instance;
  }

  private constructor(configurationOptions: ConfigurationOptions) {
    this.configurationOptions = configurationOptions;
    //initialise Logger
    //initialize Message Broker
    return this;
  }

  static getInstance(): Configuration | MissingLoadConfiguration {
    if (!Configuration.instance) {
      return new MissingLoadConfiguration();
    }
    return Configuration.instance;
  }
}
