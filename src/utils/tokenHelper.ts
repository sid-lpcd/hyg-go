// Token management and validation helper functions
import { AuthToken } from '../types/common/user';

export function setToken(token: string, expiresAt: string): void {
  localStorage.setItem("authToken", JSON.stringify({ token, expiresAt }));
}

export function deleteToken(): void {
  localStorage.removeItem("authToken");
}

export function getToken(): AuthToken | null {
  try {
    const tokenData = localStorage.getItem("authToken");
    return tokenData ? JSON.parse(tokenData) : null;
  } catch (error) {
    console.error("Error parsing token data from localStorage:", error);
    return null;
  }
}

export function isTokenExpired(): boolean {
  const tokenData = getToken();
  if (!tokenData || !tokenData.expiresAt) {
    return true;
  }
  
  const expirationDate = new Date(tokenData.expiresAt);
  const currentDate = new Date();
  
  return currentDate >= expirationDate;
}

export function getTokenIfValid(): AuthToken | null {
  if (isTokenExpired()) {
    deleteToken();
    return null;
  }
  return getToken();
}