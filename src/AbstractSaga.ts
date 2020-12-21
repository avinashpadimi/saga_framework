import { EventEmitter } from "events";
import { Producer } from "./producer/Producer";
import { Consumer } from "./consumer/Consumer";
import { ProducerMessageStruct } from "./payload/producerMessageStruct";
import { MessageStruct } from "./payload/MessageStruct";

export abstract class AbstractSaga {
  producer: Producer;
  consumer: Consumer;
  sagaName: string;
  eventEmitter: EventEmitter;

  constructor(sagaName: string) {
    this.producer = Producer.getInstance();
    this.consumer = Consumer.getInstance();
    this.sagaName = sagaName;
  }

  publishMessage(options: ProducerMessageStruct) {
    this.producer.publish(options);
  }

  registerSaga() {
    this.consumer.subscribe(this.sagaName, this.messageReceived);
  }

  messageReceived(channel: string, message: MessageStruct) {
    this.eventEmitter.emit(message.eventType, channel, message);
  }
}
