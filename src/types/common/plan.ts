import { ActivityCategory, PersonType, Prices } from './index';

export type TicketCount = Partial<Record<PersonType, number>> & {
  [PersonType.ADULT]: number; // Adult is required, others are optional
};

export type People = Partial<Record<PersonType, number>> & {
  [PersonType.ADULT]: number; // At least one adult required
};

export interface Tag {
  id: number;
  name: string;
  color?: string;
}

export enum TravelMode {
    DRIVING = "driving",
    WALKING = "walking",
    BICYCLING = "bicycling",
    TRANSIT = "transit"
}

export interface TravelInfo {
  mode: TravelMode; 
  distanceValue: number;
  durationValue: number;
  error?: any;
}

export type RouteInfo = Record<number, TravelInfo[]>;

export interface PlanActivityProps {
  planId: number;
  activityId: number;
  startDate: Date;
  endDate: Date;
  ticketCount: TicketCount;
  ticketTotalPrice: number;
  routeInfo?: RouteInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PlanActivity = PlanActivityProps;

export interface PlanActivityWithDetails extends PlanActivityProps {
  name: string;
  description?: string;
  locationId: number;
  category?: ActivityCategory[];
  prices?: Prices;
  duration?: number;
  imageUrl?: string;
  externalUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface Plan {
  planId: number;
  userId: number;
  title: string;
  description?: string;
  locationId: number;
  startDate: Date;
  endDate: Date;
  people: People;
  isPublic: boolean;
  mainImageUrl?: string;
  userImagesTrip?: any;
  tags?: Tag[];
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PlanView = 'summary' | 'detail';

export interface PlanWithSummaryActivities extends Plan {
  activities: PlanActivity[];
}

export interface PlanWithDetailedActivities extends Plan {
  activities: PlanActivityWithDetails[];
}


// Todo: Update this when public plans a thing
export interface PublicPlanUser {
  name: string;
  profileImage: string;
}

export interface PublicPlan extends Plan {
  location: string;
  imageUrl: string;
  user: PublicPlanUser;
}
