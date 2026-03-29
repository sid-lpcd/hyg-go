import { EntityId } from "./identifier";

// Plan Collaborator related types

export enum CollaboratorRole {
  CREATOR = 'creator',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export interface PlanCollaborator {
  planId: EntityId;
  userId: EntityId;
  role: CollaboratorRole;
  createdAt: string;
  updatedAt: string;
}

export interface PlanCollaboratorWithUser extends PlanCollaborator {
  user: {
    userId: EntityId;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    email: string;
  };
}
