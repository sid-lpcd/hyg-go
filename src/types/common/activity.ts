import { PersonType } from './index';
import { EntityId } from './identifier';

export interface Price {
  minPrice: number;
  maxPrice: number;
  currencyCode: string;
}

export type Prices = Partial<Record<PersonType, Price>> & {
  [PersonType.ADULT]: Price; // Adult is required, others are optional
};

export interface Activity {
  activityId: EntityId;
  name: string;
  locationId: EntityId;
  tags?: string | string[];
  category?: ActivityCategory | ActivityCategory[];
  description?: string;
  prices?: Prices;
  duration?: number;
  imageUrl?: string;
  openingHours?: string;
  latitude?: number;
  longitude?: number;
  reviewsAverageRating?: number;
  reviewsTotalCount?: number;
  images?: any;
  externalUrl?: string;
  activityViatorId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ActivityCategory {
  HISTORICAL = 'historical',
  CULTURAL = 'cultural',
  NATURE = 'nature',
  ADVENTURE = 'adventure',
  WILDLIFE = 'wildlife',
  RELIGIOUS = 'religious',
  ENTERTAINMENT = 'entertainment',
  URBAN_EXPLORATION = 'urban_exploration',
  CULINARY = 'culinary',
  WATER_BASED = 'water_based',
  SHOPPING = 'shopping',
  EDUCATIONAL = 'educational',
  ART = 'art',
  FESTIVALS_AND_EVENTS = 'festivals_and_events',
  SPORTS_AND_RECREATION = 'sports_and_recreation',
  MODERN_WONDERS = 'modern_wonders',
  PHOTOGRAPHY_HOTSPOTS = 'photography_hotspots'
}

export interface ActivitySelectedFilters {
  category: string[];
  tags: string[];
}

export interface MapMarker extends Pick<Activity, 'activityId' | 'latitude' | 'longitude' | 'category'> {
  latitude: number; 
  longitude: number;
}

export interface ActivityMarker extends MapMarker {
  order: number;
  day: number;
  startTime: string;
  endTime: string;
  name: string;
}
