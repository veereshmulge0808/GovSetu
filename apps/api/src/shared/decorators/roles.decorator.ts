import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../common/enums/user-role.enum';

export const ROLES_KEY = 'roles';

/**
 * Decorator that marks a route as accessible only to the specified roles.
 *
 * @example
 * @Roles(UserRole.GOVERNMENT_OFFICER, UserRole.ADMIN)
 * @Get('challenges')
 * findAll() { ... }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
