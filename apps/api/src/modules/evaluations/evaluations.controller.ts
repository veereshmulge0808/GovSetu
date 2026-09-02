import {
  Controller, Get, Post, Body, Param, Query,
  ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EvaluationsService } from './evaluations.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';
import {
  IsString, IsNumber, IsOptional, Min, Max, IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Recommendation { SHORTLIST = 'SHORTLIST', REJECT = 'REJECT', FURTHER_INFO = 'FURTHER_INFO' }

class SubmitScoreDto {
  @ApiProperty({ minimum: 0, maximum: 10 }) @IsNumber() @Min(0) @Max(10) technicalScore: number;
  @ApiProperty({ minimum: 0, maximum: 10 }) @IsNumber() @Min(0) @Max(10) innovationScore: number;
  @ApiProperty({ minimum: 0, maximum: 10 }) @IsNumber() @Min(0) @Max(10) feasibilityScore: number;
  @ApiProperty({ minimum: 0, maximum: 10 }) @IsNumber() @Min(0) @Max(10) teamScore: number;
  @ApiProperty({ minimum: 0, maximum: 10 }) @IsNumber() @Min(0) @Max(10) impactScore: number;
  @ApiPropertyOptional() @IsString() @IsOptional() comments?: string;
  @ApiPropertyOptional({ enum: Recommendation }) @IsEnum(Recommendation) @IsOptional() recommendation?: Recommendation;
}

@ApiTags('Evaluations')
@ApiBearerAuth('JWT-Auth')
@Controller({ path: 'evaluations', version: '1' })
export class EvaluationsController {
  constructor(private readonly svc: EvaluationsService) {}

  @Get('my-assignments')
  @Roles(UserRole.EVALUATOR)
  @ApiOperation({ summary: '[Evaluator] List all your assigned applications' })
  getMyAssignments(@CurrentUser() user: JwtPayload) {
    return this.svc.getMyAssignments(user);
  }

  @Get('pending/:challengeId')
  @Roles(UserRole.GOVERNMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '[Govt] List pending evaluations for a challenge' })
  getPending(
    @Param('challengeId', ParseUUIDPipe) challengeId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.getPendingEvaluations(challengeId, user);
  }

  @Post(':applicationId/assign/:evaluatorId')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.GOVERNMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '[Govt] Assign an evaluator to an application' })
  assignEvaluator(
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
    @Param('evaluatorId', ParseUUIDPipe) evaluatorId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.assignEvaluator(applicationId, evaluatorId, user);
  }

  @Get(':applicationId')
  @Roles(UserRole.GOVERNMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '[Govt] Get all evaluation scores for an application' })
  getApplicationEvaluations(
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.getApplicationEvaluations(applicationId, user);
  }

  @Post(':applicationId/score')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.EVALUATOR)
  @ApiOperation({ summary: '[Evaluator] Submit evaluation scores for an application' })
  submitScore(
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
    @Body() dto: SubmitScoreDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.submitScore(applicationId, dto, user);
  }
}
