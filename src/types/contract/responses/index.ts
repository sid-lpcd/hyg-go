// Common API response types

export interface ApiError {
  error: string;
  message: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
}

// Re-export all response types
export * from './activity';
export * from './location';
export * from './passWallet';
export * from './plan';
export * from './planCollaborator';
export * from './user';