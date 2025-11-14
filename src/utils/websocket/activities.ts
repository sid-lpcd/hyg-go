import { createWebSocketConnection, WebSocketManager } from './factory';
import { Activity } from '../../types/common/activity';

export const createActivitiesWebSocket = (
  onActivitiesReceived: (activities: Activity[], hasMore: boolean) => void,
  onError: (error: string) => void,
  onLoadingChange: (loading: boolean) => void
): WebSocketManager => {
  return createWebSocketConnection({
    onMessage: (event: MessageEvent) => {
      try {
        const response: ResponseMessage = JSON.parse(event.data);
        console.log('Activities WebSocket message received:', response);

        switch (response.type) {
          case 'batchComplete':
            const batchCompleteData = response.data as BatchCompleteData;
            onActivitiesReceived([], batchCompleteData.hasMoreBatches);
            onLoadingChange(false);
            break;
            
          case 'activitiesBatch':
            const batchData = response.data as ActivitiesBatchData;
            onActivitiesReceived(batchData.activities);
            break;
            
          case 'activity':
            const activityData = response.data as Activity;
            onActivitiesReceived([activityData], true);
            break;
            
          case 'error':
            const errorData = response.data as ErrorData;
            onError(errorData.error);
            onLoadingChange(false);
            break;
            
          default:
            console.warn('Unknown message type received:', response.type);
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        onError('Failed to parse server response');
        onLoadingChange(false);
      }
    },
    onError: (error) => {
      console.error('Activities WebSocket error:', error);
      onError('Connection error occurred');
      onLoadingChange(false);
    },
    onClose: (event) => {
      console.log('Activities WebSocket closed:', event.code, event.reason);
      onLoadingChange(false);
    },
    onOpen: () => {
      console.log('Activities WebSocket connected');
    },
    autoReconnect: true,
    maxReconnectAttempts: 3,
    reconnectDelay: 2000,
  });
};