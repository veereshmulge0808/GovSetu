import {
  IsString, IsNotEmpty, IsOptional, IsArray,
  IsBoolean, IsEnum, IsUrl, IsNumber, MaxLength,
  IsInt, Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum StartupStage {
  IDEA = 'IDEA',
  MVP = 'MVP',
  EARLY_REVENUE = 'EARLY_REVENUE',
  GROWTH = 'GROWTH',
  SCALE = 'SCALE',
}

export class CreateStartupProfileDto {
  @ApiProperty({ example: 'WaterSense Technologies' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  brandName: string;

  @ApiProperty({ example: 'We build IoT sensors for smart water management...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Bengaluru, Karnataka' })
  @IsString()
  @IsNotEmpty()
  headquarters: string;

  @ApiPropertyOptional({ example: 'Karnataka' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ enum: StartupStage, example: StartupStage.EARLY_REVENUE })
  @IsEnum(StartupStage)
  @IsOptional()
  stage?: StartupStage;

  @ApiPropertyOptional({ example: 2021 })
  @IsInt()
  @Min(1990)
  @IsOptional()
  foundedYear?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsInt()
  @Min(1)
  @IsOptional()
  teamSize?: number;

  @ApiPropertyOptional({ type: [String], example: ['IoT', 'AI/ML', 'Cloud'] })
  @IsArray()
  @IsOptional()
  technologies?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Water Management', 'Smart Cities'] })
  @IsArray()
  @IsOptional()
  industries?: string[];

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  govtExperience?: boolean;

  @ApiPropertyOptional({ example: 'Deployed sensors across 3 municipal corporations' })
  @IsString()
  @IsOptional()
  govtProjectSummary?: string;

  @ApiPropertyOptional({ type: [String], example: ['ISO 27001', 'STQC', 'DPIIT Recognized'] })
  @IsArray()
  @IsOptional()
  certifications?: string[];

  @ApiPropertyOptional({ example: 'Seed' })
  @IsString()
  @IsOptional()
  fundingStage?: string;

  @ApiPropertyOptional({ example: '50 Lakh' })
  @IsString()
  @IsOptional()
  fundingAmount?: string;

  @ApiPropertyOptional({ example: 'https://watersense.in' })
  @IsUrl()
  @IsOptional()
  pitchDeckUrl?: string;

  @ApiPropertyOptional({ example: 'https://watersense.in/product-demo' })
  @IsUrl()
  @IsOptional()
  productDemoUrl?: string;
}

export class UpdateStartupProfileDto {
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() headquarters?: string;
  @ApiPropertyOptional() @IsEnum(StartupStage) @IsOptional() stage?: StartupStage;
  @ApiPropertyOptional() @IsInt() @IsOptional() teamSize?: number;
  @ApiPropertyOptional() @IsArray() @IsOptional() technologies?: string[];
  @ApiPropertyOptional() @IsArray() @IsOptional() industries?: string[];
  @ApiPropertyOptional() @IsBoolean() @IsOptional() govtExperience?: boolean;
  @ApiPropertyOptional() @IsArray() @IsOptional() certifications?: string[];
}

export class StartupQueryDto {
  @ApiPropertyOptional() @IsString() @IsOptional() search?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() technology?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() industry?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() state?: string;
  @ApiPropertyOptional() @IsEnum(StartupStage) @IsOptional() stage?: StartupStage;
  @ApiPropertyOptional() @IsOptional() govtExperience?: string;
  @ApiPropertyOptional() @IsOptional() page?: string;
  @ApiPropertyOptional() @IsOptional() limit?: string;
}
