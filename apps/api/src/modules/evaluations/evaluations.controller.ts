import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EvaluationsService } from './evaluations.service';

@ApiTags('Evaluations')
@ApiBearerAuth('JWT-Auth')
@Controller({ path: 'evaluations', version: '1' })
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Get()
  @ApiOperation({ summary: 'List evaluations' })
  findAll() {
    return this.evaluationsService.findAll();
  }
}
