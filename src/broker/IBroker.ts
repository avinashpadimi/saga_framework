import { ProducerMessageStruct } from "../payload/producerMessageStruct";
import { ConsumerTypes as Consumer } from "./types/ConsumerTypes";
import { ProducerTypes as Producer } from "./types/ProducerTypes";

export interface IBroker {
  initializeBrokerComponents(): void;
  initializeProducer(): void;
  getProducer(): Producer;
  sendMessage(options: ProducerMessageStruct): Promise<void>;
}
