import { Message, CompressionTypes } from "kafkajs";

export interface ProducerOptions {
  topic: string;
  messages: Message[];
  acks?: number;
  timeout: number;
  compression?: CompressionTypes;
}
