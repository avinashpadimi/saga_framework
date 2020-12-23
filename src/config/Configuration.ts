import { LoggerOptions } from "./../logger/LoggerOptions";
import {
  LoggerFactory,
  LoggerInstance as Logger,
} from "./../logger/LoggerFactory";
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
  logger: Logger;

  static async loadConfiguration(
    filePath: string,
    logOptions: LoggerOptions
  ): Promise<Configuration> {
    if (filePath === undefined) {
      throw new InvalidConfigurationUrlError(filePath);
    }

    const options: ConfigurationOptions = await ConfigurationParser.read(
      filePath
    );

    if (!options) throw new InvalidFileExtensionError(filePath);

    try {
      Configuration.instance = new Configuration(options, logOptions);
      await Configuration.instance.startBrokerComponents();
      return Configuration.instance;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  private constructor(
    configurationOptions: ConfigurationOptions,
    logOptions: LoggerOptions
  ) {
    this.configurationOptions = configurationOptions;
    this.initializeBroker();
    this.initializeLogger(logOptions);
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

  initializeLogger(logOptions: LoggerOptions) {
    this.logger = LoggerFactory.create(logOptions.type, logOptions);
  }
}
