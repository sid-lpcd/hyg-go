import { UserRole } from './index';

export interface User {
  userId: number;
  username: string;
  email: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  phoneNumber?: string;
  followers?: number;
  following?: number;
  totalTrips?: number;
  country?: string;
  isPremium: boolean;
  role: UserRole;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface AuthToken {
  token: string;
  refreshToken?: string;
  expiresAt?: string;
}