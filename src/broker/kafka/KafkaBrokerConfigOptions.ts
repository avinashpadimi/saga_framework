import {
  BaseBrokerConfigOptions,
  allowedMessageBrokers,
} from "../BaseBrokerConfigOptions";

export interface KafkaBrokerConfigOptions extends BaseBrokerConfigOptions {
  brokerType: allowedMessageBrokers.KAFKA;
}
