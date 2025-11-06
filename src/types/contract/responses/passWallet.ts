// PassWallet related API response types
import { 
  Pass, 
  PassEntitlement, 
  PassValidationLog, 
  PassWallet, 
  PassWithEntitlements,
  ValidationResult 
} from '../../common/passWallet';

export interface PassGenerationResponse {
  pass: Pass;
  entitlements: PassEntitlement[];
  qrCodeToken: string;
  qrCodeUrl?: string;
  success: boolean;
  message?: string;
}

export interface PassValidationResponse {
  isValid: boolean;
  result: ValidationResult;
  pass?: Pass;
  entitlements?: PassEntitlement[];
  errorMessage?: string;
  validationLog: PassValidationLog;
}

export interface GetPassWalletResponse {
  wallet: PassWallet;
  passes: Pass[];
  total: number;
  limit: number;
  offset: number;
}

export interface GetPassResponse {
  pass: Pass;
  entitlements?: PassEntitlement[];
}

export interface GetPassWithDetailsResponse {
  pass: PassWithEntitlements;
}

export interface RevokePassResponse {
  success: boolean;
  message: string;
  revokedAt: string;
}

export interface UpdatePassMetadataResponse {
  pass: Pass;
  success: boolean;
  message?: string;
}

export interface GetPassValidationHistoryResponse {
  validationLogs: PassValidationLog[];
  total: number;
  passId: string;
}

export interface GetPassEntitlementsResponse {
  entitlements: PassEntitlement[];
  passId: string;
  total: number;
}

export interface UseEntitlementResponse {
  entitlement: PassEntitlement;
  success: boolean;
  message?: string;
  remainingUsage?: number;
}

export interface GetPassStatsResponse {
  passId: string;
  totalValidations: number;
  successfulValidations: number;
  failedValidations: number;
  lastValidation?: string;
  entitlementsUsed: number;
  entitlementsRemaining: number;
}

export interface ValidateTokenResponse {
  isValid: boolean;
  pass?: Pass;
  errorMessage?: string;
}