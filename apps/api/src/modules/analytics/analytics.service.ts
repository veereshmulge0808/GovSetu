import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';
import { ChallengeStatus, ApplicationStatus, PilotStatus } from '../../common/enums/platform.enum';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Platform-wide summary statistics (Admin only).
   */
  async getPlatformStats() {
    const [
      totalUsers,
      totalOrganizations,
      totalStartups,
      totalGovtOrgs,
      totalChallenges,
      publishedChallenges,
      totalApplications,
      totalPilots,
      activePilots,
      totalProcurements,
    ] = await Promise.all([
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.organization.count({ where: { isActive: true } }),
      this.prisma.organization.count({ where: { type: 'STARTUP', isActive: true } }),
      this.prisma.organization.count({ where: { type: 'GOVERNMENT', isActive: true } }),
      this.prisma.challenge.count(),
      this.prisma.challenge.count({ where: { status: ChallengeStatus.PUBLISHED } }),
      this.prisma.application.count(),
      this.prisma.pilot.count(),
      this.prisma.pilot.count({ where: { status: PilotStatus.IN_PROGRESS } }),
      this.prisma.procurement.count(),
    ]);

    return {
      users: { total: totalUsers },
      organizations: { total: totalOrganizations, government: totalGovtOrgs, startups: totalStartups },
      challenges: { total: totalChallenges, published: publishedChallenges },
      applications: { total: totalApplications },
      pilots: { total: totalPilots, active: activePilots },
      procurement: { total: totalProcurements },
    };
  }

  /**
   * Dashboard data for government officers — scoped to their organization.
   */
  async getGovernmentDashboard(user: JwtPayload) {
    const orgId = user.organizationId;
    if (!orgId) return { message: 'No organization linked' };

    const [challenges, applicationCounts, pilots] = await Promise.all([
      this.prisma.challenge.groupBy({
        by: ['status'],
        where: { organizationId: orgId },
        _count: { status: true },
      }),
      this.prisma.application.count({
        where: { challenge: { organizationId: orgId } },
      }),
      this.prisma.pilot.findMany({
        where: { challenge: { organizationId: orgId }, status: PilotStatus.IN_PROGRESS },
        select: { id: true, title: true, status: true, plannedEndDate: true },
        take: 5,
      }),
    ]);

    return {
      challengesByStatus: challenges.reduce(
        (acc, cur) => ({ ...acc, [cur.status]: cur._count.status }),
        {} as Record<string, number>,
      ),
      totalApplicationsReceived: applicationCounts,
      activePilots: pilots,
    };
  }

  /**
   * Dashboard data for startup users — scoped to their startup profile.
   */
  async getStartupDashboard(user: JwtPayload) {
    const startupProfile = await this.prisma.startupProfile.findFirst({
      where: { organizationId: user.organizationId ?? undefined },
    });

    if (!startupProfile) return { message: 'No startup profile found' };

    const [applicationsByStatus, activeMatches, upcomingDeadlines] = await Promise.all([
      this.prisma.application.groupBy({
        by: ['status'],
        where: { startupProfileId: startupProfile.id },
        _count: { status: true },
      }),
      this.prisma.matchScore.count({
        where: {
          startupProfileId: startupProfile.id,
          overallScore: { gte: 70 },
          expiresAt: { gt: new Date() },
        },
      }),
      this.prisma.challenge.findMany({
        where: {
          status: ChallengeStatus.PUBLISHED,
          submissionDeadline: { gte: new Date(), lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        },
        select: { id: true, title: true, submissionDeadline: true, sector: true },
        orderBy: { submissionDeadline: 'asc' },
        take: 5,
      }),
    ]);

    return {
      applicationsByStatus: applicationsByStatus.reduce(
        (acc, cur) => ({ ...acc, [cur.status]: cur._count.status }),
        {} as Record<string, number>,
      ),
      strongMatches: activeMatches,
      upcomingDeadlines,
    };
  }

  async findAll() {
    return { message: 'Use /analytics/platform, /analytics/government, or /analytics/startup' };
  }
}
