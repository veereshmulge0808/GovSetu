import {
  Injectable, NotFoundException, ForbiddenException,
  BadRequestException, ConflictException, Logger,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class EvaluationsService {
  private readonly logger = new Logger(EvaluationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async assignEvaluator(applicationId: string, evaluatorId: string, user: JwtPayload) {
    if (![UserRole.GOVERNMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
      throw new ForbiddenException('Only government officers can assign evaluators');
    }

    const application = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!application) throw new NotFoundException('Application not found');

    const evaluatorUser = await this.prisma.user.findUnique({ where: { id: evaluatorId } });
    if (!evaluatorUser || evaluatorUser.role !== UserRole.EVALUATOR) {
      throw new BadRequestException('The specified user is not an evaluator');
    }

    const existing = await this.prisma.evaluatorAssignment.findUnique({
      where: { applicationId_evaluatorId: { applicationId, evaluatorId } },
    });
    if (existing) throw new ConflictException('Evaluator already assigned to this application');

    const assignment = await this.prisma.evaluatorAssignment.create({
      data: {
        applicationId,
        evaluatorId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      include: {
        evaluator: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    this.logger.log(`Evaluator ${evaluatorId} assigned to application ${applicationId}`);
    return assignment;
  }

  async submitScore(applicationId: string, scores: any, user: JwtPayload) {
    if (user.role !== UserRole.EVALUATOR) {
      throw new ForbiddenException('Only evaluators can submit scores');
    }

    const assignment = await this.prisma.evaluatorAssignment.findUnique({
      where: { applicationId_evaluatorId: { applicationId, evaluatorId: user.sub } },
    });
    if (!assignment) {
      throw new ForbiddenException('You are not assigned to evaluate this application');
    }

    // Add scores as individual criterion records per the schema
    const criteria = [
      { criterion: 'Technical', score: scores.technicalScore, maxScore: 10, weight: 0.25 },
      { criterion: 'Innovation', score: scores.innovationScore, maxScore: 10, weight: 0.20 },
      { criterion: 'Feasibility', score: scores.feasibilityScore, maxScore: 10, weight: 0.20 },
      { criterion: 'Team', score: scores.teamScore, maxScore: 10, weight: 0.20 },
      { criterion: 'Impact', score: scores.impactScore, maxScore: 10, weight: 0.15 },
    ];

    const createdScores = await Promise.all(
      criteria.map((c) =>
        this.prisma.evaluationScore.create({
          data: {
            assignmentId: assignment.id,
            applicationId,
            criterion: c.criterion,
            score: c.score,
            maxScore: c.maxScore,
            weight: c.weight,
            comments: scores.comments,
          },
        }),
      ),
    );

    await this.prisma.evaluatorAssignment.update({
      where: { applicationId_evaluatorId: { applicationId, evaluatorId: user.sub } },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        recommendation: scores.recommendation,
        summary: scores.comments,
      },
    });

    return { assignmentId: assignment.id, scores: createdScores };
  }

  async getApplicationEvaluations(applicationId: string, user: JwtPayload) {
    if (![UserRole.GOVERNMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
      throw new ForbiddenException('Only government officers can view evaluation results');
    }

    const assignments = await this.prisma.evaluatorAssignment.findMany({
      where: { applicationId },
      include: {
        evaluator: { select: { id: true, firstName: true, lastName: true } },
        scores: true,
      },
    });

    const completedAssignments = assignments.filter((a: any) => a.isCompleted);
    const totalWeightedScore = completedAssignments.reduce((sum: number, a: any) => {
      const assignmentScore = a.scores.reduce(
        (s: number, score: any) => s + score.score * score.weight, 0,
      );
      return sum + assignmentScore;
    }, 0);

    return {
      applicationId,
      assignments,
      summary: {
        totalAssigned: assignments.length,
        totalCompleted: completedAssignments.length,
        averageWeightedScore: completedAssignments.length > 0
          ? +(totalWeightedScore / completedAssignments.length).toFixed(2)
          : null,
      },
    };
  }

  async getMyAssignments(user: JwtPayload) {
    if (user.role !== UserRole.EVALUATOR) {
      throw new ForbiddenException('Only evaluators can view their assignments');
    }

    return this.prisma.evaluatorAssignment.findMany({
      where: { evaluatorId: user.sub },
      orderBy: { dueDate: 'asc' },
      include: {
        application: {
          include: {
            challenge: { select: { id: true, title: true } },
            startupProfile: {
              include: { organization: { select: { id: true, name: true, logoUrl: true } } },
            },
          },
        },
        scores: true,
      },
    });
  }

  async getPendingEvaluations(challengeId: string, user: JwtPayload) {
    if (![UserRole.GOVERNMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return this.prisma.application.findMany({
      where: {
        challengeId,
        status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED'] as any },
      },
      include: {
        startupProfile: {
          include: { organization: { select: { id: true, name: true } } },
        },
        evaluatorAssignments: {
          include: { evaluator: { select: { id: true, firstName: true, lastName: true } } },
        },
        _count: { select: { evaluatorAssignments: true } },
      },
    });
  }
}
