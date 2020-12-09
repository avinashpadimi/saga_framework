import { registerEnumType } from "type-graphql";

export enum allowedMessageBrokers {
  KAFKA = "kafka",
}

export interface BaseBrokerConfigOptions {
  // Broker Type
  brokerType: allowedMessageBrokers;

  // IP Addresses of the Pub Sub Servers (ex: Kafka, RabbitMQ etc...)
  brokerAddresses: string[];

  // Initial value used to calculate the retry in milliseconds (This is still randomized following the randomization factor)
  initialRetryTime?: number;

  // Max number of retries per call
  noOfRetries?: number;

  // Exponential factor (Which decides the retry interval)
  multiplier?: number;

  // Maximum wait time for a retry in milliseconds
  maxRetryTime?: number;

  // Time in milliseconds to wait for a successful connection.
  connectionTimeout?: number;
}
