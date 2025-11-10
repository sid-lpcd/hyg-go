// User-related API response types
import { User } from '../../common/user';
import { AuthToken } from '../../common';

export interface RegisterEarlyUserResponse {
  success: boolean;
  message: string;
}

export interface LoginUserResponse extends AuthToken {
  user?: {
    userId: number;
    email: string;
    username: string;
  };
}

export interface RegisterUserResponse extends AuthToken {
  user?: {
    userId: number;
    email: string;
  };
}

export interface UpdateUserResponse {
  user: User;
}

export interface GetUserProfileResponse {
  user: User;
}