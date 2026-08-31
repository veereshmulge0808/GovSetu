/**
 * Application configuration factory.
 * Centralises all environment variable reading so the rest of the
 * application uses the typed config object rather than raw process.env.
 */
export default () => ({
  app: {
    name: process.env.APP_NAME ?? 'GovSetu API',
    version: process.env.APP_VERSION ?? '1.0.0',
    port: parseInt(process.env.PORT ?? '3000', 10),
    env: process.env.NODE_ENV ?? 'development',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD ?? undefined,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  storage: {
    endpoint: process.env.STORAGE_ENDPOINT ?? 'http://localhost:9000',
    port: parseInt(process.env.STORAGE_PORT ?? '9000', 10),
    useSSL: process.env.STORAGE_USE_SSL === 'true',
    accessKey: process.env.STORAGE_ACCESS_KEY ?? 'minioadmin',
    secretKey: process.env.STORAGE_SECRET_KEY ?? 'minioadmin',
    bucketName: process.env.STORAGE_BUCKET_NAME ?? 'govsetu-documents',
    region: process.env.STORAGE_REGION ?? 'us-east-1',
  },
  aiService: {
    url: process.env.AI_SERVICE_URL ?? 'http://localhost:8000',
    apiKey: process.env.AI_SERVICE_API_KEY ?? '',
  },
  email: {
    host: process.env.SMTP_HOST ?? 'localhost',
    port: parseInt(process.env.SMTP_PORT ?? '1025', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
    from: process.env.SMTP_FROM ?? 'GovSetu <noreply@govsetu.gov.in>',
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL ?? '60000', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED !== 'false',
    path: process.env.SWAGGER_PATH ?? 'api/docs',
  },
  cors: {
    origins: (process.env.CORS_ORIGINS ?? 'http://localhost:3001').split(','),
  },
  logging: {
    level: process.env.LOG_LEVEL ?? 'debug',
  },
});
