import {
  Controller, Get, Post, Patch, Body, Param,
  Query, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProcurementService } from './procurement.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('Procurement')
@ApiBearerAuth('JWT-Auth')
@Controller({ path: 'procurement', version: '1' })
export class ProcurementController {
  constructor(private readonly svc: ProcurementService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.GOVERNMENT_OFFICER, UserRole.PROCUREMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '[Govt/Procurement] Initiate procurement after successful pilot' })
  initiate(@Body() dto: any, @CurrentUser() user: JwtPayload) {
    return this.svc.initiate(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List procurements (role-scoped)' })
  findAll(@Query() query: any, @CurrentUser() user: JwtPayload) {
    return this.svc.findAll(query, user);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get procurement statistics' })
  getStats(@CurrentUser() user: JwtPayload) {
    return this.svc.getStats(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get procurement details' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.findOne(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.PROCUREMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '[Procurement] Update procurement status' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.updateStatus(id, status, user);
  }
}
