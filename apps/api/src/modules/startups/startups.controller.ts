import {
  Controller, Get, Post, Patch, Body, Param,
  Query, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StartupsService } from './startups.service';
import {
  CreateStartupProfileDto, UpdateStartupProfileDto, StartupQueryDto,
} from './dto/startup.dto';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('Startups')
@ApiBearerAuth('JWT-Auth')
@Controller({ path: 'startups', version: '1' })
export class StartupsController {
  constructor(private readonly svc: StartupsService) {}

  @Post('profile')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.STARTUP_USER)
  @ApiOperation({ summary: '[Startup] Create your startup profile' })
  createProfile(@Body() dto: CreateStartupProfileDto, @CurrentUser() user: JwtPayload) {
    return this.svc.createProfile(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Browse startup profiles (government/admin view)' })
  findAll(@Query() query: StartupQueryDto, @CurrentUser() user: JwtPayload) {
    return this.svc.findAll(query, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a startup profile by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.svc.findOne(id, user);
  }

  @Get(':id/matches')
  @ApiOperation({ summary: 'Get AI match scores for a startup profile' })
  getMatches(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.svc.getMatchedChallenges(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a startup profile' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStartupProfileDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.updateProfile(id, dto, user);
  }

  @Post(':id/verify')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '[Admin] Verify and approve a startup profile' })
  verify(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.svc.verifyStartup(id, user);
  }
}
