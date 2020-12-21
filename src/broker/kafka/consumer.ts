import { ConsumerEvents } from "./../events/ConsumerEvents";
import { KafkaBrokerConfigOptions } from "./KafkaBrokerConfigOptions";
import { Kafka, Consumer as KafkaConsumer, Message } from "kafkajs";
import { EventEmitter } from "events";

export class Consumer {
  kafkaInstance: Kafka;
  brokerOptions: KafkaBrokerConfigOptions;
  consumerInstance: KafkaConsumer;
  eventEmitter: EventEmitter;

  constructor(kafkaInstance: Kafka, brokerOptions: KafkaBrokerConfigOptions) {
    this.kafkaInstance = kafkaInstance;
    this.brokerOptions = brokerOptions;
    this.consumerInstance = kafkaInstance.consumer({
      groupId: brokerOptions.groupId,
    });
    this.eventEmitter = new EventEmitter();
  }

  async connect() {
    try {
      await this.consumerInstance.connect();
    } catch (error) {
      // In case we are not able to connect to server.
      // Emit an event
      this.eventEmitter.emit("CONSUMER_SERVER_CONNECT_FAILED", {
        instace: this,
        error,
      });
      process.exit();
    }
  }

  async subscribe(topic: string) {
    try {
      await this.consumerInstance.subscribe({ topic });
    } catch (error) {
      this.eventEmitter.emit("CONSUMER_SUBSCRIBE_CHANNEL_FAILED", {
        instance: this,
        error,
        topic,
      });
    }
  }

  async run() {
    await this.consumerInstance.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log("Message recieved", topic, message);
        this.eventEmitter.emit(ConsumerEvents.MESSAGE_RECEIVED, {
          topic,
          message,
        });
      },
    });
  }

  async start() {
    await this.connect();
    await this.run();
  }

  subscribeEvent(eventName: string, callback) {
    this.eventEmitter.on(ConsumerEvents.MESSAGE_RECEIVED, callback);
  }
}
