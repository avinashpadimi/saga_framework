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
} from "kafkajs";
import { IBroker } from "../IBroker";
import { EventEmitter } from "events";

export class KafkaBroker implements IBroker {
  static MESSAGE_RECEIVED = "MESSAGE_RECEIVED";

  kafkaInstance: Kafka;
  brokerOptions: KafkaBrokerConfigOptions;
  configuration: Configuration;
  eventEmitter: EventEmitter;

  private producer: Producer;
  private consumer: Consumer;

  constructor(configuration: Configuration) {
    this.brokerOptions = configuration.brokerConfig() as KafkaBrokerConfigOptions;
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

  initializeProducer(): void {
    this.producer = new Producer(this.kafkaInstance, this.brokerOptions);
  }

  initializeConsumer(): void {
    this.consumer = new Consumer(this.kafkaInstance, this.brokerOptions);
  }

  getProducer(): Producer {
    return this.producer;
  }

  initializeBrokerComponents(): void {
    this.initializeProducer();
    this.initializeConsumer();
    this.initializeEvents();
  }

  async startBrokerComponents() {
    await this.producer.start();
    await this.consumer.start();
  }

  async sendMessage(options: ProducerMessageStruct): Promise<void> {
    const params: ProducerOptions = {
      topic: options.channel,
      acks: options.additionalParameters.acks,
      timeout: options.additionalParameters.timeout,
      messages: [],
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

  initializeEvents() {
    this.subscribeConsumer(
      ConsumerEvents.MESSAGE_RECEIVED,
      this.messageReceived
    );
  }

  private subscribeConsumer(eventName: string, callback) {
    this.consumer.subscribeEvent(eventName, callback);
  }

  messageReceived(topic, message) {
    this.eventEmitter.emit(
      ConsumerEvents.MESSAGE_RECEIVED,
      topic,
      JSON.parse(message)
    );
  }

  subscribeBroker(eventName: string, callback) {
    this.eventEmitter.on(eventName, callback);
  }
}
