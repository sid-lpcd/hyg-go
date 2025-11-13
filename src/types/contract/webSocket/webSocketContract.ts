import { Activity } from "../../common/activity";

// Incoming message from client
export interface ActivitiesMessage {
  action: string;
  locationId: number;
  offset?: number;
  limit?: number;
  filter?: any;
}

// Base WebSocket message structure
export interface WebSocketMessage<T = any> {
  type: string;
  statusCode: number;
  data?: T;
}

export interface BatchCompleteData {
  locationId: number;
  batchNumber: number;
  totalProcessed: number;
  hasMoreBatches: boolean;
}

export interface ActivitiesBatchData {
  locationId: number;
  activities: Activity[];
  count: number;
}

export interface ErrorData {
  error: string;
}

// Typed message types for outgoing messages
export type BatchCompleteMessage = WebSocketMessage<BatchCompleteData>;
export type ActivitiesBatchMessage = WebSocketMessage<ActivitiesBatchData>;
export type ActivityMessage = WebSocketMessage<Activity>;
export type ErrorMessage = WebSocketMessage<ErrorData>;
export type ResponseMessage = WebSocketMessage<any>;