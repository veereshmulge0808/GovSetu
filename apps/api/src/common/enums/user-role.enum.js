"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
/**
 * All user roles supported by the GovSetu platform.
 * Roles determine what routes and data a user can access.
 */
var UserRole;
(function (UserRole) {
    /** Full platform access — manages users, config, audit */
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    /** Government department users — create challenges, manage pilots */
    UserRole["GOVERNMENT_OFFICER"] = "GOVERNMENT_OFFICER";
    UserRole["PILOT_MANAGER"] = "PILOT_MANAGER";
    UserRole["PROCUREMENT_OFFICER"] = "PROCUREMENT_OFFICER";
    /** External experts — score and evaluate startup applications */
    UserRole["EVALUATOR"] = "EVALUATOR";
    /** Startup company users — register profiles and apply to challenges */
    UserRole["STARTUP_USER"] = "STARTUP_USER";
})(UserRole || (exports.UserRole = UserRole = {}));
