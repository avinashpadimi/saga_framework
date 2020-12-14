import { Producer } from "./producer";
import { ConfigurationOptions } from "./../../config/ConfigurationOptions";
import { Configuration } from "./../../config/Configuration";
import { KafkaBrokerConfigOptions } from "./KafkaBrokerConfigOptions";
import { Kafka, logLevel, CompressionTypes, KafkaConfig } from "kafkajs";

export class KafkaBroker {
  kafkaInstance: Kafka;
  brokerOptions: KafkaBrokerConfigOptions;
  configuration: Configuration;
  producer: Producer;

  constructor(configuration: Configuration) {
    this.brokerOptions = configuration.brokerConfig();
    this.configuration = configuration;
    this.kafkaInstance = new Kafka(this.fetchConfigOptions());
  }

  fetchConfigOptions(): KafkaConfig {
    const configOptions: KafkaConfig = {
      brokers: this.brokerOptions.brokerAddresses,
      clientId: this.configuration.clientId(),
    };
    return configOptions;
  }

  initializeProducer() {
    this.producer = new Producer(this.kafkaInstance, this.brokerOptions);
  }

  getProducer(): Producer {
    return this.producer;
  }
}
