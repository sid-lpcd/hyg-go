// User-related API request types
import { EntityId, UserRole } from '../../common';

export interface RegisterEarlyUserRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginUserRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  country?: string;
  bio?: string;
  profilePicture?: string;
  phoneNumber?: string;
  isPremium?: boolean;
  role?: UserRole;
}

export interface UpdateUserRequest {
  userId: EntityId;
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  bio?: string;
  profilePicture?: string;
  phoneNumber?: string;
  isPremium?: boolean;
  role?: UserRole;
}
