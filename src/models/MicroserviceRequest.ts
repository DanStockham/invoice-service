export interface MicroserviceRequest<T> extends Express.Request {
  body: T
}