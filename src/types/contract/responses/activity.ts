// Activity-related API response types
import { Activity } from '../../common/activity';

export interface GetActivitiesResponse {
  activities: Activity[];
}

export interface GetActivityResponse {
  activity: Activity;
}

export interface CreateActivityResponse {
  activity: Activity;
}

export interface UpdateActivityResponse {
  activity: Activity;
}

export interface DeleteActivityResponse {
  success: boolean;
  message?: string;
}