import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';

@ApiTags('Applications')
@ApiBearerAuth('JWT-Auth')
@Controller({ path: 'applications', version: '1' })
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @ApiOperation({ summary: 'List applications' })
  findAll() {
    return this.applicationsService.findAll();
  }
}
