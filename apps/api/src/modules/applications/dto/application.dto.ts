import {
  IsString, IsNotEmpty, IsOptional, IsArray,
  IsEnum, IsUUID, MaxLength, IsNumber, Min, Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ADDITIONAL_INFO_REQUIRED = 'ADDITIONAL_INFO_REQUIRED',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
  SELECTED = 'SELECTED',
  PILOT_STAGE = 'PILOT_STAGE',
  COMPLETED = 'COMPLETED',
}

export class CreateApplicationDto {
  @ApiProperty({ description: 'ID of the challenge being applied to' })
  @IsUUID()
  challengeId: string;

  @ApiProperty({ description: 'ID of the startup profile (required)' })
  @IsUUID()
  startupProfileId: string;

  @ApiPropertyOptional({ example: 'Our solution uses IoT sensors embedded...' })
  @IsString()
  @IsOptional()
  executiveSummary?: string;

  @ApiPropertyOptional({ example: 'We propose a three-phase approach...' })
  @IsString()
  @IsOptional()
  technicalApproach?: string;

  @ApiPropertyOptional({ example: 'Phase 1: Sensor deployment (Week 1-4)...' })
  @IsString()
  @IsOptional()
  implementationPlan?: string;

  @ApiPropertyOptional({ example: '5 years of IoT deployments, 3 government projects...' })
  @IsString()
  @IsOptional()
  teamExperience?: string;

  @ApiPropertyOptional({ example: 'We currently have 50 sensor nodes deployed in Pune...' })
  @IsString()
  @IsOptional()
  proofOfConcept?: string;

  @ApiPropertyOptional({ example: '30 Lakh INR for pilot deployment' })
  @IsString()
  @IsOptional()
  proposedBudget?: string;

  @ApiPropertyOptional({ example: 'Pilot completion in 90 days...' })
  @IsString()
  @IsOptional()
  timeline?: string;

  @ApiPropertyOptional({ example: 'ISO 27001 certified, STQC tested...' })
  @IsString()
  @IsOptional()
  complianceCertifications?: string;

  @ApiPropertyOptional({ type: [String], example: ['Water', 'IoT', 'Smart Cities'] })
  @IsArray()
  @IsOptional()
  keywords?: string[];
}

export class UpdateApplicationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  executiveSummary?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  technicalApproach?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  implementationPlan?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  teamExperience?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  proposedBudget?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  timeline?: string;
}

export class ApplicationQueryDto {
  @ApiPropertyOptional({ enum: ApplicationStatus })
  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  challengeId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  startupProfileId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  page?: string;

  @ApiPropertyOptional()
  @IsOptional()
  limit?: string;
}

export class ReviewApplicationDto {
  @ApiProperty({ example: 'This application demonstrates strong...' })
  @IsString()
  @IsNotEmpty()
  comments: string;
}
