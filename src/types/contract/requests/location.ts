// Location-related API request types
import { LocationType } from '../../common';

export interface GetLocationsRequest {
  search?: string;
}

export interface CreateLocationRequest {
  name: string;
  type: LocationType | string;
  parentLocationId?: number;
  lookupId?: string;
  destinationUrl?: string;
  defaultCurrencyCode?: string;
  timeZone?: string;
  iataCodes?: any;
  countryCallingCode?: string;
  languages?: any;
  latitude?: number;
  longitude?: number;
  region?: string;
  country?: string;
}

export interface UpdateLocationRequest {
  name?: string;
  type?: LocationType | string;
  parentLocationId?: number;
  lookupId?: string;
  destinationUrl?: string;
  defaultCurrencyCode?: string;
  timeZone?: string;
  iataCodes?: any;
  countryCallingCode?: string;
  languages?: any;
  latitude?: number;
  longitude?: number;
  region?: string;
  country?: string;
}

export interface GetLocationByCoordinatesRequest {
  lat: number;
  lng: number;
}