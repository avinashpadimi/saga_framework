export interface SagaMetadata {
  // Name of the service where the saga got initiated.
  source: string;

  // UID of the saga transaction.
  uid: string;

  // Correlation id of the request
  correlationId: string;

  // headers informations which are required in other services.
  requestHeaders: object;
}
