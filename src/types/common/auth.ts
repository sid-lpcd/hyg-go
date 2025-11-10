export interface AuthToken {
    token: string;
    expiresAt?: string;
}

export interface AuthUser extends AuthToken {
    user?: {
        userId: number;
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