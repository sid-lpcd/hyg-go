// Basket and shopping cart related types
import { Activity } from './activity';
import { EntityId } from './identifier';
import { TicketCount } from './plan';

export interface BasketState {
  planId: EntityId;
  activities: BasketActivity[];
  gratuity: number;
}

export interface BasketActivity extends Pick<Activity, 'activityId' | 'name' | 'locationId'> {
  planId: EntityId;
  ticketCount: TicketCount;
  ticketTotalPrice: number;
}
