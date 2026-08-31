import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
  IsDateString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChallengeStatus } from '../../../common/enums/platform.enum';

export class EvaluationCriterionDto {
  @ApiProperty({ example: 'Technical Capability' })
  @IsString()
  criterion: string;

  @ApiProperty({ example: 0.3, description: 'Weight between 0 and 1' })
  @IsNumber()
  weight: number;

  @ApiPropertyOptional({ example: 'Assess depth of technical solution' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateChallengeDto {
  @ApiProperty({ example: 'Real-time Water Leakage Detection System' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  title: string;

  @ApiProperty({ example: 'Municipal water pipelines lose approximately 30% of supply...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'High water loss and operational costs due to undetected leaks.' })
  @IsString()
  @IsNotEmpty()
  problemStatement: string;

  @ApiPropertyOptional({ example: 'Reduce pipeline water loss by 50% within 12 months.' })
  @IsString()
  @IsOptional()
  desiredOutcome?: string;

  @ApiPropertyOptional({ example: 'Manual inspection once every 3 months.' })
  @IsString()
  @IsOptional()
  existingApproach?: string;

  @ApiPropertyOptional({ example: 'Water Management' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  sector?: string;

  @ApiPropertyOptional({ example: 'IoT' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  domain?: string;

  @ApiPropertyOptional({ example: 'Bengaluru' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @ApiPropertyOptional({ example: 'Karnataka' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ example: 'Municipal corporations and city residents.' })
  @IsString()
  @IsOptional()
  targetBeneficiaries?: string;

  @ApiPropertyOptional({ example: 'IoT sensors, real-time analytics, mobile alerts.' })
  @IsString()
  @IsOptional()
  technicalRequirements?: string;

  @ApiPropertyOptional({ example: 'Leak detection, alert generation, reporting dashboard.' })
  @IsString()
  @IsOptional()
  functionalRequirements?: string;

  @ApiPropertyOptional({ example: 'Must work with existing SCADA infrastructure.' })
  @IsString()
  @IsOptional()
  constraints?: string;

  @ApiPropertyOptional({ example: 'Company registered in India, at least 2 years old.' })
  @IsString()
  @IsOptional()
  eligibilityCriteria?: string;

  @ApiPropertyOptional({ example: 10, description: 'Minimum budget in lakhs INR' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  budgetMinLakh?: number;

  @ApiPropertyOptional({ example: 50, description: 'Maximum budget in lakhs INR' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  budgetMaxLakh?: number;

  @ApiPropertyOptional({ example: 90, description: 'Pilot duration in days' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  pilotDurationDays?: number;

  @ApiPropertyOptional({ example: '2026-10-31T23:59:59Z' })
  @IsDateString()
  @IsOptional()
  submissionDeadline?: string;

  @ApiPropertyOptional({
    type: [EvaluationCriterionDto],
    description: 'Evaluation criteria with weights',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EvaluationCriterionDto)
  evaluationCriteria?: EvaluationCriterionDto[];
}

export class UpdateChallengeDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(500)
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  problemStatement?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  desiredOutcome?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sector?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  domain?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  technicalRequirements?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  eligibilityCriteria?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  budgetMinLakh?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  budgetMaxLakh?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  pilotDurationDays?: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  submissionDeadline?: string;

  @ApiPropertyOptional({ type: [EvaluationCriterionDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EvaluationCriterionDto)
  evaluationCriteria?: EvaluationCriterionDto[];
}

export class ChallengeQueryDto {
  @ApiPropertyOptional({ description: 'Full-text search on title and description' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: ChallengeStatus })
  @IsEnum(ChallengeStatus)
  @IsOptional()
  status?: ChallengeStatus;

  @ApiPropertyOptional({ example: 'Water Management' })
  @IsString()
  @IsOptional()
  sector?: string;

  @ApiPropertyOptional({ example: 'Karnataka' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ description: 'Filter by creating organization' })
  @IsUUID()
  @IsOptional()
  organizationId?: string;

  @ApiPropertyOptional({ description: 'Page number', default: '1' })
  @IsOptional()
  page?: string;

  @ApiPropertyOptional({ description: 'Items per page (max 50)', default: '20' })
  @IsOptional()
  limit?: string;
}

export class PublishChallengeDto {
  @ApiPropertyOptional({ description: 'Optional internal notes before publishing' })
  @IsString()
  @IsOptional()
  notes?: string;
}
