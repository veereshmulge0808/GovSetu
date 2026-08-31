/**
 * Challenge lifecycle status.
 * Matches the challenge lifecycle defined in Architecture.md section 8.2
 */
export enum ChallengeStatus {
  DRAFT = 'DRAFT',
  INTERNAL_REVIEW = 'INTERNAL_REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  STARTUP_DISCOVERY = 'STARTUP_DISCOVERY',
  EVALUATION = 'EVALUATION',
  PILOT = 'PILOT',
  PROCUREMENT = 'PROCUREMENT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Application status for startup applications to challenges.
 * Matches the application workflow in README Module 6.
 */
export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ADDITIONAL_INFO_REQUIRED = 'ADDITIONAL_INFO_REQUIRED',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
  SELECTED = 'SELECTED',
  PILOT_STAGE = 'PILOT_STAGE',
  COMPLETED = 'COMPLETED',
}

/**
 * Pilot project lifecycle status.
 * Matches the pilot lifecycle in Architecture.md section 14.
 */
export enum PilotStatus {
  PLANNING = 'PLANNING',
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * Procurement workflow status.
 */
export enum ProcurementStatus {
  PENDING = 'PENDING',
  COMPLIANCE_REVIEW = 'COMPLIANCE_REVIEW',
  DOCUMENTATION = 'DOCUMENTATION',
  APPROVAL = 'APPROVAL',
  CONTRACTING = 'CONTRACTING',
  IMPLEMENTATION = 'IMPLEMENTATION',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Notification types for the notification service.
 */
export enum NotificationType {
  CHALLENGE_PUBLISHED = 'CHALLENGE_PUBLISHED',
  APPLICATION_STATUS_CHANGED = 'APPLICATION_STATUS_CHANGED',
  EVALUATION_ASSIGNED = 'EVALUATION_ASSIGNED',
  EVALUATION_SUBMITTED = 'EVALUATION_SUBMITTED',
  PILOT_STARTED = 'PILOT_STARTED',
  PILOT_MILESTONE_DUE = 'PILOT_MILESTONE_DUE',
  PILOT_COMPLETED = 'PILOT_COMPLETED',
  PROCUREMENT_INITIATED = 'PROCUREMENT_INITIATED',
  DOCUMENT_REQUESTED = 'DOCUMENT_REQUESTED',
  DEADLINE_REMINDER = 'DEADLINE_REMINDER',
  MATCH_FOUND = 'MATCH_FOUND',
  GENERAL = 'GENERAL',
}

/**
 * Organization types on the platform.
 */
export enum OrganizationType {
  GOVERNMENT = 'GOVERNMENT',
  STARTUP = 'STARTUP',
  RESEARCH = 'RESEARCH',
  NGO = 'NGO',
}

/**
 * Document categories for file management.
 */
export enum DocumentCategory {
  STARTUP_PROFILE = 'STARTUP_PROFILE',
  CERTIFICATION = 'CERTIFICATION',
  TECHNICAL_PROPOSAL = 'TECHNICAL_PROPOSAL',
  FINANCIAL_DOCUMENT = 'FINANCIAL_DOCUMENT',
  PILOT_REPORT = 'PILOT_REPORT',
  PROCUREMENT_DOCUMENT = 'PROCUREMENT_DOCUMENT',
  CASE_STUDY = 'CASE_STUDY',
  OTHER = 'OTHER',
}

/**
 * Technology Readiness Levels (TRL) for startup solutions.
 * Based on the standard EU/NASA TRL scale.
 */
export enum TechnologyReadinessLevel {
  TRL_1 = 'TRL_1', // Basic principles observed
  TRL_2 = 'TRL_2', // Concept formulated
  TRL_3 = 'TRL_3', // Concept proven
  TRL_4 = 'TRL_4', // Technology validated in lab
  TRL_5 = 'TRL_5', // Technology validated in relevant environment
  TRL_6 = 'TRL_6', // Technology demonstrated
  TRL_7 = 'TRL_7', // System prototype demonstrated in operational env
  TRL_8 = 'TRL_8', // System complete and qualified
  TRL_9 = 'TRL_9', // Actual system proven in operational environment
}

/**
 * Funding stages for startup organizations.
 */
export enum FundingStage {
  BOOTSTRAPPED = 'BOOTSTRAPPED',
  PRE_SEED = 'PRE_SEED',
  SEED = 'SEED',
  SERIES_A = 'SERIES_A',
  SERIES_B = 'SERIES_B',
  SERIES_C_PLUS = 'SERIES_C_PLUS',
  PROFITABLE = 'PROFITABLE',
  LISTED = 'LISTED',
}

/**
 * Audit log action types.
 */
export enum AuditAction {
  // Challenge actions
  CHALLENGE_CREATED = 'CHALLENGE_CREATED',
  CHALLENGE_UPDATED = 'CHALLENGE_UPDATED',
  CHALLENGE_PUBLISHED = 'CHALLENGE_PUBLISHED',
  CHALLENGE_CANCELLED = 'CHALLENGE_CANCELLED',

  // Application actions
  APPLICATION_SUBMITTED = 'APPLICATION_SUBMITTED',
  APPLICATION_STATUS_CHANGED = 'APPLICATION_STATUS_CHANGED',

  // Evaluation actions
  EVALUATION_ASSIGNED = 'EVALUATION_ASSIGNED',
  EVALUATION_SUBMITTED = 'EVALUATION_SUBMITTED',
  EVALUATION_SCORE_MODIFIED = 'EVALUATION_SCORE_MODIFIED',

  // Pilot actions
  PILOT_CREATED = 'PILOT_CREATED',
  PILOT_APPROVED = 'PILOT_APPROVED',
  PILOT_COMPLETED = 'PILOT_COMPLETED',

  // Procurement actions
  PROCUREMENT_INITIATED = 'PROCUREMENT_INITIATED',
  PROCUREMENT_APPROVED = 'PROCUREMENT_APPROVED',

  // User / Auth actions
  USER_REGISTERED = 'USER_REGISTERED',
  USER_LOGIN = 'USER_LOGIN',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
  USER_DISABLED = 'USER_DISABLED',

  // AI actions
  AI_MATCHING_TRIGGERED = 'AI_MATCHING_TRIGGERED',
  AI_RECOMMENDATION_GENERATED = 'AI_RECOMMENDATION_GENERATED',

  // Document actions
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  DOCUMENT_DELETED = 'DOCUMENT_DELETED',
}
