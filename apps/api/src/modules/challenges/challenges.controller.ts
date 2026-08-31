import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import {
  CreateChallengeDto,
  UpdateChallengeDto,
  ChallengeQueryDto,
} from './dto/challenge.dto';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';
import { ChallengeStatus } from '../../common/enums/platform.enum';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class TransitionDto {
  @ApiProperty({ enum: ChallengeStatus })
  @IsEnum(ChallengeStatus)
  status: ChallengeStatus;
}

@ApiTags('Challenges')
@ApiBearerAuth('JWT-Auth')
@Controller({ path: 'challenges', version: '1' })
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.GOVERNMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new government innovation challenge' })
  create(@Body() dto: CreateChallengeDto, @CurrentUser() user: JwtPayload) {
    return this.challengesService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List challenges with filters (role-based visibility)' })
  findAll(@Query() query: ChallengeQueryDto, @CurrentUser() user: JwtPayload) {
    return this.challengesService.findAll(query, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single challenge by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.challengesService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(UserRole.GOVERNMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update challenge details (owner or admin only)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateChallengeDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.challengesService.update(id, dto, user);
  }

  @Patch(':id/status')
  @Roles(UserRole.GOVERNMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Transition challenge to a new status (lifecycle management)',
  })
  transition(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TransitionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.challengesService.transition(id, dto.status, user);
  }
}
