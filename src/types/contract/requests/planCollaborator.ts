// Plan Collaborator related API request types
import { EntityId } from '../../common';
import { CollaboratorRole } from '../../common/planCollaborator';

export interface CreatePlanCollaboratorRequest {
  planId: EntityId;
  userId: EntityId;
  role: CollaboratorRole;
}

export interface UpdatePlanCollaboratorRequest {
  role?: CollaboratorRole;
}

export interface GetPlanCollaboratorsRequest {
  planId: EntityId;
}

export interface RemovePlanCollaboratorRequest {
  planId: EntityId;
  userId: EntityId;
}

export interface InviteCollaboratorRequest {
  planId: EntityId;
  email: string;
  role: CollaboratorRole;
  message?: string;
}
