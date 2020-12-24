import { SagaMetadata } from "./SagaMetadata";

export interface MessageStruct {
  // Name of the saga in which we are participating, it should be unique.
  sagaName: string;

  // Type of the event this service should handle
  eventType: string;

  // Information about the saga
  metadata: SagaMetadata;

  // Actual message information.
  message: object;
}
