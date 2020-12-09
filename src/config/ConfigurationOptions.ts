import { BrokerConfigOptions } from "./../broker/BrokerConfigOptions";

export interface ConfigurationOptions {
  // Unique Id to indentify each application
  clientId: string;

  // Config required to connect to any broker
  brokerConfig: BrokerConfigOptions;

  // Channels to which this application can push messages
  publisherChannels: Object;

  // Channels to which this application can subscribe.
  subscriberChannels: Object;

  // Channels to which we push messages for retry.
  retryChannels: Object;

  // Channels to which we pushed failed messages for tracking.
  failureChannels: Object;

  // Logger Configuration
  loggerConfig: Object;
}
