// Plan-related API request types
import { People, Tag } from '../../common/plan';

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

export interface UpdatePlanActivitiesRequest {
  activities: any[]; // Define this based on your PlanActivity structure
}

export interface GetPlansForUserRequest {
  after?: string;
}