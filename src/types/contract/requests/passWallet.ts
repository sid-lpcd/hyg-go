// PassWallet related API request types
import { 
  EntitlementType, 
  EntityId,
  ValidationType, 
  ClientInfo, 
  ValidationLocation 
} from '../../common/passWallet';

export interface GeneratePassRequest {
  planId: EntityId;
  userId: EntityId;
  entitlements: Array<{
    entitlementType: EntitlementType;
    referenceId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    currency: string;
    maxUsage?: number;
    validFrom?: string;
    validUntil?: string;
    metadata?: Record<string, any>;
  }>;
  metadata: {
    planTitle: string;
    destinationCity: string;
    totalPurchases: number;
    totalValue: number;
    currency: string;
    participantCount: number;
  };
  expiresAt?: string;
}

export interface ValidatePassRequest {
  passId: string;
  validatorId?: string;
  validationType: ValidationType;
  clientInfo?: ClientInfo;
  location?: ValidationLocation;
}

export interface ValidateTokenRequest {
  token: string;
  validatorId?: string;
}

export interface UseEntitlementRequest {
  usageCount?: number;
}

export interface GetPassWalletRequest {
  userId: EntityId;
  status?: 'active' | 'expired' | 'revoked' | 'all';
  limit?: number;
  offset?: number;
}

export interface GetPassRequest {
  passId: string;
  includeEntitlements?: boolean;
}

export interface RevokePassRequest {
  passId: string;
  reason: string;
}

export interface UpdatePassMetadataRequest {
  passId: string;
  metadata: Partial<{
    planTitle: string;
    destinationCity: string;
    totalPurchases: number;
    totalValue: number;
    currency: string;
    participantCount: number;
  }>;
}
