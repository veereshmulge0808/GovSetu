import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { UpdateUserDto, UpdateUserRoleDto, UserQueryDto } from './dto/user.dto';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';
import { AuditAction } from '../../common/enums/platform.enum';

// Fields to return for a user — never expose password hash
const USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  avatarUrl: true,
  role: true,
  isEmailVerified: true,
  isActive: true,
  lastLoginAt: true,
  organizationId: true,
  organization: {
    select: { id: true, name: true, type: true, logoUrl: true },
  },
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: UserQueryDto, requestor: JwtPayload) {
    // Only admins can list all users
    if (![UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(requestor.role)) {
      throw new ForbiddenException('Only administrators can list all users');
    }

    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(100, parseInt(query.limit ?? '20', 10));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.role) where.role = query.role;
    if (query.organizationId) where.organizationId = query.organizationId;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({ where, select: USER_SELECT, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async getMyProfile(userId: string) {
    return this.findOne(userId);
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    await this.findOne(userId); // ensures user exists

    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: USER_SELECT,
    });
  }

  async updateRole(id: string, dto: UpdateUserRoleDto, requestor: JwtPayload) {
    if (![UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(requestor.role)) {
      throw new ForbiddenException('Only administrators can change user roles');
    }

    const user = await this.findOne(id);

    const updated = await this.prisma.user.update({
      where: { id },
      data: { role: dto.role, organizationId: dto.organizationId },
      select: USER_SELECT,
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: requestor.sub,
        action: AuditAction.USER_ROLE_CHANGED,
        entityType: 'User',
        entityId: id,
        previousValue: { role: user.role },
        newValue: { role: dto.role, organizationId: dto.organizationId },
      },
    });

    return updated;
  }

  async deactivateUser(id: string, requestor: JwtPayload) {
    if (![UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(requestor.role)) {
      throw new ForbiddenException('Only administrators can deactivate users');
    }

    if (id === requestor.sub) {
      throw new ForbiddenException('You cannot deactivate your own account');
    }

    const user = await this.findOne(id);

    await this.prisma.user.update({ where: { id }, data: { isActive: false } });

    await this.prisma.auditLog.create({
      data: {
        actorId: requestor.sub,
        action: AuditAction.USER_DISABLED,
        entityType: 'User',
        entityId: id,
        previousValue: { isActive: true },
        newValue: { isActive: false },
      },
    });

    return { message: `User ${user.email} has been deactivated` };
  }
}
