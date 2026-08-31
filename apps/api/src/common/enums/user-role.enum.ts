/**
 * All user roles supported by the GovSetu platform.
 * Roles determine what routes and data a user can access.
 */
export enum UserRole {
  /** Full platform access — manages users, config, audit */
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',

  /** Government department users — create challenges, manage pilots */
  GOVERNMENT_OFFICER = 'GOVERNMENT_OFFICER',
  PILOT_MANAGER = 'PILOT_MANAGER',
  PROCUREMENT_OFFICER = 'PROCUREMENT_OFFICER',

  /** External experts — score and evaluate startup applications */
  EVALUATOR = 'EVALUATOR',

  /** Startup company users — register profiles and apply to challenges */
  STARTUP_USER = 'STARTUP_USER',
}
