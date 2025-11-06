// Plan Collaborator related API request types
import { CollaboratorRole } from '../../common/planCollaborator';

export interface CreatePlanCollaboratorRequest {
  planId: number;
  userId: number;
  role: CollaboratorRole;
}

export interface UpdatePlanCollaboratorRequest {
  role?: CollaboratorRole;
}

export interface GetPlanCollaboratorsRequest {
  planId: number;
}

export interface RemovePlanCollaboratorRequest {
  planId: number;
  userId: number;
}

export interface InviteCollaboratorRequest {
  planId: number;
  email: string;
  role: CollaboratorRole;
  message?: string;
}