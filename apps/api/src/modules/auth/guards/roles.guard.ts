import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { RequestWithUser } from '../../../shared/types/request.types';

/**
 * RBAC guard: checks that the authenticated user has at least one of the
 * roles specified on the route via the @Roles() decorator.
 *
 * SUPER_ADMIN and ADMIN bypass all role checks.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no role requirement is set, allow all authenticated users
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    if (!user) {
      throw new ForbiddenException('Access denied: no authenticated user');
    }

    // Super admins and admins bypass all role restrictions
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
      return true;
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied: this endpoint requires one of [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
