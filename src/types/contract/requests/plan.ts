// Plan-related API request types
import { People, RouteInfo, Tag, TicketCount } from '../../common/plan';
import { EntityId } from '../../common';

export interface CreatePlanRequest {
  userId: EntityId;
  title: string;
  description?: string;
  locationId: EntityId;
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
  locationId?: EntityId;
  startDate?: string;
  endDate?: string;
  people?: People;
  isPublic?: boolean;
  mainImageUrl?: string;
  userImagesTrip?: any;
  tags?: Tag[];
  likes?: number;
}

export interface UpdatePlanActivityRequest {
	planId?: EntityId;
	activityId?: EntityId;
	startDate?: string;
	endDate?: string;
	ticketCount?: TicketCount;
	ticketTotalPrice?: number;
	routeInfo?: RouteInfo;
}

export interface GetPlansForUserRequest {
  after?: string;
}

export interface CreateUploadIntentBody {
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface PlanMediaDTO {
  id: string;
  planId: EntityId;
  uploaderUserId: EntityId;
  storageProvider: 's3' | 'local';
  storageKey: string;
  bucket?: string | null;
  mimeType: string;
  sizeBytes: number;
  originalName: string;
  url?: string | null;
  createdAt: string;
}

export interface UploadIntentDTO {
  media: PlanMediaDTO;
  upload: {
    url: string;
    method: 'PUT';
    headers: Record<string, string>;
    expiresInSeconds: number;
  };
}
