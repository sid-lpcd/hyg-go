// Plan Collaborator related API response types
import { PlanCollaborator, PlanCollaboratorWithUser } from '../../common/planCollaborator';
import { EntityId } from '../../common/identifier';

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
      planId: EntityId;
      title: string;
      description?: string;
      mainImageUrl?: string;
      locationId: EntityId;
      isPublic: boolean;
    };
    role: string;
    joinedAt: string;
  }>;
  total: number;
}
