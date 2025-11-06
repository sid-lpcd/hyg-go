// LocalStorage helper functions with TypeScript support
import { BasketState } from '../types/common/basket';

export function setBasket(basket: BasketState): void {
  localStorage.setItem("basket", JSON.stringify(basket));
}

export function deleteBasket(): void {
  localStorage.removeItem("basket");
}

export function getBasket(): BasketState | null {
  try {
    const basketData = localStorage.getItem("basket");
    return basketData ? JSON.parse(basketData) : null;
  } catch (error) {
    console.error("Error parsing basket data from localStorage:", error);
    return null;
  }
}

// Additional utility functions for better localStorage management

export function clearAllLocalStorage(): void {
  localStorage.clear();
}

export function removeItem(key: string): void {
  localStorage.removeItem(key);
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
  }
}

export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return null;
  }
}