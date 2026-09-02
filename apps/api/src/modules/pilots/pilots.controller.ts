import {
  Controller, Get, Post, Patch, Body, Param,
  Query, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PilotsService } from './pilots.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('Pilots')
@ApiBearerAuth('JWT-Auth')
@Controller({ path: 'pilots', version: '1' })
export class PilotsController {
  constructor(private readonly svc: PilotsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.GOVERNMENT_OFFICER, UserRole.PILOT_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '[Govt] Create a pilot from a selected application' })
  create(@Body() dto: any, @CurrentUser() user: JwtPayload) {
    return this.svc.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List pilots (role-scoped)' })
  findAll(@Query() query: any, @CurrentUser() user: JwtPayload) {
    return this.svc.findAll(query, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pilot with full details' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.svc.findOne(id, user);
  }

  @Patch(':id/status')
  @Roles(UserRole.GOVERNMENT_OFFICER, UserRole.PILOT_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '[Govt/PM] Update pilot status' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.updateStatus(id, status, user);
  }

  @Post(':id/milestones')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.GOVERNMENT_OFFICER, UserRole.PILOT_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '[Govt/PM] Add a milestone to a pilot' })
  addMilestone(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: any,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.addMilestone(id, dto, user);
  }

  @Patch('milestones/:milestoneId')
  @ApiOperation({ summary: 'Update milestone status/progress' })
  updateMilestone(
    @Param('milestoneId', ParseUUIDPipe) milestoneId: string,
    @Body() dto: any,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.updateMilestone(milestoneId, dto, user);
  }

  @Post(':id/reports')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a progress report for a pilot' })
  addReport(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: any,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.addProgressReport(id, dto, user);
  }

  @Post(':id/kpis')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.GOVERNMENT_OFFICER, UserRole.PILOT_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '[Govt/PM] Add a KPI to a pilot' })
  addKPI(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: any,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.addKPI(id, dto, user);
  }

  @Patch('kpis/:kpiId')
  @ApiOperation({ summary: 'Update KPI actual value' })
  updateKPI(
    @Param('kpiId', ParseUUIDPipe) kpiId: string,
    @Body('actualValue') actualValue: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.updateKPI(kpiId, actualValue, user);
  }
}
