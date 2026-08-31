import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: this.configService.get<string>('APP_VERSION', '1.0.0'),
      environment: this.configService.get<string>('NODE_ENV', 'development'),
    };
  }
}
