import { EntityId } from "./identifier";

export interface AuthToken {
    token: string;
    expiresAt?: string;
}

export interface AuthUser extends AuthToken {
    user?: {
        userId: EntityId;
        email: string;
    };
}

export interface AuthState extends AuthUser {
    isLoggedIn: boolean;
}

export interface AuthStateResponse {
  success: boolean;
  error?: string;
}
