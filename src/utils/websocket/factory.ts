type WebSocketEventHandler = (event: MessageEvent) => void;
type WebSocketErrorHandler = (error: Event) => void;
type WebSocketCloseHandler = (event: CloseEvent) => void;
type WebSocketOpenHandler = () => void;

interface WebSocketConfig {
  onMessage: WebSocketEventHandler;
  onError?: WebSocketErrorHandler;
  onClose?: WebSocketCloseHandler;
  onOpen?: WebSocketOpenHandler;
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private isConnectingState = false;
  private shouldReconnect = true;

  constructor(url: string, config: WebSocketConfig) {
    this.url = url;
    this.config = {
      autoReconnect: true,
      maxReconnectAttempts: 3,
      reconnectDelay: 1000,
      ...config,
    };
  }

  connect(): Promise<WebSocket> {
    if (this.isConnectingState) {
      return Promise.reject(new Error('Already connecting'));
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return Promise.resolve(this.ws);
    }

    this.isConnectingState = true;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = (_event) => {
          this.isConnectingState = false;
          this.reconnectAttempts = 0;
          this.config.onOpen?.();
          resolve(this.ws!);
        };

        this.ws.onmessage = (event) => {
          this.config.onMessage(event);
        };

        this.ws.onclose = (event) => {
          this.isConnectingState = false;
          this.config.onClose?.(event);

          if (
            this.shouldReconnect &&
            this.config.autoReconnect &&
            this.reconnectAttempts < (this.config.maxReconnectAttempts || 3)
          ) {
            this.attemptReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnectingState = false;
          this.config.onError?.(error);
          reject(error);
        };

      } catch (error) {
        this.isConnectingState = false;
        reject(error);
      }
    });
  }

  private attemptReconnect(): void {
    this.reconnectAttempts++;
    console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }
    }, this.config.reconnectDelay);
  }

  send(data: string | object): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not connected. Cannot send message.');
      return false;
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.ws.send(message);
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }

  close(): void {
    this.shouldReconnect = false;
    if (this.ws) {
      this.ws.close(1000, 'Manual close');
      this.ws = null;
    }
  }

  getReadyState(): number | null {
    return this.ws?.readyState ?? null;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  isConnecting(): boolean {
    return this.isConnectingState;
  }
}

// Factory function for creating WebSocket connections
export const createWebSocketConnection = (config: WebSocketConfig): WebSocketManager => {
  const wsUrl = import.meta.env.VITE_ENV_TYPE === "DEV"
    ? import.meta.env.VITE_HYGGO_API_URL_WS
    : import.meta.env.VITE_HYGGO_API_URL_WSS_PRODUCTION;

  return new WebSocketManager(wsUrl, config);
};

// Export types for external use
export type { 
  WebSocketConfig, 
  WebSocketEventHandler, 
  WebSocketErrorHandler, 
  WebSocketCloseHandler, 
  WebSocketOpenHandler 
};