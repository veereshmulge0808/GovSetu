import { Request } from 'express';
import { JwtPayload } from '../../modules/auth/types/jwt-payload.type';

/**
 * Extends the Express Request type to include the authenticated user,
 * which is attached by Passport after successful JWT validation.
 */
export interface RequestWithUser extends Request {
  user: JwtPayload;
}
