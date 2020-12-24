import { ProducerOptions } from "./parameterOptions/ProducerOptions";
import { KafkaBrokerConfigOptions } from "./KafkaBrokerConfigOptions";
import {
  Kafka,
  Producer as KafkaProducer,
  Message,
  ProducerRecord,
} from "kafkajs";
import { EventEmitter } from "events";

export class Producer {
  kafkaInstance: Kafka;
  brokerOptions: KafkaBrokerConfigOptions;
  producerInstance: KafkaProducer;
  eventEmitter: EventEmitter;
  constructor(kafkaInstance: Kafka, brokerOptions: KafkaBrokerConfigOptions) {
    this.kafkaInstance = kafkaInstance;
    this.brokerOptions = brokerOptions;
    this.eventEmitter = new EventEmitter();
    this.producerInstance = kafkaInstance.producer();
  }

  async connect() {
    try {
      await this.producerInstance.connect();
    } catch (error) {
      this.eventEmitter.emit("PRODUCER_SERVER_CONNECT_FAILED", {
        instace: this,
        error,
      });
      process.exit();
    }
  }

  async disconnect() {
    await this.producerInstance.disconnect();
  }

  async send(producerOptions: ProducerOptions) {
    await this.producerInstance.send(producerOptions);
  }

  async start() {
    await this.connect();
  }
}
