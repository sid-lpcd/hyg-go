// User-related API response types
import { User } from '../../common/user';
import { AuthToken } from '../../common';

export interface RegisterEarlyUserResponse {
  success: boolean;
  message: string;
}

export interface LoginUserResponse {
  user: User;
  token: AuthToken;
}

export interface RegisterUserResponse {
  user: User;
  token: AuthToken;
}

export interface RefreshTokenResponse {
  token: AuthToken;
}

export interface UpdateUserResponse {
  user: User;
}

export interface GetUserProfileResponse {
  user: User;
}