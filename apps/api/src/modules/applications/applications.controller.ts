import {
  Controller, Get, Post, Patch, Body, Param,
  Query, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import {
  CreateApplicationDto, UpdateApplicationDto,
  ApplicationQueryDto, ApplicationStatus,
} from './dto/application.dto';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('Applications')
@ApiBearerAuth('JWT-Auth')
@Controller({ path: 'applications', version: '1' })
export class ApplicationsController {
  constructor(private readonly svc: ApplicationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.STARTUP_USER)
  @ApiOperation({ summary: '[Startup] Create a new application (starts as DRAFT)' })
  create(@Body() dto: CreateApplicationDto, @CurrentUser() user: JwtPayload) {
    return this.svc.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List applications (role-scoped)' })
  findAll(@Query() query: ApplicationQueryDto, @CurrentUser() user: JwtPayload) {
    return this.svc.findAll(query, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single application' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.svc.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[Startup] Update a DRAFT application' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateApplicationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.update(id, dto, user);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: '[Startup] Submit a DRAFT application' })
  submit(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.svc.submit(id, user);
  }

  @Patch(':id/status')
  @Roles(UserRole.GOVERNMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EVALUATOR)
  @ApiOperation({ summary: '[Govt/Admin] Transition application status' })
  transition(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: ApplicationStatus,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.transition(id, status, user);
  }

  @Get('challenge/:challengeId')
  @Roles(UserRole.GOVERNMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EVALUATOR, UserRole.PILOT_MANAGER)
  @ApiOperation({ summary: '[Govt] List all applications for a specific challenge' })
  getByChallenge(
    @Param('challengeId', ParseUUIDPipe) challengeId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.getApplicationsByChallenge(challengeId, user);
  }
}
