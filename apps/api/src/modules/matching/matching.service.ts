import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { firstValueFrom } from 'rxjs';

/**
 * MatchingService orchestrates AI-powered startup-challenge matching.
 *
 * Architecture (from Techstack.md):
 * NestJS → AI Service Interface → Python FastAPI AI Service → pgvector
 *
 * For the MVP, when the AI service is unavailable, it falls back to a
 * deterministic rules-based matching algorithm using structured metadata.
 */
@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Trigger AI matching for a published challenge.
   * Calls the Python AI service and stores match scores.
   */
  async matchChallengeToStartups(challengeId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return { error: 'Challenge not found' };
    }

    const aiServiceUrl = this.config.get<string>('AI_SERVICE_URL', 'http://localhost:8000');

    try {
      // Call Python AI service for matching
      const response = await firstValueFrom(
        this.httpService.post(`${aiServiceUrl}/api/v1/match/challenge`, {
          challengeId,
          title: challenge.title,
          description: challenge.description,
          problemStatement: challenge.problemStatement,
          sector: challenge.sector,
          domain: challenge.domain,
          technicalRequirements: challenge.technicalRequirements,
          budgetMinLakh: challenge.budgetMinLakh,
          budgetMaxLakh: challenge.budgetMaxLakh,
        }),
      );

      this.logger.log(`AI matching completed for challenge ${challengeId}`);
      return response.data;
    } catch (error) {
      this.logger.warn(
        `AI service unavailable, using fallback matching for challenge ${challengeId}`,
      );
      return this.fallbackMatch(challengeId, challenge);
    }
  }

  /**
   * Get cached match scores for a challenge.
   */
  async getMatchScores(challengeId: string, limit = 20) {
    const scores = await this.prisma.matchScore.findMany({
      where: { challengeId, expiresAt: { gt: new Date() } },
      orderBy: { overallScore: 'desc' },
      take: limit,
      include: {
        startupProfile: {
          include: {
            organization: { select: { id: true, name: true, logoUrl: true, website: true } },
          },
        },
      },
    });

    return { data: scores, total: scores.length, challengeId };
  }

  /**
   * Get recommended challenges for a startup based on their profile.
   */
  async getRecommendationsForStartup(startupProfileId: string, limit = 10) {
    const scores = await this.prisma.matchScore.findMany({
      where: { startupProfileId, expiresAt: { gt: new Date() } },
      orderBy: { overallScore: 'desc' },
      take: limit,
      include: {
        challenge: {
          include: {
            organization: { select: { id: true, name: true } },
          },
        },
      },
    });

    return { data: scores, total: scores.length, startupProfileId };
  }

  /**
   * Fallback: deterministic rules-based match when AI service is unavailable.
   * Uses sector/domain/TRL overlap as a rough proxy for relevance.
   */
  private async fallbackMatch(challengeId: string, challenge: { sector: string | null; domain: string | null; budgetMaxLakh: number | null }) {
    const startupProfiles = await this.prisma.startupProfile.findMany({
      take: 50,
      include: { organization: true },
    });

    const scores = startupProfiles.map((sp) => {
      let score = 50; // Base score

      // Domain match
      if (challenge.sector && sp.industries?.some((i) => i.toLowerCase().includes(challenge.sector!.toLowerCase()))) {
        score += 20;
      }
      if (challenge.domain && sp.technologies?.some((t) => t.toLowerCase().includes(challenge.domain!.toLowerCase()))) {
        score += 20;
      }
      if (sp.govtExperience) score += 10;

      return {
        startupProfileId: sp.id,
        organizationName: sp.organization?.name,
        overallScore: Math.min(100, score),
        semanticScore: 0,
        domainScore: score > 70 ? 80 : 40,
        technologyScore: score > 80 ? 85 : 50,
        experienceScore: sp.govtExperience ? 80 : 40,
        readinessScore: 60,
        geographicScore: 70,
        budgetScore: 70,
        explanation: [{ factor: 'Fallback matching', reason: 'AI service unavailable' }],
      };
    });

    scores.sort((a, b) => b.overallScore - a.overallScore);
    return { data: scores.slice(0, 20), fallback: true };
  }

  async findAll() {
    return { message: 'Use /matching/challenge/:id or /matching/startup/:id endpoints' };
  }
}
