import {
  Injectable, NotFoundException, ForbiddenException,
  BadRequestException, ConflictException, Logger,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
  CreateApplicationDto, UpdateApplicationDto,
  ApplicationQueryDto, ApplicationStatus,
} from './dto/application.dto';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';
import { AuditAction } from '../../common/enums/platform.enum';

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['UNDER_REVIEW', 'REJECTED'],
  UNDER_REVIEW: ['ADDITIONAL_INFO_REQUIRED', 'SHORTLISTED', 'REJECTED'],
  ADDITIONAL_INFO_REQUIRED: ['UNDER_REVIEW', 'REJECTED'],
  SHORTLISTED: ['SELECTED', 'REJECTED'],
  SELECTED: ['PILOT_STAGE'],
  PILOT_STAGE: ['COMPLETED'],
  REJECTED: [],
  COMPLETED: [],
};

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateApplicationDto, user: JwtPayload) {
    if (user.role !== UserRole.STARTUP_USER) {
      throw new ForbiddenException('Only startup users can submit applications');
    }

    const challenge = await this.prisma.challenge.findUnique({ where: { id: dto.challengeId } });
    if (!challenge) throw new NotFoundException('Challenge not found');
    if (challenge.status !== 'PUBLISHED') {
      throw new BadRequestException('Applications can only be submitted to published challenges');
    }
    if (challenge.submissionDeadline && new Date() > new Date(challenge.submissionDeadline)) {
      throw new BadRequestException('The submission deadline has passed');
    }

    const startupProfile = await this.prisma.startupProfile.findUnique({
      where: { id: dto.startupProfileId },
    });
    if (!startupProfile) throw new NotFoundException('Startup profile not found');
    if (startupProfile.organizationId !== user.organizationId) {
      throw new ForbiddenException('You can only apply with your own startup profile');
    }

    const existing = await this.prisma.application.findFirst({
      where: { challengeId: dto.challengeId, startupProfileId: dto.startupProfileId },
    });
    if (existing) throw new ConflictException('You have already applied to this challenge');

    const application = await this.prisma.application.create({
      data: {
        challengeId: dto.challengeId,
        startupProfileId: dto.startupProfileId,
        applicantUserId: user.sub,
        executiveSummary: dto.executiveSummary,
        technicalApproach: dto.technicalApproach,
        implementationPlan: dto.implementationPlan,
        teamDescription: dto.teamExperience,
        previousExperience: dto.proofOfConcept,
        proposedBudgetLakh: dto.proposedBudget ? parseFloat(dto.proposedBudget) : undefined,
        proposedTimeline: dto.timeline,
        status: ApplicationStatus.DRAFT,
      },
      include: {
        challenge: { select: { id: true, title: true } },
        startupProfile: { select: { id: true } },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: user.sub,
        action: AuditAction.APPLICATION_SUBMITTED as any,
        entityType: 'Application',
        entityId: application.id,
        challengeId: dto.challengeId,
        newValue: { challengeId: dto.challengeId, status: ApplicationStatus.DRAFT } as any,
      },
    });

    this.logger.log(`Application created: ${application.id}`);
    return application;
  }

  async findAll(query: ApplicationQueryDto, user: JwtPayload) {
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(50, parseInt(query.limit ?? '20', 10));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (user.role === UserRole.STARTUP_USER) {
      const profiles = await this.prisma.startupProfile.findMany({
        where: { organizationId: user.organizationId ?? undefined },
        select: { id: true },
      });
      where.startupProfileId = { in: profiles.map((p: any) => p.id) };
    } else if ([UserRole.GOVERNMENT_OFFICER, UserRole.PILOT_MANAGER].includes(user.role)) {
      where.challenge = { organizationId: user.organizationId };
    }

    if (query.status) where.status = query.status;
    if (query.challengeId) where.challengeId = query.challengeId;
    if (query.startupProfileId) where.startupProfileId = query.startupProfileId;

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { submittedAt: 'desc' },
        include: {
          challenge: { select: { id: true, title: true, status: true } },
          startupProfile: {
            include: { organization: { select: { id: true, name: true, logoUrl: true } } },
          },
          _count: { select: { evaluatorAssignments: true } },
        },
      }),
      this.prisma.application.count({ where }),
    ]);

    return { data: applications, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, user: JwtPayload) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        challenge: { include: { organization: { select: { id: true, name: true } } } },
        startupProfile: {
          include: { organization: { select: { id: true, name: true, logoUrl: true } } },
        },
        evaluatorAssignments: {
          include: { evaluator: { select: { id: true, firstName: true, lastName: true } } },
        },
        documents: true,
      },
    });

    if (!application) throw new NotFoundException(`Application ${id} not found`);

    if (user.role === UserRole.STARTUP_USER) {
      const profiles = await this.prisma.startupProfile.findMany({
        where: { organizationId: user.organizationId ?? undefined },
        select: { id: true },
      });
      if (!profiles.some((p: any) => p.id === application.startupProfileId)) {
        throw new ForbiddenException('You can only view your own applications');
      }
    }

    return application;
  }

  async update(id: string, dto: UpdateApplicationDto, user: JwtPayload) {
    const application = await this.findOne(id, user);

    if (application.status !== ApplicationStatus.DRAFT &&
        application.status !== ApplicationStatus.ADDITIONAL_INFO_REQUIRED) {
      throw new BadRequestException('Applications can only be edited in DRAFT or ADDITIONAL_INFO_REQUIRED status');
    }

    return this.prisma.application.update({ where: { id }, data: dto as any });
  }

  async submit(id: string, user: JwtPayload) {
    return this.transition(id, ApplicationStatus.SUBMITTED, user);
  }

  async transition(id: string, targetStatus: ApplicationStatus, user: JwtPayload) {
    const application = await this.findOne(id, user);
    const current = application.status as string;
    const allowed = ALLOWED_TRANSITIONS[current] ?? [];

    if (!allowed.includes(targetStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${current} to ${targetStatus}. Allowed: [${allowed.join(', ')}]`,
      );
    }

    const data: any = { status: targetStatus };
    if (targetStatus === ApplicationStatus.SUBMITTED) data.submittedAt = new Date();
    if (targetStatus === ApplicationStatus.SHORTLISTED) data.shortlistedAt = new Date();
    if (targetStatus === ApplicationStatus.UNDER_REVIEW) data.reviewedAt = new Date();

    const updated = await this.prisma.application.update({ where: { id }, data });

    await this.prisma.auditLog.create({
      data: {
        actorId: user.sub,
        action: AuditAction.APPLICATION_STATUS_CHANGED as any,
        entityType: 'Application',
        entityId: id,
        challengeId: application.challengeId,
        previousValue: { status: current } as any,
        newValue: { status: targetStatus } as any,
      },
    });

    return updated;
  }

  async getApplicationsByChallenge(challengeId: string, user: JwtPayload) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundException('Challenge not found');

    if (![UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EVALUATOR].includes(user.role) &&
        challenge.organizationId !== user.organizationId) {
      throw new ForbiddenException('You can only view applications for your own challenges');
    }

    return this.prisma.application.findMany({
      where: { challengeId },
      orderBy: { submittedAt: 'desc' },
      include: {
        startupProfile: {
          include: { organization: { select: { id: true, name: true, logoUrl: true } } },
        },
        _count: { select: { evaluatorAssignments: true } },
      },
    });
  }
}
