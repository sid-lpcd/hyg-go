// PassWallet related types

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
  revokedAt?: string;
}

export interface Pass {
  id: string;
  planId: number;
  passId: string;
  userId: number;
  status: PlanPassStatus;
  version: number;
  issuedAt: string;
  expiresAt: string;
  lastValidatedAt?: string;
  metadata: PassMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface PassEntitlement {
  id: string;
  passId: string;
  entitlementType: EntitlementType;
  referenceId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  status: EntitlementStatus;
  validFrom?: string;
  validUntil?: string;
  usageCount: number;
  maxUsage?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
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
  userId: number;
  passes: Pass[];
  totalPasses: number;
  activePasses: number;
  expiredPasses: number;
  revokedPasses: number;
  lastUpdated: string;
}