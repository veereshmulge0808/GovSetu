"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@nestjs/core");
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var swagger_1 = require("@nestjs/swagger");
var helmet_1 = require("helmet");
var compression_1 = require("compression");
var app_module_1 = require("./app.module");
var http_exception_filter_1 = require("./shared/filters/http-exception.filter");
var transform_interceptor_1 = require("./shared/interceptors/transform.interceptor");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var logger, app, configService, corsOrigins, swaggerEnabled, swaggerConfig, document_1, swaggerPath, port;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = new common_1.Logger('Bootstrap');
                    return [4 /*yield*/, core_1.NestFactory.create(app_module_1.AppModule, {
                            logger: ['error', 'warn', 'log', 'debug', 'verbose'],
                        })];
                case 1:
                    app = _a.sent();
                    configService = app.get(config_1.ConfigService);
                    // ─── Security ───────────────────────────────────────────────────────────────
                    app.use((0, helmet_1.default)());
                    app.use((0, compression_1.default)());
                    corsOrigins = configService
                        .get('CORS_ORIGINS', 'http://localhost:3001')
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
                        type: common_1.VersioningType.URI,
                        defaultVersion: '1',
                    });
                    // ─── Global Pipes ───────────────────────────────────────────────────────────
                    app.useGlobalPipes(new common_1.ValidationPipe({
                        whitelist: true, // Strip unknown properties
                        forbidNonWhitelisted: true, // Throw on unknown properties
                        transform: true, // Auto-transform payloads to DTO instances
                        transformOptions: {
                            enableImplicitConversion: true,
                        },
                    }));
                    // ─── Global Filters ─────────────────────────────────────────────────────────
                    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
                    // ─── Global Interceptors ────────────────────────────────────────────────────
                    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
                    swaggerEnabled = configService.get('SWAGGER_ENABLED', 'true') === 'true';
                    if (swaggerEnabled) {
                        swaggerConfig = new swagger_1.DocumentBuilder()
                            .setTitle(configService.get('SWAGGER_TITLE', 'GovSetu API'))
                            .setDescription(configService.get('SWAGGER_DESCRIPTION', 'AI-Powered Government Innovation Procurement Platform — Backend API'))
                            .setVersion(configService.get('SWAGGER_VERSION', '1.0'))
                            .addBearerAuth({
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                            name: 'Authorization',
                            description: 'Enter your JWT access token',
                            in: 'header',
                        }, 'JWT-Auth')
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
                        document_1 = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
                        swaggerPath = configService.get('SWAGGER_PATH', 'api/docs');
                        swagger_1.SwaggerModule.setup(swaggerPath, app, document_1, {
                            swaggerOptions: {
                                persistAuthorization: true,
                                docExpansion: 'none',
                                filter: true,
                                showExtensions: true,
                                showCommonExtensions: true,
                            },
                        });
                        logger.log("Swagger docs available at: http://localhost:".concat(configService.get('PORT', 3000), "/").concat(swaggerPath));
                    }
                    // ─── Graceful Shutdown ───────────────────────────────────────────────────────
                    app.enableShutdownHooks();
                    port = configService.get('PORT', 3000);
                    return [4 /*yield*/, app.listen(port)];
                case 2:
                    _a.sent();
                    logger.log("\uD83D\uDE80 GovSetu API is running on: http://localhost:".concat(port, "/api/v1"));
                    logger.log("\uD83D\uDCDA Environment: ".concat(configService.get('NODE_ENV', 'development')));
                    return [2 /*return*/];
            }
        });
    });
}
bootstrap();
