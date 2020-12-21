import { BrokerInstance } from "../broker/types/BrokerTypes";
import { BrokerFactory } from "./../broker/brokerFactory";
import { BaseBrokerConfigOptions } from "./../broker/BaseBrokerConfigOptions";
import { InvalidFileExtensionError } from "./../error/ConfigurationError/InvalidFileExtensionError";
import { InvalidConfigurationUrlError } from "../error/ConfigurationError/InvalidConfigurationUrlError";
import { ConfigurationParser } from "./ConfigurationParser";
import { ConfigurationOptions } from "./ConfigurationOptions";
import { MissingLoadConfiguration } from "../error/ConfigurationError/missingLoadConfiguration";
import { timeStamp } from "console";

export class Configuration {
  static instance: Configuration;

  configurationOptions: ConfigurationOptions;
  broker: BrokerInstance;

  static async loadConfiguration(filePath: string): Promise<Configuration> {
    if (filePath === undefined) {
      throw new InvalidConfigurationUrlError(filePath);
    }

    const options: ConfigurationOptions = await ConfigurationParser.read(
      filePath
    );

    if (!options) throw new InvalidFileExtensionError(filePath);

    try {
      Configuration.instance = new Configuration(options);
      await Configuration.instance.startBrokerComponents();
      return Configuration.instance;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  private constructor(configurationOptions: ConfigurationOptions) {
    this.configurationOptions = configurationOptions;
    this.initializeBroker();
    //initialise Logger
    return this;
  }

  static getInstance(): Configuration {
    if (!Configuration.instance) {
      throw new MissingLoadConfiguration();
    }
    return Configuration.instance;
  }

  clientId(): string {
    return this.configurationOptions.clientId;
  }

  brokerConfig(): BaseBrokerConfigOptions {
    return this.configurationOptions.brokerConfig;
  }

  initializeBroker() {
    this.broker = BrokerFactory.create(this.brokerConfig().brokerType, this);
    this.broker.initializeBrokerComponents();
  }

  async startBrokerComponents() {
    this.broker.startBrokerComponents();
  }
}
