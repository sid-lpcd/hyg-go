export interface People {
  adults: number;
  children?: number;
  infants?: number;
}

export interface Tag {
  id: number;
  name: string;
  color?: string;
}

export interface TicketCount {
  adults: number;
  children?: number;
  infants?: number;
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
  startDate: string;
  endDate: string;
  ticketCount: TicketCount;
  ticketTotalPrice: number;
  routeInfo?: RouteInfo;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlanActivityWithDetails extends PlanActivity {
  name: string;
  description?: string;
  locationId: number;
  category?: string; // ActivityCategory will be imported when needed
  prices?: any;
  duration?: string;
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
  startDate: string;
  endDate: string;
  people: People;
  isPublic: boolean;
  mainImageUrl?: string;
  userImagesTrip?: any;
  tags?: Tag[];
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanWithActivities extends Plan {
  activities: PlanActivity[];
}