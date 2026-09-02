import {
  Injectable, NotFoundException, ForbiddenException,
  BadRequestException, Logger,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class PilotsService {
  private readonly logger = new Logger(PilotsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any, user: JwtPayload) {
    if (![UserRole.GOVERNMENT_OFFICER, UserRole.PILOT_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
      throw new ForbiddenException('Only government officers or pilot managers can create pilots');
    }

    const application = await this.prisma.application.findUnique({
      where: { id: dto.applicationId },
      include: { challenge: true },
    });
    if (!application) throw new NotFoundException('Application not found');
    if (application.status !== 'SELECTED') {
      throw new BadRequestException('A pilot can only be created from a SELECTED application');
    }

    const pilot = await this.prisma.pilot.create({
      data: {
        challengeId: application.challengeId,
        applicationId: dto.applicationId,
        title: dto.title ?? `Pilot: ${application.challenge.title}`,
        objective: dto.objective ?? dto.description ?? 'To be defined',
        scope: dto.scope,
        successCriteria: dto.successCriteria,
        budgetApprovedLakh: dto.budgetLakh,
        plannedStartDate: dto.startDate ? new Date(dto.startDate) : undefined,
        plannedEndDate: dto.endDate ? new Date(dto.endDate) : undefined,
        status: 'PLANNING' as any,
      },
      include: {
        application: true,
        challenge: { select: { id: true, title: true } },
      },
    });

    await this.prisma.application.update({
      where: { id: dto.applicationId },
      data: { status: 'PILOT_STAGE' as any },
    });

    this.logger.log(`Pilot created: ${pilot.id}`);
    return pilot;
  }

  async findAll(query: any, user: JwtPayload) {
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(50, parseInt(query.limit ?? '20', 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (user.role === UserRole.STARTUP_USER) {
      const profiles = await this.prisma.startupProfile.findMany({
        where: { organizationId: user.organizationId ?? undefined },
        select: { id: true },
      });
      const profileIds = profiles.map((p: any) => p.id);
      // Find applications matching these profiles
      const apps = await this.prisma.application.findMany({
        where: { startupProfileId: { in: profileIds } },
        select: { id: true },
      });
      where.applicationId = { in: apps.map((a: any) => a.id) };
    } else if (user.role === UserRole.GOVERNMENT_OFFICER) {
      where.challenge = { organizationId: user.organizationId };
    }

    if (query.status) where.status = query.status;

    const [pilots, total] = await Promise.all([
      this.prisma.pilot.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          challenge: { select: { id: true, title: true } },
          application: {
            include: {
              startupProfile: {
                include: { organization: { select: { id: true, name: true, logoUrl: true } } },
              },
            },
          },
          _count: { select: { milestones: true, progressReports: true } },
        },
      }),
      this.prisma.pilot.count({ where }),
    ]);

    return { data: pilots, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, _user: JwtPayload) {
    const pilot = await this.prisma.pilot.findUnique({
      where: { id },
      include: {
        challenge: { include: { organization: { select: { id: true, name: true } } } },
        application: {
          include: {
            startupProfile: { include: { organization: { select: { id: true, name: true } } } },
          },
        },
        milestones: { orderBy: { dueDate: 'asc' } },
        kpis: true,
        progressReports: { orderBy: { submittedAt: 'desc' } },
      },
    });

    if (!pilot) throw new NotFoundException(`Pilot ${id} not found`);
    return pilot;
  }

  async updateStatus(id: string, status: string, user: JwtPayload) {
    await this.findOne(id, user);
    const VALID_STATUSES = ['PLANNING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'TERMINATED'];
    if (!VALID_STATUSES.includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    const data: any = { status };
    if (status === 'ACTIVE') data.actualStartDate = new Date();
    if (status === 'COMPLETED') data.actualEndDate = new Date();

    return this.prisma.pilot.update({ where: { id }, data });
  }

  async addMilestone(pilotId: string, dto: any, user: JwtPayload) {
    await this.findOne(pilotId, user);
    return this.prisma.pilotMilestone.create({
      data: {
        pilotId,
        title: dto.title,
        description: dto.description,
        dueDate: new Date(dto.dueDate),
      },
    });
  }

  async updateMilestone(milestoneId: string, dto: any, _user: JwtPayload) {
    const milestone = await this.prisma.pilotMilestone.findUnique({ where: { id: milestoneId } });
    if (!milestone) throw new NotFoundException('Milestone not found');

    return this.prisma.pilotMilestone.update({
      where: { id: milestoneId },
      data: {
        ...dto,
        completedAt: dto.isCompleted ? new Date() : undefined,
      },
    });
  }

  async addProgressReport(pilotId: string, dto: any, user: JwtPayload) {
    await this.findOne(pilotId, user);
    return this.prisma.pilotProgressReport.create({
      data: {
        pilotId,
        reportPeriod: dto.reportPeriod ?? `Report ${new Date().toLocaleDateString()}`,
        summary: dto.summary,
        achievements: dto.achievements,
        challenges: dto.challenges ?? dto.blockers,
        nextSteps: dto.nextSteps,
      },
    });
  }

  async addKPI(pilotId: string, dto: any, user: JwtPayload) {
    await this.findOne(pilotId, user);
    return this.prisma.pilotKPI.create({
      data: {
        pilotId,
        name: dto.name,
        description: dto.description,
        targetValue: dto.targetValue,
        unit: dto.unit,
      },
    });
  }

  async updateKPI(kpiId: string, currentValue: number, _user: JwtPayload) {
    return this.prisma.pilotKPI.update({
      where: { id: kpiId },
      data: { currentValue, updatedAt: new Date() },
    });
  }
}
