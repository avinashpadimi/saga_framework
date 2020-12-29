import { timeStamp } from "console";
import { Configuration } from "./../../config/Configuration";
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
    this.subscribeBuiltInEvents();
  }

  // TODO
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
    await this.consumerInstance.subscribe({ topic });
  }

  msgHandler = async ({ topic, partition, message }) => {
    this.eventEmitter.emit(ConsumerEvents.MESSAGE_RECEIVED, {
      topic,
      message,
    });
  };

  run = async () => {
    console.log("started consumer");
    await this.consumerInstance.run({
      eachMessage: this.msgHandler,
    });
  };

  async start() {
    await this.connect();
  }

  subscribeEvent(eventName: ConsumerEvents, callback) {
    this.eventEmitter.on(eventName, callback);
  }

  subscribeBuiltInEvents() {
    this.consumerInstance.on("consumer.connect", this.onConnect);
    this.consumerInstance.on("consumer.disconnect", this.onDisconnect);
    this.consumerInstance.on("consumer.crash", this.onCrash);
    this.consumerInstance.on(
      "consumer.network.request_timeout",
      this.onRequestTimeout
    );
  }
  /* Why we need event handlers as arrow functions:

    https://www.freecodecamp.org/news/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb/

  */

  private onConnect = ({ id, type, timestamp }) => {
    this.eventEmitter.emit(ConsumerEvents.CONNECT, { timestamp });
  };

  private onDisconnect = ({ id, type, timestamp }) => {
    this.eventEmitter.emit(ConsumerEvents.DISCONNECT, { timestamp });
  };

  /*
  onRequestTimeout : 
  Payload structure :
   {  broker, 
      clientId, 
      correlationId, 
      createdAt, 
      sentAt, 
      pendingDuration, 
      apiName, 
      apiKey, 
      apiVersion}
  */

  private onRequestTimeout = ({ id, type, timestamp, payload }) => {
    this.eventEmitter.emit(ConsumerEvents.REQUEST_TIMEOUT, {
      payload,
      timestamp,
    });
  };

  /* 
    onCrash: 
    Payload Structure :
    error
    groupId,
    restart
    */

  private onCrash = ({ id, type, timestamp, payload }) => {
    this.eventEmitter.emit(ConsumerEvents.CRASH, { payload, timestamp });
  };
}
