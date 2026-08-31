import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtPayload } from '../auth/types/jwt-payload.type';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    user: JwtPayload,
    filters: { entityType?: string; entityId?: string; actorId?: string; page?: string; limit?: string },
  ) {
    const page = Math.max(1, parseInt(filters.page ?? '1', 10));
    const limit = Math.min(100, parseInt(filters.limit ?? '50', 10));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (filters.entityType) where.entityType = filters.entityType;
    if (filters.entityId) where.entityId = filters.entityId;
    if (filters.actorId) where.actorId = filters.actorId;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: { select: { id: true, email: true, firstName: true, lastName: true, role: true } },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
