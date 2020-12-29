import { MessageStruct } from "./../payload/MessageStruct";
import { ConsumerEvents } from "./events/ConsumerEvents";
import { ProducerMessageStruct } from "../payload/producerMessageStruct";
import { ConsumerTypes as Consumer } from "./types/ConsumerTypes";
import { ProducerTypes as Producer } from "./types/ProducerTypes";

export interface IBroker {
  // Should instantiate the core components of the Broker.
  initializeBrokerComponents(): void;

  // Should be able to return producer instance.
  getProducer(): Producer;

  getConsumer(): Consumer;

  // Method to push messages to Broker channels
  sendMessage(options: ProducerMessageStruct): Promise<void>;

  // Subscribe broker to get notification when message received.
  subscribeBroker(
    eventName: ConsumerEvents,
    listner: (channel: string, message: MessageStruct) => void
  ): void;

  // WIP
  onConsumerConnect: ({}) => void;
  onConsumerDisconnect: ({}) => void;
  onConsumerRequestTimeout: ({ timestamp, payload }) => void;
  onCrash: ({ timestamp, payload }) => void;

  onProducerConnect: ({}) => void;
  onProducerDisconnect: ({}) => void;
  onProducerRequestTimeout: ({ timestamp, payload }) => void;
}
