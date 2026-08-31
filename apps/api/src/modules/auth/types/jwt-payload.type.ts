import { UserRole } from '../../../common/enums/user-role.enum';

/**
 * The decoded JWT payload attached to `request.user` after token validation.
 */
export interface JwtPayload {
  sub: string;          // User ID (UUID)
  email: string;
  role: UserRole;
  organizationId: string | null;
  iat?: number;         // Issued at
  exp?: number;         // Expiry
}
