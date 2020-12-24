import { ConsumerEvents } from "./../broker/events/ConsumerEvents";
import { Configuration } from "../config/Configuration";
import { BrokerInstance } from "../broker/types/BrokerTypes";
import { EventEmitter } from "events";
import { MessageStruct } from "../payload/MessageStruct";

export class Consumer {
  static instance: Consumer;
  eventEmitter: EventEmitter;

  private constructor() {
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

  messageReceived(channel: string, message: MessageStruct) {
    this.eventEmitter.emit(ConsumerEvents.MESSAGE_RECEIVED, channel, message);
  }

  subscribe(eventName: string, callback) {
    this.eventEmitter.on(eventName, callback);
  }
}
