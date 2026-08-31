import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { StartupsModule } from './modules/startups/startups.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { EvaluationsModule } from './modules/evaluations/evaluations.module';
import { PilotsModule } from './modules/pilots/pilots.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { MatchingModule } from './modules/matching/matching.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuditModule } from './modules/audit/audit.module';

// Infrastructure
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { EmailModule } from './infrastructure/email/email.module';

// App controller (health check)
import { AppController } from './app.controller';
import { AppService } from './app.service';

import configuration from './config/configuration';
import { validate } from './config/env.validation';

@Module({
  imports: [
    // ─── Configuration ──────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
      envFilePath: ['.env', '.env.local'],
      expandVariables: true,
    }),

    // ─── Rate Limiting ───────────────────────────────────────────────────────
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL', 60000),
          limit: config.get<number>('THROTTLE_LIMIT', 100),
        },
      ],
    }),

    // ─── Event Emitter (internal domain events) ──────────────────────────────
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 20,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),

    // ─── Cron Scheduler ─────────────────────────────────────────────────────
    ScheduleModule.forRoot(),

    // ─── BullMQ Queue ───────────────────────────────────────────────────────
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      }),
    }),

    // ─── Infrastructure ─────────────────────────────────────────────────────
    PrismaModule,
    StorageModule,
    EmailModule,

    // ─── Feature Modules ────────────────────────────────────────────────────
    AuthModule,
    UsersModule,
    OrganizationsModule,
    ChallengesModule,
    StartupsModule,
    ApplicationsModule,
    EvaluationsModule,
    PilotsModule,
    ProcurementModule,
    MatchingModule,
    NotificationsModule,
    AnalyticsModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
