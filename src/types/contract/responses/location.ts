// Location-related API response types
import { Location } from '../../common/location';
import { Activity } from '../../common/activity';

export interface GetLocationsResponse {
  locations: Location[];
}

export interface GetLocationResponse {
  location: Location;
}

export interface CreateLocationResponse {
  location: Location;
}

export interface UpdateLocationResponse {
  location: Location;
}

export interface DeleteLocationResponse {
  success: boolean;
  message?: string;
}

export interface GetLocationCategoriesResponse {
  categories: string[];
}

export interface GetLocationActivitiesResponse {
  activities: Activity[];
  total: number;
}

export interface GetLocationActivitiesForBoundsResponse {
  activities: Activity[];
}