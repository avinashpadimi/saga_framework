import { BrokerInstance } from "./brokerTypes";
import { Configuration } from "../config/Configuration";
import { KafkaBroker } from "./kafka/broker";
import { allowedMessageBrokers } from "./BaseBrokerConfigOptions";
import { InvalidBrokerTypeError } from "../error/ConfigurationError/InvalidBrokerTypeError";

export class BrokerFactory {
  static create(type: string, configuration: Configuration): BrokerInstance {
    switch (type) {
      case allowedMessageBrokers.KAFKA:
        return new KafkaBroker(configuration);
      default:
        throw new InvalidBrokerTypeError();
    }
  }
}
