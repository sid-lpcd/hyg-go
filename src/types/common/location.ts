import { EntityId } from "./identifier";

export interface Location {
  locationId: EntityId;
  name: string;
  type: string;
  parentLocationId?: EntityId;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface BoundingBox {
  swLat: number;
  neLat: number;
  swLng: number;
  neLng: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationAutocompleteOption {
  name: string;
  region?: string;
  country?: string;
}

export interface Bounds {
  southwest: [number, number];
  northeast: [number, number];
}
