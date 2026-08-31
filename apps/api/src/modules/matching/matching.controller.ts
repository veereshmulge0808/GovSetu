import { Controller, Get, Post, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MatchingService } from './matching.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('Matching')
@ApiBearerAuth('JWT-Auth')
@Controller({ path: 'matching', version: '1' })
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get()
  @ApiOperation({ summary: 'Matching service info' })
  findAll() {
    return this.matchingService.findAll();
  }

  @Post('challenge/:challengeId/run')
  @Roles(UserRole.GOVERNMENT_OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Trigger AI matching for a challenge (government officers only)' })
  @ApiParam({ name: 'challengeId', type: 'string', format: 'uuid' })
  triggerMatching(@Param('challengeId', ParseUUIDPipe) challengeId: string) {
    return this.matchingService.matchChallengeToStartups(challengeId);
  }

  @Get('challenge/:challengeId')
  @ApiOperation({ summary: 'Get AI match scores for a challenge' })
  @ApiParam({ name: 'challengeId', type: 'string', format: 'uuid' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  getMatchScores(
    @Param('challengeId', ParseUUIDPipe) challengeId: string,
    @Query('limit') limit?: string,
  ) {
    return this.matchingService.getMatchScores(challengeId, limit ? parseInt(limit, 10) : 20);
  }

  @Get('startup/:startupProfileId/recommendations')
  @Roles(UserRole.STARTUP_USER)
  @ApiOperation({ summary: 'Get recommended challenges for a startup' })
  @ApiParam({ name: 'startupProfileId', type: 'string', format: 'uuid' })
  getRecommendations(
    @Param('startupProfileId', ParseUUIDPipe) startupProfileId: string,
    @Query('limit') limit?: string,
  ) {
    return this.matchingService.getRecommendationsForStartup(
      startupProfileId,
      limit ? parseInt(limit, 10) : 10,
    );
  }
}
