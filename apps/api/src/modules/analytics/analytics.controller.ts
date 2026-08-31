import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('Analytics')
@ApiBearerAuth('JWT-Auth')
@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Analytics service info' })
  findAll() {
    return this.analyticsService.findAll();
  }

  @Get('platform')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '[Admin] Platform-wide statistics' })
  getPlatformStats() {
    return this.analyticsService.getPlatformStats();
  }

  @Get('government/dashboard')
  @Roles(UserRole.GOVERNMENT_OFFICER, UserRole.PILOT_MANAGER, UserRole.PROCUREMENT_OFFICER)
  @ApiOperation({ summary: 'Government officer dashboard data' })
  getGovernmentDashboard(@CurrentUser() user: JwtPayload) {
    return this.analyticsService.getGovernmentDashboard(user);
  }

  @Get('startup/dashboard')
  @Roles(UserRole.STARTUP_USER)
  @ApiOperation({ summary: 'Startup dashboard data' })
  getStartupDashboard(@CurrentUser() user: JwtPayload) {
    return this.analyticsService.getStartupDashboard(user);
  }
}
