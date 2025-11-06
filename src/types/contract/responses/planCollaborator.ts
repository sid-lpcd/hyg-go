// Plan Collaborator related API response types
import { PlanCollaborator, PlanCollaboratorWithUser } from '../../common/planCollaborator';

export interface GetPlanCollaboratorsResponse {
  collaborators: PlanCollaboratorWithUser[];
  total: number;
}

export interface GetPlanCollaboratorResponse {
  collaborator: PlanCollaboratorWithUser;
}

export interface CreatePlanCollaboratorResponse {
  collaborator: PlanCollaborator;
  success: boolean;
  message?: string;
}

export interface UpdatePlanCollaboratorResponse {
  collaborator: PlanCollaborator;
  success: boolean;
  message?: string;
}

export interface RemovePlanCollaboratorResponse {
  success: boolean;
  message?: string;
}

export interface InviteCollaboratorResponse {
  success: boolean;
  message: string;
  invitationId?: string;
  invitationToken?: string;
}

export interface GetUserCollaborationsResponse {
  collaborations: Array<{
    plan: {
      planId: number;
      title: string;
      description?: string;
      mainImageUrl?: string;
      locationId: number;
      isPublic: boolean;
    };
    role: string;
    joinedAt: string;
  }>;
  total: number;
}