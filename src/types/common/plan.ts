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

export interface RouteInfo {
  distance?: number;
  duration?: number;
  transportMode?: 'walking' | 'driving' | 'public_transport' | 'cycling';
  route?: any; // Define based on your routing service response
}

export interface PlanActivity {
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

export interface PlanActivityWithDetails extends PlanActivity {
  name: string;
  description?: string;
  locationId: number;
  category?: ActivityCategory;
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

export interface PlanWithActivities extends Plan {
  activities: PlanActivity[] | PlanActivityWithDetails[];
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