import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PilotsService } from './pilots.service';

@ApiTags('Pilots')
@ApiBearerAuth('JWT-Auth')
@Controller({ path: 'pilots', version: '1' })
export class PilotsController {
  constructor(private readonly pilotsService: PilotsService) {}

  @Get()
  @ApiOperation({ summary: 'List pilots' })
  findAll() {
    return this.pilotsService.findAll();
  }
}
