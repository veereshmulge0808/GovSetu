import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProcurementService } from './procurement.service';

@ApiTags('Procurement')
@ApiBearerAuth('JWT-Auth')
@Controller({ path: 'procurement', version: '1' })
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Get()
  @ApiOperation({ summary: 'List procurement' })
  findAll() {
    return this.procurementService.findAll();
  }
}
