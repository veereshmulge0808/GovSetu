import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OrganizationType {
  GOVERNMENT = 'GOVERNMENT',
  STARTUP = 'STARTUP',
  ACADEMIC = 'ACADEMIC',
  NGO = 'NGO',
  CORPORATE = 'CORPORATE',
}

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Bengaluru Smart City Limited' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ enum: OrganizationType, example: OrganizationType.GOVERNMENT })
  @IsEnum(OrganizationType)
  type: OrganizationType;

  @ApiPropertyOptional({ example: 'Bengaluru Smart City Limited (BSCL) is...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://smartcity.bengaluru.gov.in' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ example: 'Karnataka' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: 'Bengaluru' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: '560001' })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  pincode?: string;

  @ApiPropertyOptional({ example: 'GST123456789' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  gstNumber?: string;

  @ApiPropertyOptional({ example: 'PAN123456' })
  @IsString()
  @IsOptional()
  @MaxLength(15)
  panNumber?: string;
}

export class UpdateOrganizationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;
}

export class OrganizationQueryDto {
  @ApiPropertyOptional({ enum: OrganizationType })
  @IsEnum(OrganizationType)
  @IsOptional()
  type?: OrganizationType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  page?: string;

  @ApiPropertyOptional()
  @IsOptional()
  limit?: string;
}
