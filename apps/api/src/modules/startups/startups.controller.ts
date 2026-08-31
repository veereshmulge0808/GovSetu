import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StartupsService } from './startups.service';

@ApiTags('Startups')
@ApiBearerAuth('JWT-Auth')
@Controller({ path: 'startups', version: '1' })
export class StartupsController {
  constructor(private readonly startupsService: StartupsService) {}

  @Get()
  @ApiOperation({ summary: 'List startups' })
  findAll() {
    return this.startupsService.findAll();
  }
}
