import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns the current health status of the API server.',
  })
  @ApiResponse({
    status: 200,
    description: 'Server is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2026-08-31T12:00:00.000Z' },
        uptime: { type: 'number', example: 3600 },
        version: { type: 'string', example: '1.0.0' },
        environment: { type: 'string', example: 'development' },
      },
    },
  })
  healthCheck() {
    return this.appService.getHealth();
  }
}
