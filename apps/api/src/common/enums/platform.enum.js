"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditAction = exports.FundingStage = exports.TechnologyReadinessLevel = exports.DocumentCategory = exports.OrganizationType = exports.NotificationType = exports.ProcurementStatus = exports.PilotStatus = exports.ApplicationStatus = exports.ChallengeStatus = void 0;
/**
 * Challenge lifecycle status.
 * Matches the challenge lifecycle defined in Architecture.md section 8.2
 */
var ChallengeStatus;
(function (ChallengeStatus) {
    ChallengeStatus["DRAFT"] = "DRAFT";
    ChallengeStatus["INTERNAL_REVIEW"] = "INTERNAL_REVIEW";
    ChallengeStatus["APPROVED"] = "APPROVED";
    ChallengeStatus["PUBLISHED"] = "PUBLISHED";
    ChallengeStatus["STARTUP_DISCOVERY"] = "STARTUP_DISCOVERY";
    ChallengeStatus["EVALUATION"] = "EVALUATION";
    ChallengeStatus["PILOT"] = "PILOT";
    ChallengeStatus["PROCUREMENT"] = "PROCUREMENT";
    ChallengeStatus["COMPLETED"] = "COMPLETED";
    ChallengeStatus["CANCELLED"] = "CANCELLED";
})(ChallengeStatus || (exports.ChallengeStatus = ChallengeStatus = {}));
/**
 * Application status for startup applications to challenges.
 * Matches the application workflow in README Module 6.
 */
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["DRAFT"] = "DRAFT";
    ApplicationStatus["SUBMITTED"] = "SUBMITTED";
    ApplicationStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    ApplicationStatus["ADDITIONAL_INFO_REQUIRED"] = "ADDITIONAL_INFO_REQUIRED";
    ApplicationStatus["SHORTLISTED"] = "SHORTLISTED";
    ApplicationStatus["REJECTED"] = "REJECTED";
    ApplicationStatus["SELECTED"] = "SELECTED";
    ApplicationStatus["PILOT_STAGE"] = "PILOT_STAGE";
    ApplicationStatus["COMPLETED"] = "COMPLETED";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
/**
 * Pilot project lifecycle status.
 * Matches the pilot lifecycle in Architecture.md section 14.
 */
var PilotStatus;
(function (PilotStatus) {
    PilotStatus["PLANNING"] = "PLANNING";
    PilotStatus["APPROVED"] = "APPROVED";
    PilotStatus["IN_PROGRESS"] = "IN_PROGRESS";
    PilotStatus["PAUSED"] = "PAUSED";
    PilotStatus["COMPLETED"] = "COMPLETED";
    PilotStatus["FAILED"] = "FAILED";
    PilotStatus["CANCELLED"] = "CANCELLED";
})(PilotStatus || (exports.PilotStatus = PilotStatus = {}));
/**
 * Procurement workflow status.
 */
var ProcurementStatus;
(function (ProcurementStatus) {
    ProcurementStatus["PENDING"] = "PENDING";
    ProcurementStatus["COMPLIANCE_REVIEW"] = "COMPLIANCE_REVIEW";
    ProcurementStatus["DOCUMENTATION"] = "DOCUMENTATION";
    ProcurementStatus["APPROVAL"] = "APPROVAL";
    ProcurementStatus["CONTRACTING"] = "CONTRACTING";
    ProcurementStatus["IMPLEMENTATION"] = "IMPLEMENTATION";
    ProcurementStatus["COMPLETED"] = "COMPLETED";
    ProcurementStatus["CANCELLED"] = "CANCELLED";
})(ProcurementStatus || (exports.ProcurementStatus = ProcurementStatus = {}));
/**
 * Notification types for the notification service.
 */
