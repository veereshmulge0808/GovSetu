import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  // ─── Security ───────────────────────────────────────────────────────────────
  app.use(helmet());
  app.use(compression());

  // ─── CORS ───────────────────────────────────────────────────────────────────
  const corsOrigins = configService
    .get<string>('CORS_ORIGINS', 'http://localhost:3001')
    .split(',');

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  });

  // ─── Global Prefix & Versioning ─────────────────────────────────────────────
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ─── Global Pipes ───────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Strip unknown properties
      forbidNonWhitelisted: true, // Throw on unknown properties
      transform: true,            // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ─── Global Filters ─────────────────────────────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());

  // ─── Global Interceptors ────────────────────────────────────────────────────
  app.useGlobalInterceptors(new TransformInterceptor());

  // ─── Swagger API Documentation ──────────────────────────────────────────────
  const swaggerEnabled = configService.get<string>('SWAGGER_ENABLED', 'true') === 'true';

  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(configService.get<string>('SWAGGER_TITLE', 'GovSetu API'))
      .setDescription(
        configService.get<string>(
          'SWAGGER_DESCRIPTION',
          'AI-Powered Government Innovation Procurement Platform — Backend API',
        ),
      )
      .setVersion(configService.get<string>('SWAGGER_VERSION', '1.0'))
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Enter your JWT access token',
          in: 'header',
        },
        'JWT-Auth',
      )
      .addTag('Auth', 'Authentication and authorization')
      .addTag('Users', 'User management')
      .addTag('Organizations', 'Government and startup organization management')
      .addTag('Challenges', 'Government innovation challenge management')
      .addTag('Startups', 'Startup profile management')
      .addTag('Applications', 'Startup challenge application management')
      .addTag('Evaluations', 'Evaluation and scoring system')
      .addTag('Pilots', 'Pilot program management')
      .addTag('Procurement', 'Procurement workflow management')
      .addTag('Matching', 'AI-powered startup-challenge matching')
      .addTag('Notifications', 'In-app and email notifications')
      .addTag('Analytics', 'Platform analytics and reporting')
      .addTag('Audit', 'Audit log access')
      .addTag('Health', 'Application health check')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    const swaggerPath = configService.get<string>('SWAGGER_PATH', 'api/docs');
    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
      },
    });

    logger.log(`Swagger docs available at: http://localhost:${configService.get('PORT', 3000)}/${swaggerPath}`);
  }

  // ─── Graceful Shutdown ───────────────────────────────────────────────────────
  app.enableShutdownHooks();

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  logger.log(`🚀 GovSetu API is running on: http://localhost:${port}/api/v1`);
  logger.log(`📚 Environment: ${configService.get('NODE_ENV', 'development')}`);
}

bootstrap();
