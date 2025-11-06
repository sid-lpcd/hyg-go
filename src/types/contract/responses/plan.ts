// Plan-related API response types
import { Plan, PlanWithActivities } from '../../common/plan';

export interface GetPlansResponse {
  plans: Plan[];
}

export interface GetPlansForUserResponse {
  plans: Plan[];
  total: number;
}

export interface GetPlanResponse {
  plan: Plan;
}

export interface CreatePlanResponse {
  plan: Plan;
}

export interface UpdatePlanResponse {
  plan: Plan;
}

export interface UpdatePlanActivitiesResponse {
  plan: PlanWithActivities;
}

export interface DeletePlanResponse {
  success: boolean;
  message?: string;
}

export interface GetPublicPlansResponse {
  plans: Plan[];
}

export interface GetPublicPlanResponse {
  plan: Plan;
}

export interface CreateAIPlanResponse {
  plan: PlanWithActivities;
  message?: string;
}