// Plan Collaborator related types

export enum CollaboratorRole {
  CREATOR = 'creator',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export interface PlanCollaborator {
  planId: number;
  userId: number;
  role: CollaboratorRole;
  createdAt: string;
  updatedAt: string;
}

export interface PlanCollaboratorWithUser extends PlanCollaborator {
  user: {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    email: string;
  };
}