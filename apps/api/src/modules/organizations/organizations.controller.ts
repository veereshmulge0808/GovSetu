import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto, OrganizationQueryDto } from './dto/organization.dto';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('Organizations')
@ApiBearerAuth('JWT-Auth')
@Controller({ path: 'organizations', version: '1' })
export class OrganizationsController {
  constructor(private readonly svc: OrganizationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '[Admin] Create a new organization' })
  create(@Body() dto: CreateOrganizationDto, @CurrentUser() user: JwtPayload) {
    return this.svc.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List all organizations (filterable)' })
  findAll(@Query() query: OrganizationQueryDto) {
    return this.svc.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an organization by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get challenge and user stats for an organization' })
  getStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.getStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update organization (admin or org member)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrganizationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '[Admin] Deactivate an organization' })
  deactivate(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.svc.deactivate(id, user);
  }
}
