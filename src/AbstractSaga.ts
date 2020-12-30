import { EventEmitter } from "events";
import { Producer } from "./producer/Producer";
import { Consumer } from "./consumer/Consumer";
import { ProducerMessageStruct } from "./payload/producerMessageStruct";
import { MessageStruct } from "./payload/MessageStruct";

// There should be a dedicated class for each saga.
// Name of the saga should be unique (Will append uuid to sagaName)

export abstract class AbstractSaga {
  producer: Producer;
  consumer: Consumer;
  sagaName: string;
  eventEmitter: EventEmitter;

  constructor(sagaName: string) {
    this.producer = Producer.getInstance();
    this.consumer = Consumer.getInstance();
    this.sagaName = sagaName;
    this.eventEmitter = new EventEmitter();
  }

  async publishMessage(options: ProducerMessageStruct) {
    this.producer.publish(options);
  }

  registerSaga() {
    this.consumer.subscribe(this.sagaName, this.messageReceived);
  }

  messageReceived = async (channel: string, info: MessageStruct) => {
    this.eventEmitter.emit(info.eventType, channel, info);
  };
}
