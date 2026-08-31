import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../types/request.types';

/**
 * Parameter decorator to extract the authenticated user from the request.
 *
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: JwtPayload) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof RequestWithUser['user'] | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // If a specific field is requested, return just that field
    return data ? user?.[data] : user;
  },
);
