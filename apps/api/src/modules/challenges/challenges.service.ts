import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
  CreateChallengeDto,
  UpdateChallengeDto,
  ChallengeQueryDto,
} from './dto/challenge.dto';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';
import { ChallengeStatus, AuditAction } from '../../common/enums/platform.enum';

function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 200) +
    '-' +
    Date.now().toString(36)
  );
}

// Allowed status transitions for the challenge lifecycle
const ALLOWED_TRANSITIONS: Record<ChallengeStatus, ChallengeStatus[]> = {
  [ChallengeStatus.DRAFT]: [ChallengeStatus.INTERNAL_REVIEW, ChallengeStatus.CANCELLED],
  [ChallengeStatus.INTERNAL_REVIEW]: [ChallengeStatus.APPROVED, ChallengeStatus.DRAFT],
  [ChallengeStatus.APPROVED]: [ChallengeStatus.PUBLISHED, ChallengeStatus.DRAFT],
  [ChallengeStatus.PUBLISHED]: [ChallengeStatus.STARTUP_DISCOVERY, ChallengeStatus.CANCELLED],
  [ChallengeStatus.STARTUP_DISCOVERY]: [ChallengeStatus.EVALUATION],
  [ChallengeStatus.EVALUATION]: [ChallengeStatus.PILOT],
  [ChallengeStatus.PILOT]: [ChallengeStatus.PROCUREMENT, ChallengeStatus.EVALUATION],
  [ChallengeStatus.PROCUREMENT]: [ChallengeStatus.COMPLETED],
  [ChallengeStatus.COMPLETED]: [],
  [ChallengeStatus.CANCELLED]: [],
};

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateChallengeDto, user: JwtPayload) {
    if (
      ![UserRole.GOVERNMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)
    ) {
      throw new ForbiddenException('Only government officers can create challenges');
    }

    if (!user.organizationId) {
      throw new BadRequestException(
        'You must belong to a government organization to create challenges',
      );
    }

    const slug = generateSlug(dto.title);

    const challenge = await this.prisma.challenge.create({
      data: {
        organizationId: user.organizationId,
        createdById: user.sub,
        title: dto.title,
        slug,
        description: dto.description,
        problemStatement: dto.problemStatement,
        desiredOutcome: dto.desiredOutcome,
        existingApproach: dto.existingApproach,
        sector: dto.sector,
        domain: dto.domain,
        location: dto.location,
        state: dto.state,
        targetBeneficiaries: dto.targetBeneficiaries,
        technicalRequirements: dto.technicalRequirements,
        functionalRequirements: dto.functionalRequirements,
        constraints: dto.constraints,
        eligibilityCriteria: dto.eligibilityCriteria,
        budgetMinLakh: dto.budgetMinLakh,
        budgetMaxLakh: dto.budgetMaxLakh,
        pilotDurationDays: dto.pilotDurationDays,
        submissionDeadline: dto.submissionDeadline
          ? new Date(dto.submissionDeadline)
          : undefined,
        evaluationCriteria: dto.evaluationCriteria ?? undefined,
        status: ChallengeStatus.DRAFT,
      },
      include: { organization: { select: { id: true, name: true } }, createdBy: { select: { id: true, firstName: true, lastName: true } } },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: user.sub,
        action: AuditAction.CHALLENGE_CREATED,
        entityType: 'Challenge',
        entityId: challenge.id,
        challengeId: challenge.id,
        newValue: { title: challenge.title, status: challenge.status },
      },
    });

    this.logger.log(`Challenge created: "${challenge.title}" by ${user.email}`);
    return challenge;
  }

  async findAll(query: ChallengeQueryDto, user: JwtPayload) {
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(50, parseInt(query.limit ?? '20', 10));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    // Non-admin users only see their org's challenges + published challenges
    if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
      if (user.role === UserRole.STARTUP_USER) {
        // Startups only see published challenges
        where.status = ChallengeStatus.PUBLISHED;
      } else if (user.organizationId) {
        // Government users see their org's challenges
        where.organizationId = user.organizationId;
      }
    }

    if (query.status) where.status = query.status;
    if (query.sector) where.sector = { contains: query.sector, mode: 'insensitive' };
    if (query.state) where.state = { contains: query.state, mode: 'insensitive' };
    if (query.organizationId) where.organizationId = query.organizationId;

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { problemStatement: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [challenges, total] = await Promise.all([
      this.prisma.challenge.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          organization: { select: { id: true, name: true, logoUrl: true } },
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          _count: { select: { applications: true } },
        },
      }),
      this.prisma.challenge.count({ where }),
    ]);

    return {
      data: challenges,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, user: JwtPayload) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
      include: {
        organization: { select: { id: true, name: true, type: true, logoUrl: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        _count: { select: { applications: true } },
      },
    });

    if (!challenge) throw new NotFoundException(`Challenge ${id} not found`);

    // Startup users can only view published challenges
    if (
      user.role === UserRole.STARTUP_USER &&
      challenge.status !== ChallengeStatus.PUBLISHED
    ) {
      throw new ForbiddenException('This challenge is not publicly available');
    }

    return challenge;
  }

  async update(id: string, dto: UpdateChallengeDto, user: JwtPayload) {
    const challenge = await this.findOne(id, user);

    // Only the creating org or admins can edit
    this.assertOwnerOrAdmin(challenge, user);

    // Cannot edit published or completed challenges
    if ([ChallengeStatus.COMPLETED, ChallengeStatus.CANCELLED].includes(challenge.status as ChallengeStatus)) {
      throw new BadRequestException('Cannot edit a completed or cancelled challenge');
    }

    const updated = await this.prisma.challenge.update({
      where: { id },
      data: {
        ...dto,
        submissionDeadline: dto.submissionDeadline
          ? new Date(dto.submissionDeadline)
          : undefined,
        evaluationCriteria: dto.evaluationCriteria ?? undefined,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: user.sub,
        action: AuditAction.CHALLENGE_UPDATED,
        entityType: 'Challenge',
        entityId: id,
        challengeId: id,
        previousValue: { title: challenge.title, status: challenge.status },
        newValue: { title: updated.title, ...dto },
      },
    });

    return updated;
  }

  async transition(id: string, targetStatus: ChallengeStatus, user: JwtPayload) {
    const challenge = await this.findOne(id, user);
    this.assertOwnerOrAdmin(challenge, user);

    const current = challenge.status as ChallengeStatus;
    const allowed = ALLOWED_TRANSITIONS[current] ?? [];

    if (!allowed.includes(targetStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${current} to ${targetStatus}. Allowed: [${allowed.join(', ')}]`,
      );
    }

    const data: Record<string, unknown> = { status: targetStatus };
    if (targetStatus === ChallengeStatus.PUBLISHED) {
      data.publishedAt = new Date();
    }
    if (targetStatus === ChallengeStatus.COMPLETED) {
      data.completedAt = new Date();
    }

    const updated = await this.prisma.challenge.update({ where: { id }, data });

    const action =
      targetStatus === ChallengeStatus.PUBLISHED
        ? AuditAction.CHALLENGE_PUBLISHED
        : targetStatus === ChallengeStatus.CANCELLED
        ? AuditAction.CHALLENGE_CANCELLED
        : AuditAction.CHALLENGE_UPDATED;

    await this.prisma.auditLog.create({
      data: {
        actorId: user.sub,
        action,
        entityType: 'Challenge',
        entityId: id,
        challengeId: id,
        previousValue: { status: current },
        newValue: { status: targetStatus },
      },
    });

    this.logger.log(`Challenge ${id} transitioned: ${current} → ${targetStatus}`);
    return updated;
  }

  async getStatsByOrg(organizationId: string) {
    const [total, byStatus] = await Promise.all([
      this.prisma.challenge.count({ where: { organizationId } }),
      this.prisma.challenge.groupBy({
        by: ['status'],
        where: { organizationId },
        _count: { status: true },
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce(
        (acc, cur) => ({ ...acc, [cur.status]: cur._count.status }),
        {} as Record<string, number>,
      ),
    };
  }

  private assertOwnerOrAdmin(challenge: { organizationId: string }, user: JwtPayload) {
    if (
      [UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(user.role)
    ) return;

    if (user.organizationId !== challenge.organizationId) {
      throw new ForbiddenException('You can only manage challenges in your own organization');
    }
  }
}
