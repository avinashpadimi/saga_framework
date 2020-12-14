import { KafkaBrokerConfigOptions } from "./KafkaBrokerConfigOptions";
import { Kafka, Producer as KafkaProducer, Message } from "kafkajs";

export class Producer {
  kafkaInstance: Kafka;
  brokerOptions: KafkaBrokerConfigOptions;
  producerInstance: KafkaProducer;
  constructor(kafkaInstance: Kafka, brokerOptions: KafkaBrokerConfigOptions) {
    this.brokerOptions = brokerOptions;
    this.producerInstance = kafkaInstance.producer();
  }

  async connect() {
    await this.producerInstance.connect();
  }

  async disconnect() {
    await this.producerInstance.disconnect();
  }

  async send(channel: string, payload: Message) {
    await this.producerInstance.send({
      topic: channel,
      messages: [payload],
    });
  }
}
