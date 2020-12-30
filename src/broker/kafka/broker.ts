import { ConsumerEvents } from "./../events/ConsumerEvents";
import { ProducerOptions } from "./parameterOptions/ProducerOptions";
import { ProducerMessageStruct } from "../../payload/producerMessageStruct";
import { Consumer } from "./Consumer";
import { Producer } from "./producer";
import { Configuration } from "./../../config/Configuration";
import { KafkaBrokerConfigOptions } from "./KafkaBrokerConfigOptions";
import {
  Kafka,
  KafkaConfig,
  Message,
  CompressionTypes,
  IHeaders,
  logLevel,
} from "kafkajs";
import { IBroker } from "../IBroker";
import { EventEmitter } from "events";
import { BrokerConnectionError } from "../../error/ConnectionError/BrokerConnectionError";
import { BrokerDisconnectedError } from "../../error/ConnectionError/BrokerDisconnectedError";

export class KafkaBroker implements IBroker {
  kafkaInstance: Kafka;
  brokerOptions: KafkaBrokerConfigOptions;
  configuration: Configuration;
  eventEmitter: EventEmitter;
  brokerAlive: boolean;
  errorPayload: any;

  private producer: Producer;
  private consumer: Consumer;

  constructor(configuration: Configuration) {
    this.brokerOptions = configuration.brokerConfig() as KafkaBrokerConfigOptions;
    this.configuration = configuration;
    this.eventEmitter = new EventEmitter();
    this.kafkaInstance = new Kafka(this.fetchConfigOptions());
  }

  getProducer(): Producer {
    return this.producer;
  }

  getConsumer(): Consumer {
    return this.consumer;
  }

  initializeBrokerComponents(): void {
    this.initializeProducer();
    this.initializeConsumer();
  }

  async startBrokerComponents(channels) {
    await this.producer.start();
    await this.consumer.start();
    await this.subscribeChannels(channels);
    await this.consumer.run();
    await this.initializeEvents();
    this.brokerAlive = true;
  }

  async sendMessage(options: ProducerMessageStruct): Promise<void> {
    if (!this.alive()) {
      throw new BrokerConnectionError(this.errorPayload.error);
    }
    const params: ProducerOptions = {
      topic: options.channel,
      acks: options.additionalParameters.acks,
      timeout: options.additionalParameters.timeout,
      messages: [],
      compression: CompressionTypes.GZIP,
    };

    params.messages = [
      {
        key: options.additionalParameters.key,
        value: JSON.stringify(options.message),
        headers: options.additionalParameters.headers as IHeaders,
      },
    ];
    await this.producer.send(params);
  }

  subscribeBroker(eventName: string, callback) {
    this.eventEmitter.on(eventName, callback);
  }

  alive(): boolean {
    return this.brokerAlive;
  }

  /*
    Private Methods
  */

  private async subscribeChannels(channels: []) {
    channels.map(async (channel) => await this.consumer.subscribe(channel));
  }

  private fetchConfigOptions(): KafkaConfig {
    const configOptions: KafkaConfig = {
      brokers: this.brokerOptions.brokerAddresses,
      clientId: this.configuration.clientId(),
      logLevel: logLevel.ERROR,
      retry: {
        initialRetryTime: this.brokerOptions.initialRetryTime || 300,
        retries: this.brokerOptions.noOfRetries || 3,
        multiplier: this.brokerOptions.multiplier || 2,
        maxRetryTime: this.brokerOptions.maxRetryTime || 10000,
      },
    };
    return configOptions;
  }

  private initializeProducer(): void {
    Configuration.logger.info("Initializing Producer Components");
    this.producer = new Producer(this.kafkaInstance, this.brokerOptions);
  }

  private initializeConsumer(): void {
    this.consumer = new Consumer(this.kafkaInstance, this.brokerOptions);
  }

  private initializeEvents() {
    this.builtInEvents();
    this.customEvents();
  }

  private subscribeConsumer(eventName: ConsumerEvents, callback) {
    this.consumer.subscribeEvent(eventName, callback);
  }

  private customEvents() {
    this.subscribeConsumer(
      ConsumerEvents.MESSAGE_RECEIVED,
      this.messageReceived
    );
  }

  private builtInEvents() {
    this.subscribeConsumer(ConsumerEvents.CONNECT, this.onConsumerConnect);
    this.subscribeConsumer(
      ConsumerEvents.DISCONNECT,
      this.onConsumerDisconnect
    );
    this.subscribeConsumer(ConsumerEvents.CRASH, this.onCrash);
    this.subscribeConsumer(
      ConsumerEvents.REQUEST_TIMEOUT,
      this.onConsumerRequestTimeout
    );
  }

  private setBrokerStatus(status, error) {
    this.brokerAlive = status;
    this.errorPayload = error;
  }

  // Event Callbacks
  // WIP

  // Arrow Functions
  /* Why we need event handlers as arrow functions:

    https://www.freecodecamp.org/news/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb/

  */

  messageReceived = async ({ topic, message }) => {
    this.eventEmitter.emit(
      ConsumerEvents.MESSAGE_RECEIVED,
      topic,
      JSON.parse(message.value)
    );
  };

  onConsumerConnect = ({}) => {
    this.setBrokerStatus(true, null);
    this.eventEmitter.emit(ConsumerEvents.CONNECT, {});
  };
  onConsumerDisconnect = ({}) => {
    this.setBrokerStatus(false, new BrokerDisconnectedError());
    this.eventEmitter.emit(ConsumerEvents.DISCONNECT, {});
  };
  onConsumerRequestTimeout = ({ timestamp, payload }) => {
    this.eventEmitter.emit(ConsumerEvents.REQUEST_TIMEOUT, {
      payload,
      timestamp,
    });
  };

  onCrash = ({ timestamp, payload }) => {
    this.setBrokerStatus(false, payload);
    this.eventEmitter.emit(ConsumerEvents.CRASH, { payload, timestamp });
  };

  onProducerConnect = ({}) => {};
  onProducerDisconnect = ({}) => {};
  onProducerRequestTimeout = ({}) => {};
}
