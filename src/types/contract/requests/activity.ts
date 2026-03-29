// Activity-related API request types
import { ActivityCategory, EntityId } from '../../common';

export interface GetActivitiesRequest {
  bounds?: {
    swLat: number;
    neLat: number;
    swLng: number;
    neLng: number;
  };
}

export interface CreateActivityRequest {
  name: string;
  locationId: EntityId;
  tags?: string | string[];
  category?: ActivityCategory;
  description?: string;
  prices?: any;
  duration?: string;
  imageUrl?: string;
  openingHours?: string;
  latitude?: number;
  longitude?: number;
  reviewsAverageRating?: number;
  reviewsTotalCount?: number;
  images?: any;
  externalUrl?: string;
  activityViatorId?: string;
}

export interface UpdateActivityRequest {
  name?: string;
  locationId?: EntityId;
  tags?: string | string[];
  category?: ActivityCategory;
  description?: string;
  prices?: any;
  duration?: string;
  imageUrl?: string;
  openingHours?: string;
  latitude?: number;
  longitude?: number;
  reviewsAverageRating?: number;
  reviewsTotalCount?: number;
  images?: any;
  externalUrl?: string;
  activityViatorId?: string;
}

export interface GetActivitiesForLocationRequest {
  locationId: EntityId;
  offset?: number;
  limit?: number;
}

export interface GetActivitiesForBoundsRequest {
  locationId: EntityId;
  bounds: {
    swLat: number;
    neLat: number;
    swLng: number;
    neLng: number;
  };
}
