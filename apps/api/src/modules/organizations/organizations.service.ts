import {
  Injectable, NotFoundException, ForbiddenException,
  ConflictException, Logger,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto, OrganizationQueryDto } from './dto/organization.dto';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
}

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto, user: JwtPayload) {
    const existing = await this.prisma.organization.findFirst({
      where: { name: { equals: dto.name, mode: 'insensitive' } },
    });
    if (existing) throw new ConflictException(`Organization "${dto.name}" already exists`);

    const org = await this.prisma.organization.create({
      data: {
        name: dto.name,
        slug: generateSlug(dto.name),
        type: dto.type as any,
        description: dto.description,
        website: dto.website,
        state: dto.state,
        city: dto.city,
        pincode: dto.pincode,
      },
    });

    this.logger.log(`Organization created: ${org.name} by ${user.email}`);
    return org;
  }

  async findAll(query: OrganizationQueryDto) {
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(50, parseInt(query.limit ?? '20', 10));
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (query.type) where.type = query.type;
    if (query.state) where.state = { contains: query.state, mode: 'insensitive' };
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [orgs, total] = await Promise.all([
      this.prisma.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: { _count: { select: { users: true, challenges: true } } },
      }),
      this.prisma.organization.count({ where }),
    ]);

    return { data: orgs, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        users: {
          select: { id: true, firstName: true, lastName: true, email: true, role: true },
          take: 10,
        },
        _count: { select: { users: true, challenges: true } },
      },
    });
    if (!org) throw new NotFoundException(`Organization ${id} not found`);
    return org;
  }

  async update(id: string, dto: UpdateOrganizationDto, user: JwtPayload) {
    await this.findOne(id);

    if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role) &&
        user.organizationId !== id) {
      throw new ForbiddenException('You can only update your own organization');
    }

    return this.prisma.organization.update({
      where: { id },
      data: dto as any,
    });
  }

  async deactivate(id: string, user: JwtPayload) {
    if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
      throw new ForbiddenException('Only admins can deactivate organizations');
    }
    await this.findOne(id);
    return this.prisma.organization.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getStats(id: string) {
    await this.findOne(id);

    const [challengeStats, userCount] = await Promise.all([
      this.prisma.challenge.groupBy({
        by: ['status'],
        where: { organizationId: id },
        _count: { status: true },
      }),
      this.prisma.user.count({ where: { organizationId: id, isActive: true } }),
    ]);

    return {
      organizationId: id,
      users: userCount,
      challenges: {
        byStatus: challengeStats.reduce(
          (acc: any, cur: any) => ({ ...acc, [cur.status]: cur._count.status }),
          {},
        ),
        total: challengeStats.reduce((sum: number, cur: any) => sum + cur._count.status, 0),
      },
    };
  }
}
