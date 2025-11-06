// Basket and shopping cart related types
import { Activity } from './activity';
import { PlanActivity } from './plan';

export interface BasketState {
  planId: number;
  activities: (Activity | PlanActivity)[];
  gratuity: number;
}