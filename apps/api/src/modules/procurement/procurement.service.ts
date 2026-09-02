import {
  Injectable, NotFoundException, ForbiddenException,
  BadRequestException, Logger,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class ProcurementService {
  private readonly logger = new Logger(ProcurementService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Initiate procurement from a completed pilot */
  async initiate(dto: any, user: JwtPayload) {
    if (![UserRole.GOVERNMENT_OFFICER, UserRole.PROCUREMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
      throw new ForbiddenException('Only procurement officers can initiate procurement');
    }

    const pilot = await this.prisma.pilot.findUnique({ where: { id: dto.pilotId } });
    if (!pilot) throw new NotFoundException('Pilot not found');
    if (pilot.status !== 'COMPLETED') {
      throw new BadRequestException('Procurement can only be initiated after a pilot is COMPLETED');
    }

    // Check no existing procurement for this pilot
    const existing = await this.prisma.procurement.findUnique({ where: { pilotId: dto.pilotId } });
    if (existing) throw new BadRequestException('Procurement already exists for this pilot');

    const procurement = await this.prisma.procurement.create({
      data: {
        pilotId: dto.pilotId,
        status: 'PENDING' as any,
        contractValueLakh: dto.contractValueLakh ?? dto.estimatedValueLakh,
        contractDuration: dto.contractDuration,
        complianceNotes: dto.complianceNotes,
        procurementOfficerNotes: dto.notes,
      },
      include: {
        pilot: {
          include: {
            challenge: { select: { id: true, title: true } },
            application: {
              include: {
                startupProfile: {
                  include: { organization: { select: { id: true, name: true } } },
                },
              },
            },
          },
        },
      },
    });

    // Transition challenge to PROCUREMENT status
    await this.prisma.challenge.update({
      where: { id: pilot.challengeId },
      data: { status: 'PROCUREMENT' as any },
    }).catch(() => null);

    this.logger.log(`Procurement initiated: ${procurement.id} for pilot ${dto.pilotId}`);
    return procurement;
  }

  async findAll(query: any, user: JwtPayload) {
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(50, parseInt(query.limit ?? '20', 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;

    const [procurements, total] = await Promise.all([
      this.prisma.procurement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          pilot: {
            include: {
              challenge: { select: { id: true, title: true } },
              application: {
                include: {
                  startupProfile: {
                    include: { organization: { select: { id: true, name: true } } },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.procurement.count({ where }),
    ]);

    return { data: procurements, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const procurement = await this.prisma.procurement.findUnique({
      where: { id },
      include: {
        pilot: {
          include: {
            challenge: { include: { organization: { select: { id: true, name: true } } } },
            application: {
              include: {
                startupProfile: { include: { organization: true } },
              },
            },
          },
        },
        documents: true,
      },
    });
    if (!procurement) throw new NotFoundException(`Procurement ${id} not found`);
    return procurement;
  }

  async updateStatus(id: string, status: string, user: JwtPayload) {
    const procurement = await this.findOne(id);

    if (![UserRole.PROCUREMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
      throw new ForbiddenException('Only procurement officers can update procurement status');
    }

    const VALID_STATUSES = [
      'PENDING', 'DOCUMENT_REVIEW', 'LEGAL_REVIEW',
      'FINANCE_REVIEW', 'APPROVED', 'CONTRACT_SIGNED', 'COMPLETED', 'CANCELLED',
    ];
    if (!VALID_STATUSES.includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    const data: any = { status };
    if (status === 'APPROVED') data.approvedAt = new Date();
    if (status === 'CONTRACT_SIGNED') data.contractSignedAt = new Date();
    if (status === 'COMPLETED') {
      // Transition challenge to COMPLETED
      await this.prisma.challenge.update({
        where: { id: procurement.pilot.challengeId },
        data: { status: 'COMPLETED' as any, completedAt: new Date() },
      }).catch(() => null);
    }

    return this.prisma.procurement.update({ where: { id }, data });
  }

  async getStats(_user: JwtPayload) {
    const [total, byStatus] = await Promise.all([
      this.prisma.procurement.count(),
      this.prisma.procurement.groupBy({
        by: ['status'],
        _count: { status: true },
        _sum: { contractValueLakh: true },
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce(
        (acc: any, cur: any) => ({
          ...acc,
          [cur.status]: {
            count: cur._count.status,
            totalValueLakh: cur._sum.contractValueLakh ?? 0,
          },
        }),
        {},
      ),
    };
  }
}