var NotificationType;
(function (NotificationType) {
    NotificationType["CHALLENGE_PUBLISHED"] = "CHALLENGE_PUBLISHED";
    NotificationType["APPLICATION_STATUS_CHANGED"] = "APPLICATION_STATUS_CHANGED";
    NotificationType["EVALUATION_ASSIGNED"] = "EVALUATION_ASSIGNED";
    NotificationType["EVALUATION_SUBMITTED"] = "EVALUATION_SUBMITTED";
    NotificationType["PILOT_STARTED"] = "PILOT_STARTED";
    NotificationType["PILOT_MILESTONE_DUE"] = "PILOT_MILESTONE_DUE";
    NotificationType["PILOT_COMPLETED"] = "PILOT_COMPLETED";
    NotificationType["PROCUREMENT_INITIATED"] = "PROCUREMENT_INITIATED";
    NotificationType["DOCUMENT_REQUESTED"] = "DOCUMENT_REQUESTED";
    NotificationType["DEADLINE_REMINDER"] = "DEADLINE_REMINDER";
    NotificationType["MATCH_FOUND"] = "MATCH_FOUND";
    NotificationType["GENERAL"] = "GENERAL";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
/**
 * Organization types on the platform.
 */
var OrganizationType;
(function (OrganizationType) {
    OrganizationType["GOVERNMENT"] = "GOVERNMENT";
    OrganizationType["STARTUP"] = "STARTUP";
    OrganizationType["RESEARCH"] = "RESEARCH";
    OrganizationType["NGO"] = "NGO";
})(OrganizationType || (exports.OrganizationType = OrganizationType = {}));
/**
 * Document categories for file management.
 */
var DocumentCategory;
(function (DocumentCategory) {
    DocumentCategory["STARTUP_PROFILE"] = "STARTUP_PROFILE";
    DocumentCategory["CERTIFICATION"] = "CERTIFICATION";
    DocumentCategory["TECHNICAL_PROPOSAL"] = "TECHNICAL_PROPOSAL";
    DocumentCategory["FINANCIAL_DOCUMENT"] = "FINANCIAL_DOCUMENT";
    DocumentCategory["PILOT_REPORT"] = "PILOT_REPORT";
    DocumentCategory["PROCUREMENT_DOCUMENT"] = "PROCUREMENT_DOCUMENT";
    DocumentCategory["CASE_STUDY"] = "CASE_STUDY";
    DocumentCategory["OTHER"] = "OTHER";
})(DocumentCategory || (exports.DocumentCategory = DocumentCategory = {}));
/**
 * Technology Readiness Levels (TRL) for startup solutions.
 * Based on the standard EU/NASA TRL scale.
 */
var TechnologyReadinessLevel;
(function (TechnologyReadinessLevel) {
    TechnologyReadinessLevel["TRL_1"] = "TRL_1";
    TechnologyReadinessLevel["TRL_2"] = "TRL_2";
    TechnologyReadinessLevel["TRL_3"] = "TRL_3";
    TechnologyReadinessLevel["TRL_4"] = "TRL_4";
    TechnologyReadinessLevel["TRL_5"] = "TRL_5";
    TechnologyReadinessLevel["TRL_6"] = "TRL_6";
    TechnologyReadinessLevel["TRL_7"] = "TRL_7";
    TechnologyReadinessLevel["TRL_8"] = "TRL_8";
    TechnologyReadinessLevel["TRL_9"] = "TRL_9";
})(TechnologyReadinessLevel || (exports.TechnologyReadinessLevel = TechnologyReadinessLevel = {}));
/**
 * Funding stages for startup organizations.
 */
var FundingStage;
(function (FundingStage) {
    FundingStage["BOOTSTRAPPED"] = "BOOTSTRAPPED";
    FundingStage["PRE_SEED"] = "PRE_SEED";
    FundingStage["SEED"] = "SEED";
    FundingStage["SERIES_A"] = "SERIES_A";
    FundingStage["SERIES_B"] = "SERIES_B";
    FundingStage["SERIES_C_PLUS"] = "SERIES_C_PLUS";
    FundingStage["PROFITABLE"] = "PROFITABLE";
    FundingStage["LISTED"] = "LISTED";
})(FundingStage || (exports.FundingStage = FundingStage = {}));
/**
 * Audit log action types.
 */
var AuditAction;
(function (AuditAction) {
    // Challenge actions
    AuditAction["CHALLENGE_CREATED"] = "CHALLENGE_CREATED";
    AuditAction["CHALLENGE_UPDATED"] = "CHALLENGE_UPDATED";
    AuditAction["CHALLENGE_PUBLISHED"] = "CHALLENGE_PUBLISHED";
    AuditAction["CHALLENGE_CANCELLED"] = "CHALLENGE_CANCELLED";
    // Application actions
    AuditAction["APPLICATION_SUBMITTED"] = "APPLICATION_SUBMITTED";
    AuditAction["APPLICATION_STATUS_CHANGED"] = "APPLICATION_STATUS_CHANGED";
    // Evaluation actions
    AuditAction["EVALUATION_ASSIGNED"] = "EVALUATION_ASSIGNED";
    AuditAction["EVALUATION_SUBMITTED"] = "EVALUATION_SUBMITTED";
    AuditAction["EVALUATION_SCORE_MODIFIED"] = "EVALUATION_SCORE_MODIFIED";
    // Pilot actions
    AuditAction["PILOT_CREATED"] = "PILOT_CREATED";
    AuditAction["PILOT_APPROVED"] = "PILOT_APPROVED";
    AuditAction["PILOT_COMPLETED"] = "PILOT_COMPLETED";
    // Procurement actions
    AuditAction["PROCUREMENT_INITIATED"] = "PROCUREMENT_INITIATED";
    AuditAction["PROCUREMENT_APPROVED"] = "PROCUREMENT_APPROVED";
    // User / Auth actions
    AuditAction["USER_REGISTERED"] = "USER_REGISTERED";
    AuditAction["USER_LOGIN"] = "USER_LOGIN";
    AuditAction["USER_ROLE_CHANGED"] = "USER_ROLE_CHANGED";
    AuditAction["USER_DISABLED"] = "USER_DISABLED";
    // AI actions
    AuditAction["AI_MATCHING_TRIGGERED"] = "AI_MATCHING_TRIGGERED";
    AuditAction["AI_RECOMMENDATION_GENERATED"] = "AI_RECOMMENDATION_GENERATED";
    // Document actions
    AuditAction["DOCUMENT_UPLOADED"] = "DOCUMENT_UPLOADED";
    AuditAction["DOCUMENT_DELETED"] = "DOCUMENT_DELETED";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
