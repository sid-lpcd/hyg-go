// Plan-related API request types
import { People, RouteInfo, Tag, TicketCount } from '../../common/plan';

export interface CreatePlanRequest {
  userId: number;
  title: string;
  description?: string;
  locationId: number;
  startDate: string;
  endDate: string;
  people: People;
  isPublic: boolean;
  mainImageUrl?: string;
  userImagesTrip?: any;
  tags?: Tag[];
}

export interface UpdatePlanRequest {
  title?: string;
  description?: string;
  locationId?: number;
  startDate?: string;
  endDate?: string;
  people?: People;
  isPublic?: boolean;
  mainImageUrl?: string;
  userImagesTrip?: any;
  tags?: Tag[];
  likes?: number;
}

export interface UpdatePlanActivityRequest {
	planId?: number;
	activityId?: number;
	startDate?: string;
	endDate?: string;
	ticketCount?: TicketCount;
	ticketTotalPrice?: number;
	routeInfo?: RouteInfo;
}

export interface GetPlansForUserRequest {
  after?: string;
}