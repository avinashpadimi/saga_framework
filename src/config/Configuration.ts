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
      await Configuration.instance.initializeComponents(logOptions);
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
    this.configurationOptions.loggerConfig = logOptions;
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

  loggerConfig(): LoggerOptions {
    return this.configurationOptions.loggerConfig;
  }

  private async initializeComponents(logOptions: LoggerOptions) {
    this.initializeLogger(logOptions);
    this.initializeBroker();
    await this.startBrokerComponents();
  }
  private initializeBroker() {
    this.broker = BrokerFactory.create(this.brokerConfig().brokerType, this);
    this.broker.initializeBrokerComponents();
  }

  private initializeLogger(logOptions: LoggerOptions) {
    this.logger = LoggerFactory.create(logOptions.type, logOptions);
  }

  private async startBrokerComponents() {
    this.broker.startBrokerComponents();
  }
}
