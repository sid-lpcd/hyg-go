// PassWallet related types

import { Prices } from "./activity";
import { EntityId } from "./identifier";
import { Location } from "./location";
import { Plan, PlanActivityWithDetails, TicketCount } from "./plan";

// Enums
export enum PlanPassStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  PENDING = 'pending'
}

export enum EntitlementType {
  ACTIVITY = 'activity',
  TRANSPORT = 'transport',
  ACCOMMODATION = 'accommodation',
  DINING = 'dining',
  SHOPPING = 'shopping',
  OTHER = 'other'
}

export enum EntitlementStatus {
  ACTIVE = 'active',
  USED = 'used',
  EXPIRED = 'expired',
  REVOKED = 'revoked'
}

export enum ValidationType {
  QR_SCAN = 'qr_scan',
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  API = 'api'
}

export enum ValidationResult {
  SUCCESS = 'success',
  EXPIRED = 'expired',
  INVALID = 'invalid',
  ALREADY_USED = 'already_used',
  NOT_FOUND = 'not_found',
  REVOKED = 'revoked',
  ERROR = 'error'
}

// Core interfaces
export interface PassMetadata {
  planTitle: string;
  destinationCity: string;
  totalPurchases: number;
  totalValue: number;
  currency: string;
  participantCount: number;
  validationCount: number;
  revocationReason?: string;
  revokedAt?: Date;
}

export interface Pass {
  id: string;
  planId: EntityId;
  passId: string;
  userId: EntityId;
  plan: Plan;
  activities: PlanActivityWithDetails[];
  location: Location;
  status: PlanPassStatus;
  version: number;
  issuedAt: Date;
  expiresAt: Date;
  lastValidatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PassEntitlement {
  id: string;
  passId: string;
  entitlementType: EntitlementType;
  referenceId: string;
  ticketCount: TicketCount;
  prices: Prices;
  totalPrice: number;
  currency: string;
  status: EntitlementStatus;
  validFrom?: Date;
  validUntil?: Date;
  usageCount: number;
  maxUsage?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientInfo {
  userAgent?: string;
  ipAddress?: string;
  deviceId?: string;
  appVersion?: string;
  platform?: string;
}

export interface ValidationLocation {
  latitude?: number;
  longitude?: number;
  venue?: string;
  city?: string;
  country?: string;
  address?: string;
}

export interface PassValidationLog {
  id: string;
  passId: string;
  validatorId?: string;
  validationType: ValidationType;
  result: ValidationResult;
  clientInfo?: ClientInfo;
  location?: ValidationLocation;
  errorMessage?: string;
  validatedAt: string;
}

export interface PassWithEntitlements extends Pass {
  entitlements: PassEntitlement[];
}

// Wallet container
export interface PassWallet {
  userId: EntityId;
  passes: Pass[];
  totalPasses: number;
  activePasses: number;
  expiredPasses: number;
  revokedPasses: number;
  lastUpdated: Date;
}
