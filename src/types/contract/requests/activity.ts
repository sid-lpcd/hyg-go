// Activity-related API request types
import { ActivityCategory } from '../common';

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
  locationId: number;
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
  locationId?: number;
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
  locationId: number;
  offset?: number;
  limit?: number;
}

export interface GetActivitiesForBoundsRequest {
  locationId: number;
  bounds: {
    swLat: number;
    neLat: number;
    swLng: number;
    neLng: number;
  };
}