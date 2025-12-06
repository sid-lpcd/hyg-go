import { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react';
import { BasketActivity, BasketState } from '../types/common/basket';
import { setBasket as setBasketStorage, getBasket as getBasketStorage, deleteBasket as deleteBasketStorage } from '../utils/localStorageHelper';

// Action types
type BasketAction =
  | { type: 'INITIALIZE_BASKET'; payload: BasketState | null }
  | { type: 'SET_BASKET'; payload: BasketState }
  | { type: 'ADD_ACTIVITY'; payload: BasketActivity }
  | { type: 'REMOVE_ACTIVITY'; payload: number }
  | { type: 'UPDATE_GRATUITY'; payload: number }
  | { type: 'CLEAR_BASKET' }
  | { type: 'UPDATE_PLAN_ID'; payload: number };

// Context type
interface BasketContextType {
  basketState: BasketState | null;
  addActivity: (activity: BasketActivity) => void;
  removeActivity: (activityId: number) => void;
  updateGratuity: (gratuity: number) => void;
  clearBasket: () => void;
  setBasketState: (basket: BasketState) => void;
  updatePlanId: (planId: number) => void;
  getTotalActivities: () => number;
  hasActivity: (activityId: number) => boolean;
}

// Initial state
const initialState: BasketState | null = null;

// Reducer
function basketReducer(state: BasketState | null, action: BasketAction): BasketState | null {
  switch (action.type) {
    case 'INITIALIZE_BASKET':
      return action.payload;
    
    case 'SET_BASKET':
      return action.payload;
    
    case 'ADD_ACTIVITY':
      if (!state) {
        // If no basket exists, we can't add an activity without a planId
        console.warn('Cannot add activity to empty basket without plan ID');
        return state;
      }
      
      // Check if activity already exists
      const existingActivityIndex = state.activities.findIndex(
        activity => activity.activityId === action.payload.activityId
      );
      
      if (existingActivityIndex !== -1) {
        // Activity already exists, don't add duplicate
        return state;
      }
      
      return {
        ...state,
        activities: [...state.activities, action.payload]
      };
    
    case 'REMOVE_ACTIVITY':
      if (!state) return state;
      
      return {
        ...state,
        activities: state.activities.filter(
          activity => activity.activityId !== action.payload
        )
      };
    
    case 'UPDATE_GRATUITY':
      if (!state) return state;
      
      return {
        ...state,
        gratuity: action.payload
      };
    
    case 'CLEAR_BASKET':
      return null;
    
    case 'UPDATE_PLAN_ID':
      if (!state) {
        // Create new basket with the plan ID
        return {
          planId: action.payload,
          activities: [],
          gratuity: 0
        };
      }
      
      return {
        ...state,
        planId: action.payload
      };
    
    default:
      return state;
  }
}

// Create context
const BasketContext = createContext<BasketContextType | undefined>(undefined);

// Provider component
interface BasketProviderProps {
  children: ReactNode;
}

export function BasketProvider({ children }: BasketProviderProps) {

  const [basketState, dispatch] = useReducer(basketReducer, initialState);
  const hasInitialized = useRef(false);

  // Initialize basket from localStorage on mount (guarded)
  useEffect(() => {
    if (!hasInitialized.current) {
      const savedBasket = getBasketStorage();
      dispatch({ type: 'INITIALIZE_BASKET', payload: savedBasket });
      hasInitialized.current = true;
    }
  }, []);

  // Save to localStorage whenever basket changes
  useEffect(() => {
    if (basketState) {
      setBasketStorage(basketState);
    } else {
      deleteBasketStorage();
    }
  }, [basketState]);

  const addActivity = (activity: BasketActivity) => {
    dispatch({ type: 'ADD_ACTIVITY', payload: activity });
  };

  const removeActivity = (activityId: number) => {
    dispatch({ type: 'REMOVE_ACTIVITY', payload: activityId });
  };

  const updateGratuity = (gratuity: number) => {
    dispatch({ type: 'UPDATE_GRATUITY', payload: gratuity });
  };

  const clearBasket = () => {
    dispatch({ type: 'CLEAR_BASKET' });
  };

  const setBasketState = (basket: BasketState) => {
    dispatch({ type: 'SET_BASKET', payload: basket });
  };

  const updatePlanId = (planId: number) => {
    dispatch({ type: 'UPDATE_PLAN_ID', payload: planId });
  };

  const getTotalActivities = (): number => {
    return basketState?.activities?.length || 0;
  };

  const hasActivity = (activityId: number): boolean => {
    return basketState?.activities?.some(activity => activity.activityId === activityId) || false;
  };

  const value: BasketContextType = {
    basketState,
    addActivity,
    removeActivity,
    updateGratuity,
    clearBasket,
    setBasketState,
    updatePlanId,
    getTotalActivities,
    hasActivity
  };

  return (
    <BasketContext.Provider value={value}>
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket(): BasketContextType {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
}

export function useBasketActivities(): (BasketActivity)[] {
  const { basketState } = useBasket();
  return basketState?.activities || [];
}

export function useBasketCount(): number {
  const { getTotalActivities } = useBasket();
  return getTotalActivities();
}

export function useBasketPlanId(): number | null {
  const { basketState } = useBasket();
  return basketState?.planId || null;
}

export function useBasketGratuity(): number {
  const { basketState } = useBasket();
  return basketState?.gratuity || 0;
}