export interface Activity {
  activityId: number;
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
  createdAt: string;
  updatedAt: string;
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