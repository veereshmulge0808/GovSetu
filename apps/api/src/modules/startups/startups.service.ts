import {
  Injectable, NotFoundException, ForbiddenException,
  ConflictException, Logger,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateStartupProfileDto, UpdateStartupProfileDto, StartupQueryDto } from './dto/startup.dto';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class StartupsService {
  private readonly logger = new Logger(StartupsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createProfile(dto: CreateStartupProfileDto, user: JwtPayload) {
    if (user.role !== UserRole.STARTUP_USER) {
      throw new ForbiddenException('Only startup users can create startup profiles');
    }
    if (!user.organizationId) {
      throw new ForbiddenException('You must belong to a startup organization');
    }

    const existing = await this.prisma.startupProfile.findUnique({
      where: { organizationId: user.organizationId },
    });
    if (existing) throw new ConflictException('Your organization already has a startup profile');

    const profile = await this.prisma.startupProfile.create({
      data: {
        organizationId: user.organizationId,
        foundingYear: dto.foundedYear,
        teamSize: dto.teamSize,
        fundingStage: dto.fundingStage as any,
        technologies: dto.technologies ?? [],
        industries: dto.industries ?? [],
        geographies: [],
        govtExperience: dto.govtExperience ?? false,
        prevGovtProjects: dto.govtProjectSummary,
        certifications: dto.certifications ?? [],
      },
      include: { organization: { select: { id: true, name: true } } },
    });

    this.logger.log(`Startup profile created for org ${user.organizationId}`);
    return profile;
  }

  async findAll(query: StartupQueryDto, user: JwtPayload) {
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(50, parseInt(query.limit ?? '20', 10));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (user.role === UserRole.STARTUP_USER) {
      where.organizationId = user.organizationId;
    }

    if (query.state) {
      where.organization = { state: { contains: query.state, mode: 'insensitive' } };
    }
    if (query.govtExperience === 'true') where.govtExperience = true;
    if (query.technology) where.technologies = { has: query.technology };
    if (query.industry) where.industries = { has: query.industry };

    if (query.search) {
      where.organization = {
        ...(where.organization ?? {}),
        name: { contains: query.search, mode: 'insensitive' },
      };
    }

    const [profiles, total] = await Promise.all([
      this.prisma.startupProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          organization: { select: { id: true, name: true, logoUrl: true, website: true, state: true } },
          _count: { select: { applications: true } },
        },
      }),
      this.prisma.startupProfile.count({ where }),
    ]);

    return { data: profiles, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string, user: JwtPayload) {
    const profile = await this.prisma.startupProfile.findUnique({
      where: { id },
      include: {
        organization: { select: { id: true, name: true, website: true, logoUrl: true, state: true, city: true, description: true } },
        solutions: true,
        _count: { select: { applications: true } },
      },
    });

    if (!profile) throw new NotFoundException(`Startup profile ${id} not found`);

    if (user.role === UserRole.STARTUP_USER && profile.organizationId !== user.organizationId) {
      throw new ForbiddenException('Profile not accessible');
    }

    return profile;
  }

  async updateProfile(id: string, dto: UpdateStartupProfileDto, user: JwtPayload) {
    const profile = await this.prisma.startupProfile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Startup profile not found');

    if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role) &&
        profile.organizationId !== user.organizationId) {
      throw new ForbiddenException('You can only update your own startup profile');
    }

    return this.prisma.startupProfile.update({
      where: { id },
      data: {
        teamSize: dto.teamSize,
        technologies: dto.technologies,
        industries: dto.industries,
        govtExperience: dto.govtExperience,
        certifications: dto.certifications,
        updatedAt: new Date(),
      },
    });
  }

  async getMatchedChallenges(id: string, user: JwtPayload) {
    await this.findOne(id, user);

    const matchScores = await this.prisma.matchScore.findMany({
      where: { startupProfileId: id, expiresAt: { gt: new Date() } },
      orderBy: { overallScore: 'desc' },
      take: 20,
      include: {
        challenge: { include: { organization: { select: { id: true, name: true } } } },
      },
    });

    return { data: matchScores, startupProfileId: id };
  }

  async verifyStartup(id: string, user: JwtPayload) {
    if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
      throw new ForbiddenException('Only admins can verify startup profiles');
    }

    return this.prisma.startupProfile.update({
      where: { id },
      data: { isVerified: true } as any,
    });
  }
}
