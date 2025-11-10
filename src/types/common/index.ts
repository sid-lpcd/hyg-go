// Export entities
export * from './activity';
export * from './location';
export * from './user';
export * from './plan';
export * from './passWallet';
export * from './planCollaborator';
export * from './basket';
export * from './auth';

// Person types enum for consistent keys across pricing and ticket interfaces
export enum PersonType {
  ADULT = 'adult',
  CHILD = 'child',
  INFANT = 'infant',
  SENIOR = 'senior',
  STUDENT = 'student'
}