// Plan-related API request types
import { People, RouteInfo, Tag, TicketCount } from '../../common/plan';

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

export interface UpdatePlanActivityRequest {
	planId?: number;
	activityId?: number;
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
  planId: number;
  uploaderUserId: number;
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
