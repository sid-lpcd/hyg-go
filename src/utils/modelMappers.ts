import { 
  Activity, 
  Location, 
  Plan, 
  User, 
  PersonType,
  PlanWithActivities,
  PlanActivityWithDetails
} from '../types/contract';
import { AuthUser } from '../types/common';
import { Price, Prices } from '../types/common/activity';

export class ModelMappers {
  
  private static parseDate(dateString: string | Date | null | undefined): Date | null {
    if (!dateString) return null;
    if (dateString instanceof Date) return dateString;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  private static ensureNumber(value: any): number | undefined {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }

  private static ensureString(value: any): string | undefined {
    if (typeof value === 'string') return value;
    if (value !== null && value !== undefined) return String(value);
    return undefined;
  }

  // Parse price string like "5-10 EUR" into structured price object
  private static parsePriceString(priceString: string): Price | null {
    if (!priceString || typeof priceString !== 'string') return null;
    
    const pricePattern = /^(\d+(?:\.\d+)?)\s*(?:-\s*(\d+(?:\.\d+)?))?\s*([A-Z]{3})\s*$/i;
    const match = priceString.match(pricePattern);
    
    if (!match) return null;
    
    const minPrice = parseFloat(match[1]);
    const maxPrice = match[2] ? parseFloat(match[2]) : minPrice;
    const currencyCode = match[3].toUpperCase();
    
    return {
      minPrice,
      maxPrice,
      currencyCode
    };
  }

  private static mapPrices(prices: any): Prices | null {
    if (!prices) return null;
    
    // If prices is a string like "5-10 EUR", parse it as adult price
    if (typeof prices === 'string') {
      const adultPrice = this.parsePriceString(prices);
      return adultPrice ? { [PersonType.ADULT]: adultPrice } as Prices : null;
    }
    
    // If prices is an object, map each price type
    if (typeof prices === 'object') {
      const result: Partial<Record<PersonType, Price>> = {};
      
      Object.values(PersonType).forEach(personType => {
        const value = prices[personType];
        if (value) {
          if (typeof value === 'string') {
            const parsed = this.parsePriceString(value);
            if (parsed) result[personType] = parsed;
          } else if (typeof value === 'object' && value !== null) {
            // Already structured price object
            result[personType] = {
              minPrice: this.ensureNumber(value.minPrice) || 0,
              maxPrice: this.ensureNumber(value.maxPrice) || 0,
              currencyCode: this.ensureString(value.currencyCode) || 'EUR'
            };
          }
        }
      });
      
      // Ensure adult price exists, otherwise return null
      if (!result[PersonType.ADULT]) {
        return null;
      }
      
      return result as Prices;
    }
    
    return null;
  }

  private static mapTicketCount(ticketCount: any): Record<PersonType, number> {
    const result: Record<PersonType, number> = {} as Record<PersonType, number>;
    if (typeof ticketCount === 'object' && ticketCount !== null) {
      Object.values(PersonType).forEach(personType => {
        const value = ticketCount[personType];
        if (value != null) {
          result[personType] = this.ensureNumber(value) || 0;
        }
      });
    }
    return result;
  }

  // Activity mapping
  static mapActivity(apiActivity: any): Activity | PlanActivityWithDetails {
    if (!apiActivity) return apiActivity;

    if (apiActivity.planId != null) {
      return {
        planId: this.ensureNumber(apiActivity.planId) || 0,
        activityId: this.ensureNumber(apiActivity.activityId) || 0,
        startDate: this.parseDate(apiActivity.startDate) || new Date(),
        endDate: this.parseDate(apiActivity.endDate) || new Date(),
        ticketCount: this.mapTicketCount(apiActivity.ticketCount) || { [PersonType.ADULT]: 1 },
        ticketTotalPrice: this.ensureNumber(apiActivity.ticketTotalPrice) || 0,
        routeInfo: apiActivity.routeInfo,
        createdAt: this.parseDate(apiActivity.createdAt) || new Date(),
        updatedAt: this.parseDate(apiActivity.updatedAt) || new Date(),
        name: this.ensureString(apiActivity.name) || '',
        description: this.ensureString(apiActivity.description),
        locationId: this.ensureNumber(apiActivity.locationId) || 0,
        category: apiActivity.category,
        prices: this.mapPrices(apiActivity.prices),
        duration: this.ensureString(apiActivity.duration),
        imageUrl: this.ensureString(apiActivity.imageUrl),
        externalUrl: this.ensureString(apiActivity.externalUrl),
        latitude: this.ensureNumber(apiActivity.latitude),
        longitude: this.ensureNumber(apiActivity.longitude),
      } as PlanActivityWithDetails;
    }
    
    return {
      activityId: this.ensureNumber(apiActivity.activityId) || 0,
      name: this.ensureString(apiActivity.name) || '',
      locationId: this.ensureNumber(apiActivity.locationId) || 0,
      tags: apiActivity.tags,
      category: apiActivity.category,
      description: this.ensureString(apiActivity.description),
      prices: this.mapPrices(apiActivity.prices),
      duration: this.ensureString(apiActivity.duration),
      imageUrl: this.ensureString(apiActivity.imageUrl),
      openingHours: this.ensureString(apiActivity.openingHours),
      latitude: this.ensureNumber(apiActivity.latitude),
      longitude: this.ensureNumber(apiActivity.longitude),
      reviewsAverageRating: this.ensureNumber(apiActivity.reviewsAverageRating),
      reviewsTotalCount: this.ensureNumber(apiActivity.reviewsTotalCount),
      images: apiActivity.images,
      externalUrl: this.ensureString(apiActivity.externalUrl),
      activityViatorId: this.ensureString(apiActivity.activityViatorId),
      createdAt: this.parseDate(apiActivity.createdAt) || new Date(),
      updatedAt: this.parseDate(apiActivity.updatedAt) || new Date(),
    } as Activity;
  }

  static mapActivities(apiActivities: any[]): (Activity | PlanActivityWithDetails)[] {
    if (!Array.isArray(apiActivities)) return [];
    return apiActivities.map(activity => this.mapActivity(activity));
  }

  // Location mapping
  static mapLocation(apiLocation: any): Location {
    if (!apiLocation) return apiLocation;
    
    return {
      locationId: this.ensureNumber(apiLocation.locationId) || 0,
      name: this.ensureString(apiLocation.name) || '',
      type: this.ensureString(apiLocation.type) || '',
      parentLocationId: this.ensureNumber(apiLocation.parentLocationId),
      lookupId: this.ensureString(apiLocation.lookupId),
      destinationUrl: this.ensureString(apiLocation.destinationUrl),
      defaultCurrencyCode: this.ensureString(apiLocation.defaultCurrencyCode),
      timeZone: this.ensureString(apiLocation.timeZone),
      iataCodes: apiLocation.iataCodes,
      countryCallingCode: this.ensureString(apiLocation.countryCallingCode),
      languages: apiLocation.languages,
      latitude: this.ensureNumber(apiLocation.latitude),
      longitude: this.ensureNumber(apiLocation.longitude),
      region: this.ensureString(apiLocation.region),
      country: this.ensureString(apiLocation.country),
      createdAt: this.parseDate(apiLocation.createdAt) || new Date(),
      updatedAt: this.parseDate(apiLocation.updatedAt) || new Date(),
    } as Location;
  }

  static mapLocations(apiLocations: any[]): Location[] {
    if (!Array.isArray(apiLocations)) return [];
    return apiLocations.map(location => this.mapLocation(location));
  }

  // Plan mapping
  static mapPlan(apiPlan: any): Plan | PlanWithActivities {
    if (!apiPlan) return apiPlan;

    if (apiPlan.activities != null){
      return {
        planId: this.ensureNumber(apiPlan.planId) || 0,
        userId: this.ensureNumber(apiPlan.userId) || 0,
        activities: this.mapActivities(apiPlan.activities) as PlanActivityWithDetails[] || [],
        title: this.ensureString(apiPlan.title) || '',
        description: this.ensureString(apiPlan.description),
        locationId: this.ensureNumber(apiPlan.locationId) || 0,
        startDate: this.parseDate(apiPlan.startDate) || new Date().toISOString(),
        endDate: this.parseDate(apiPlan.endDate) || new Date().toISOString(),
        people: apiPlan.people || { [PersonType.ADULT]: 1 },
        isPublic: Boolean(apiPlan.isPublic || apiPlan.is_public),
        mainImageUrl: this.ensureString(apiPlan.mainImageUrl),
        userImagesTrip: apiPlan.userImagesTrip,
        tags: Array.isArray(apiPlan.tags) ? apiPlan.tags : [],
        likes: this.ensureNumber(apiPlan.likes) || 0,
        createdAt: this.parseDate(apiPlan.createdAt) || new Date().toISOString(),
        updatedAt: this.parseDate(apiPlan.updatedAt) || new Date().toISOString(),
      } as PlanWithActivities;
    }
    
    return {
      planId: this.ensureNumber(apiPlan.planId) || 0,
      userId: this.ensureNumber(apiPlan.userId) || 0,
      title: this.ensureString(apiPlan.title) || '',
      description: this.ensureString(apiPlan.description),
      locationId: this.ensureNumber(apiPlan.locationId) || 0,
      startDate: this.parseDate(apiPlan.startDate) || new Date().toISOString(),
      endDate: this.parseDate(apiPlan.endDate) || new Date().toISOString(),
      people: apiPlan.people || { [PersonType.ADULT]: 1 },
      isPublic: Boolean(apiPlan.isPublic || apiPlan.is_public),
      mainImageUrl: this.ensureString(apiPlan.mainImageUrl),
      userImagesTrip: apiPlan.userImagesTrip,
      tags: Array.isArray(apiPlan.tags) ? apiPlan.tags : [],
      likes: this.ensureNumber(apiPlan.likes) || 0,
      createdAt: this.parseDate(apiPlan.createdAt) || new Date().toISOString(),
      updatedAt: this.parseDate(apiPlan.updatedAt) || new Date().toISOString(),
    } as Plan;
  }

  static mapPlans(apiPlans: any[]): Plan[] | PlanWithActivities[] {
    if (!Array.isArray(apiPlans)) return [];
    return apiPlans.map(plan => this.mapPlan(plan));
  }

  // User mapping
  static mapUser(apiUser: any): User {
    if (!apiUser) return apiUser;
    
    return {
      userId: this.ensureNumber(apiUser.userId) || 0,
      username: this.ensureString(apiUser.username) || '',
      email: this.ensureString(apiUser.email) || '',
      emailVerified: Boolean(apiUser.emailVerified),
      emailVerificationToken: this.ensureString(apiUser.emailVerificationToken),
      firstName: this.ensureString(apiUser.firstName),
      lastName: this.ensureString(apiUser.lastName),
      profilePicture: this.ensureString(apiUser.profilePicture),
      phoneNumber: this.ensureString(apiUser.phoneNumber),
      followers: this.ensureNumber(apiUser.followers),
      following: this.ensureNumber(apiUser.following),
      totalTrips: this.ensureNumber(apiUser.totalTrips),
      country: this.ensureString(apiUser.country),
      isPremium: Boolean(apiUser.isPremium),
      role: apiUser.role || 'user',
      bio: this.ensureString(apiUser.bio),
      createdAt: this.ensureString(apiUser.createdAt) || new Date().toISOString(),
      updatedAt: this.ensureString(apiUser.updatedAt) || new Date().toISOString(),
    } as User;
  }

  static mapAuthResponse(apiResponse: any): AuthUser {
    if (!apiResponse) {
      return { token: '', user: undefined };
    }
    return {
      user: apiResponse.user ? {
          userId: this.ensureNumber(apiResponse.user.userId) || 0,
          email: this.ensureString(apiResponse.user.email) || '',
        } : undefined,
      token: this.ensureString(apiResponse.token) || '',
      expiresAt: this.ensureString(apiResponse.expiresAt) || '',
    };
  }
}

// Export convenience functions for specific use cases
export const mapActivity = ModelMappers.mapActivity.bind(ModelMappers);
export const mapActivities = ModelMappers.mapActivities.bind(ModelMappers);
export const mapLocation = ModelMappers.mapLocation.bind(ModelMappers);
export const mapLocations = ModelMappers.mapLocations.bind(ModelMappers);
export const mapPlan = ModelMappers.mapPlan.bind(ModelMappers);
export const mapPlans = ModelMappers.mapPlans.bind(ModelMappers);
export const mapUser = ModelMappers.mapUser.bind(ModelMappers);
export const mapAuthResponse = ModelMappers.mapAuthResponse.bind(ModelMappers);