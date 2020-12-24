import { BrokerInstance } from "../broker/types/BrokerTypes";
import { ProducerMessageStruct } from "../payload/producerMessageStruct";
import { Configuration } from "./../config/Configuration";

export class Producer {
  static instance: any;

  private constructor() {}

  static getInstance() {
    if (!Producer.instance) {
      Producer.instance = new Producer();
    }
    return Producer.instance;
  }

  getConfiguration(): Configuration {
    return Configuration.getInstance();
  }

  getBroker(): BrokerInstance {
    return this.getConfiguration().broker;
  }

  // Define the type of object we send (more detailed).
  publish(options: ProducerMessageStruct) {
    this.getBroker().sendMessage(options);
  }
}
