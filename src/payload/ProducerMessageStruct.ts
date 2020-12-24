import { MessageStruct } from "./MessageStruct";

export interface ProducerMessageStruct {
  channel: string;
  message: MessageStruct;
  additionalParameters: AdditionalParameters;
}

interface AdditionalParameters {
  key?: string;
  timeout?: number;
  acks?: number;
  headers: object;
}
