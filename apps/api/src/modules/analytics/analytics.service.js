"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
var common_1 = require("@nestjs/common");
var platform_enum_1 = require("../../common/enums/platform.enum");
var AnalyticsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AnalyticsService = _classThis = /** @class */ (function () {
        function AnalyticsService_1(prisma) {
            this.prisma = prisma;
        }
        /**
         * Platform-wide summary statistics (Admin only).
         */
        AnalyticsService_1.prototype.getPlatformStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, totalUsers, totalOrganizations, totalStartups, totalGovtOrgs, totalChallenges, publishedChallenges, totalApplications, totalPilots, activePilots, totalProcurements;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.prisma.user.count({ where: { isActive: true } }),
                                this.prisma.organization.count({ where: { isActive: true } }),
                                this.prisma.organization.count({ where: { type: 'STARTUP', isActive: true } }),
                                this.prisma.organization.count({ where: { type: 'GOVERNMENT', isActive: true } }),
                                this.prisma.challenge.count(),
                                this.prisma.challenge.count({ where: { status: platform_enum_1.ChallengeStatus.PUBLISHED } }),
                                this.prisma.application.count(),
                                this.prisma.pilot.count(),
                                this.prisma.pilot.count({ where: { status: platform_enum_1.PilotStatus.IN_PROGRESS } }),
                                this.prisma.procurement.count(),
                            ])];
                        case 1:
                            _a = _b.sent(), totalUsers = _a[0], totalOrganizations = _a[1], totalStartups = _a[2], totalGovtOrgs = _a[3], totalChallenges = _a[4], publishedChallenges = _a[5], totalApplications = _a[6], totalPilots = _a[7], activePilots = _a[8], totalProcurements = _a[9];
                            return [2 /*return*/, {
                                    users: { total: totalUsers },
                                    organizations: { total: totalOrganizations, government: totalGovtOrgs, startups: totalStartups },
                                    challenges: { total: totalChallenges, published: publishedChallenges },
                                    applications: { total: totalApplications },
                                    pilots: { total: totalPilots, active: activePilots },
                                    procurement: { total: totalProcurements },
                                }];
                    }
                });
            });
        };
        /**
         * Dashboard data for government officers — scoped to their organization.
         */
        AnalyticsService_1.prototype.getGovernmentDashboard = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var orgId, _a, challenges, applicationCounts, pilots;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            orgId = user.organizationId;
                            if (!orgId)
                                return [2 /*return*/, { message: 'No organization linked' }];
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.challenge.groupBy({
                                        by: ['status'],
                                        where: { organizationId: orgId },
                                        _count: { status: true },
                                    }),
                                    this.prisma.application.count({
                                        where: { challenge: { organizationId: orgId } },
                                    }),
                                    this.prisma.pilot.findMany({
                                        where: { challenge: { organizationId: orgId }, status: platform_enum_1.PilotStatus.IN_PROGRESS },
                                        select: { id: true, title: true, status: true, plannedEndDate: true },
                                        take: 5,
                                    }),
                                ])];
                        case 1:
                            _a = _b.sent(), challenges = _a[0], applicationCounts = _a[1], pilots = _a[2];
                            return [2 /*return*/, {
                                    challengesByStatus: challenges.reduce(function (acc, cur) {
                                        var _a;
                                        return (__assign(__assign({}, acc), (_a = {}, _a[cur.status] = cur._count.status, _a)));
                                    }, {}),
                                    totalApplicationsReceived: applicationCounts,
                                    activePilots: pilots,
                                }];
                    }
                });
            });
        };
        /**
         * Dashboard data for startup users — scoped to their startup profile.
         */
        AnalyticsService_1.prototype.getStartupDashboard = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var startupProfile, _a, applicationsByStatus, activeMatches, upcomingDeadlines;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.startupProfile.findFirst({
                                where: { organizationId: (_b = user.organizationId) !== null && _b !== void 0 ? _b : undefined },
                            })];
                        case 1:
                            startupProfile = _c.sent();
                            if (!startupProfile)
                                return [2 /*return*/, { message: 'No startup profile found' }];
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.application.groupBy({
                                        by: ['status'],
                                        where: { startupProfileId: startupProfile.id },
                                        _count: { status: true },
                                    }),
                                    this.prisma.matchScore.count({
                                        where: {
                                            startupProfileId: startupProfile.id,
                                            overallScore: { gte: 70 },
                                            expiresAt: { gt: new Date() },
                                        },
                                    }),
                                    this.prisma.challenge.findMany({
                                        where: {
                                            status: platform_enum_1.ChallengeStatus.PUBLISHED,
                                            submissionDeadline: { gte: new Date(), lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
                                        },
                                        select: { id: true, title: true, submissionDeadline: true, sector: true },
                                        orderBy: { submissionDeadline: 'asc' },
                                        take: 5,
                                    }),
                                ])];
                        case 2:
                            _a = _c.sent(), applicationsByStatus = _a[0], activeMatches = _a[1], upcomingDeadlines = _a[2];
                            return [2 /*return*/, {
                                    applicationsByStatus: applicationsByStatus.reduce(function (acc, cur) {
                                        var _a;
                                        return (__assign(__assign({}, acc), (_a = {}, _a[cur.status] = cur._count.status, _a)));
                                    }, {}),
                                    strongMatches: activeMatches,
                                    upcomingDeadlines: upcomingDeadlines,
                                }];
                    }
                });
            });
        };
        AnalyticsService_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { message: 'Use /analytics/platform, /analytics/government, or /analytics/startup' }];
                });
            });
        };
        return AnalyticsService_1;
    }());
    __setFunctionName(_classThis, "AnalyticsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnalyticsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnalyticsService = _classThis;
}();
exports.AnalyticsService = AnalyticsService;
