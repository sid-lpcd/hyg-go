// Basket and shopping cart related types
import { Activity } from './activity';
import { TicketCount } from './plan';

export interface BasketState {
  planId: number;
  activities: BasketActivity[];
  gratuity: number;
}

export interface BasketActivity extends Activity{
  planId: number;
  ticketCount: TicketCount;
  ticketTotalPrice: number;
}