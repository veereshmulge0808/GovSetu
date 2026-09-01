"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var throttler_1 = require("@nestjs/throttler");
var event_emitter_1 = require("@nestjs/event-emitter");
var schedule_1 = require("@nestjs/schedule");
var bull_1 = require("@nestjs/bull");
// Feature Modules
var auth_module_1 = require("./modules/auth/auth.module");
var users_module_1 = require("./modules/users/users.module");
var organizations_module_1 = require("./modules/organizations/organizations.module");
var challenges_module_1 = require("./modules/challenges/challenges.module");
var startups_module_1 = require("./modules/startups/startups.module");
var applications_module_1 = require("./modules/applications/applications.module");
var evaluations_module_1 = require("./modules/evaluations/evaluations.module");
var pilots_module_1 = require("./modules/pilots/pilots.module");
var procurement_module_1 = require("./modules/procurement/procurement.module");
var matching_module_1 = require("./modules/matching/matching.module");
var notifications_module_1 = require("./modules/notifications/notifications.module");
var analytics_module_1 = require("./modules/analytics/analytics.module");
var audit_module_1 = require("./modules/audit/audit.module");
// Infrastructure
var prisma_module_1 = require("./infrastructure/prisma/prisma.module");
var storage_module_1 = require("./infrastructure/storage/storage.module");
var email_module_1 = require("./infrastructure/email/email.module");
// App controller (health check)
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var configuration_1 = require("./config/configuration");
var env_validation_1 = require("./config/env.validation");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                // ─── Configuration ──────────────────────────────────────────────────────
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    load: [configuration_1.default],
                    validate: env_validation_1.validate,
                    envFilePath: ['.env', '.env.local'],
                    expandVariables: true,
                }),
                // ─── Rate Limiting ───────────────────────────────────────────────────────
                throttler_1.ThrottlerModule.forRootAsync({
                    inject: [config_1.ConfigService],
                    useFactory: function (config) { return [
                        {
                            ttl: config.get('THROTTLE_TTL', 60000),
                            limit: config.get('THROTTLE_LIMIT', 100),
                        },
                    ]; },
                }),
                // ─── Event Emitter (internal domain events) ──────────────────────────────
                event_emitter_1.EventEmitterModule.forRoot({
                    wildcard: false,
                    delimiter: '.',
                    newListener: false,
                    removeListener: false,
                    maxListeners: 20,
                    verboseMemoryLeak: true,
                    ignoreErrors: false,
                }),
                // ─── Cron Scheduler ─────────────────────────────────────────────────────
                schedule_1.ScheduleModule.forRoot(),
                // ─── BullMQ Queue ───────────────────────────────────────────────────────
                bull_1.BullModule.forRootAsync({
                    inject: [config_1.ConfigService],
                    useFactory: function (config) { return ({
                        redis: {
                            host: config.get('REDIS_HOST', 'localhost'),
                            port: config.get('REDIS_PORT', 6379),
                            password: config.get('REDIS_PASSWORD') || undefined,
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
                    }); },
                }),
                // ─── Infrastructure ─────────────────────────────────────────────────────
                prisma_module_1.PrismaModule,
                storage_module_1.StorageModule,
                email_module_1.EmailModule,
                // ─── Feature Modules ────────────────────────────────────────────────────
                auth_module_1.AuthModule,
                users_module_1.UsersModule,
                organizations_module_1.OrganizationsModule,
                challenges_module_1.ChallengesModule,
                startups_module_1.StartupsModule,
                applications_module_1.ApplicationsModule,
                evaluations_module_1.EvaluationsModule,
                pilots_module_1.PilotsModule,
                procurement_module_1.ProcurementModule,
                matching_module_1.MatchingModule,
                notifications_module_1.NotificationsModule,
                analytics_module_1.AnalyticsModule,
                audit_module_1.AuditModule,
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
