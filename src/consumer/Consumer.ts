import { ConsumerEvents } from "./../broker/events/ConsumerEvents";
import { Configuration } from "../config/Configuration";
import { BrokerInstance } from "../broker/types/BrokerTypes";
import { EventEmitter } from "events";
import { MessageStruct } from "../payload/MessageStruct";

export class Consumer {
  static instance: Consumer;
  eventEmitter: EventEmitter;

  private constructor() {
    this.eventEmitter = new EventEmitter();
    this.initializeEvents();
  }

  static getInstance() {
    if (!Consumer.instance) {
      Consumer.instance = new Consumer();
    }
    return Consumer.instance;
  }

  getConfiguration(): Configuration {
    return Configuration.getInstance();
  }

  getBroker(): BrokerInstance {
    return this.getConfiguration().broker;
  }

  initializeEvents() {
    this.getBroker().subscribeBroker(
      ConsumerEvents.MESSAGE_RECEIVED,
      this.messageReceived
    );
  }

  messageReceived = async (channel: string, message: MessageStruct) => {
    this.eventEmitter.emit(message.sagaName, channel, message);
  };

  subscribe(eventName: string, callback) {
    this.eventEmitter.on(eventName, callback);
  }
}
