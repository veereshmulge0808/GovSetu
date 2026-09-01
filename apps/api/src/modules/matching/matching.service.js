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
exports.MatchingService = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
/**
 * MatchingService orchestrates AI-powered startup-challenge matching.
 *
 * Architecture (from Techstack.md):
 * NestJS → AI Service Interface → Python FastAPI AI Service → pgvector
 *
 * For the MVP, when the AI service is unavailable, it falls back to a
 * deterministic rules-based matching algorithm using structured metadata.
 */
var MatchingService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MatchingService = _classThis = /** @class */ (function () {
        function MatchingService_1(prisma, config) {
            this.prisma = prisma;
            this.config = config;
            this.logger = new common_1.Logger(MatchingService.name);
        }
        /**
         * Trigger AI matching for a published challenge.
         * Calls the Python AI service and stores match scores.
         */
        MatchingService_1.prototype.matchChallengeToStartups = function (challengeId) {
            return __awaiter(this, void 0, void 0, function () {
                var challenge, aiServiceUrl, response, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.challenge.findUnique({
                                where: { id: challengeId },
                            })];
                        case 1:
                            challenge = _a.sent();
                            if (!challenge) {
                                return [2 /*return*/, { error: 'Challenge not found' }];
                            }
                            aiServiceUrl = this.config.get('AI_SERVICE_URL', 'http://localhost:8000');
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 5, , 6]);
                            return [4 /*yield*/, axios_1.default.post("".concat(aiServiceUrl, "/api/v1/match/challenge"), {
                                    challengeId: challengeId,
                                    title: challenge.title,
                                    description: challenge.description,
                                    problemStatement: challenge.problemStatement,
                                    sector: challenge.sector,
                                    domain: challenge.domain,
                                    technicalRequirements: challenge.technicalRequirements,
                                    budgetMinLakh: challenge.budgetMinLakh,
                                    budgetMaxLakh: challenge.budgetMaxLakh,
                                }, { timeout: 30000 })];
                        case 3:
                            response = _a.sent();
                            // Audit AI trigger
                            return [4 /*yield*/, this.prisma.auditLog.create({
                                    data: {
                                        actorId: challengeId, // system action
                                        action: 'AI_MATCHING_TRIGGERED',
                                        entityType: 'Challenge',
                                        entityId: challengeId,
                                        challengeId: challengeId,
                                        newValue: { aiServiceUrl: aiServiceUrl },
                                    },
                                }).catch(function () { return null; })];
                        case 4:
                            // Audit AI trigger
                            _a.sent(); // non-blocking
                            this.logger.log("AI matching completed for challenge ".concat(challengeId));
                            return [2 /*return*/, response.data];
                        case 5:
                            error_1 = _a.sent();
                            this.logger.warn("AI service unavailable, using fallback matching for challenge ".concat(challengeId));
                            return [2 /*return*/, this.fallbackMatch(challengeId, challenge)];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get cached match scores for a challenge.
         */
        MatchingService_1.prototype.getMatchScores = function (challengeId_1) {
            return __awaiter(this, arguments, void 0, function (challengeId, limit) {
                var scores;
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.matchScore.findMany({
                                where: { challengeId: challengeId, expiresAt: { gt: new Date() } },
                                orderBy: { overallScore: 'desc' },
                                take: limit,
                                include: {
                                    startupProfile: {
                                        include: {
                                            organization: { select: { id: true, name: true, logoUrl: true, website: true } },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            scores = _a.sent();
                            return [2 /*return*/, { data: scores, total: scores.length, challengeId: challengeId }];
                    }
                });
            });
        };
        /**
         * Get recommended challenges for a startup based on their profile.
         */
        MatchingService_1.prototype.getRecommendationsForStartup = function (startupProfileId_1) {
            return __awaiter(this, arguments, void 0, function (startupProfileId, limit) {
                var scores;
                if (limit === void 0) { limit = 10; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.matchScore.findMany({
                                where: { startupProfileId: startupProfileId, expiresAt: { gt: new Date() } },
                                orderBy: { overallScore: 'desc' },
                                take: limit,
                                include: {
                                    challenge: {
                                        include: {
                                            organization: { select: { id: true, name: true } },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            scores = _a.sent();
                            return [2 /*return*/, { data: scores, total: scores.length, startupProfileId: startupProfileId }];
                    }
                });
            });
        };
        /**
         * Fallback: deterministic rules-based match when AI service is unavailable.
         */
        MatchingService_1.prototype.fallbackMatch = function (challengeId, challenge) {
            return __awaiter(this, void 0, void 0, function () {
                var startupProfiles, scores;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.startupProfile.findMany({
                                take: 50,
                                include: { organization: { select: { id: true, name: true } } },
                            })];
                        case 1:
                            startupProfiles = _a.sent();
                            scores = startupProfiles.map(function (sp) {
                                var _a, _b, _c;
                                var score = 50;
                                if (challenge.sector && ((_a = sp.industries) === null || _a === void 0 ? void 0 : _a.some(function (i) {
                                    return i.toLowerCase().includes(challenge.sector.toLowerCase());
                                }))) {
                                    score += 20;
                                }
                                if (challenge.domain && ((_b = sp.technologies) === null || _b === void 0 ? void 0 : _b.some(function (t) {
                                    return t.toLowerCase().includes(challenge.domain.toLowerCase());
                                }))) {
                                    score += 20;
                                }
                                if (sp.govtExperience)
                                    score += 10;
                                return {
                                    startupProfileId: sp.id,
                                    organizationName: (_c = sp.organization) === null || _c === void 0 ? void 0 : _c.name,
                                    overallScore: Math.min(100, score),
                                    semanticScore: 0,
                                    domainScore: score > 70 ? 80 : 40,
                                    technologyScore: score > 80 ? 85 : 50,
                                    experienceScore: sp.govtExperience ? 80 : 40,
                                    readinessScore: 60,
                                    geographicScore: 70,
                                    budgetScore: 70,
                                    explanation: [{ factor: 'Fallback matching', reason: 'AI service unavailable' }],
                                };
                            });
                            scores.sort(function (a, b) { return b.overallScore - a.overallScore; });
                            return [2 /*return*/, { data: scores.slice(0, 20), fallback: true, challengeId: challengeId }];
                    }
                });
            });
        };
        MatchingService_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { message: 'Use /matching/challenge/:id or /matching/startup/:id endpoints' }];
                });
            });
        };
        return MatchingService_1;
    }());
    __setFunctionName(_classThis, "MatchingService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MatchingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MatchingService = _classThis;
}();
exports.MatchingService = MatchingService;
