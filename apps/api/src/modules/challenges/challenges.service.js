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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengesService = void 0;
var common_1 = require("@nestjs/common");
var user_role_enum_1 = require("../../common/enums/user-role.enum");
var platform_enum_1 = require("../../common/enums/platform.enum");
function generateSlug(title) {
    return (title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 200) +
        '-' +
        Date.now().toString(36));
}
// Allowed status transitions for the challenge lifecycle
var ALLOWED_TRANSITIONS = (_a = {},
    _a[platform_enum_1.ChallengeStatus.DRAFT] = [platform_enum_1.ChallengeStatus.INTERNAL_REVIEW, platform_enum_1.ChallengeStatus.CANCELLED],
    _a[platform_enum_1.ChallengeStatus.INTERNAL_REVIEW] = [platform_enum_1.ChallengeStatus.APPROVED, platform_enum_1.ChallengeStatus.DRAFT],
    _a[platform_enum_1.ChallengeStatus.APPROVED] = [platform_enum_1.ChallengeStatus.PUBLISHED, platform_enum_1.ChallengeStatus.DRAFT],
    _a[platform_enum_1.ChallengeStatus.PUBLISHED] = [platform_enum_1.ChallengeStatus.STARTUP_DISCOVERY, platform_enum_1.ChallengeStatus.CANCELLED],
    _a[platform_enum_1.ChallengeStatus.STARTUP_DISCOVERY] = [platform_enum_1.ChallengeStatus.EVALUATION],
    _a[platform_enum_1.ChallengeStatus.EVALUATION] = [platform_enum_1.ChallengeStatus.PILOT],
    _a[platform_enum_1.ChallengeStatus.PILOT] = [platform_enum_1.ChallengeStatus.PROCUREMENT, platform_enum_1.ChallengeStatus.EVALUATION],
    _a[platform_enum_1.ChallengeStatus.PROCUREMENT] = [platform_enum_1.ChallengeStatus.COMPLETED],
    _a[platform_enum_1.ChallengeStatus.COMPLETED] = [],
    _a[platform_enum_1.ChallengeStatus.CANCELLED] = [],
    _a);
var ChallengesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ChallengesService = _classThis = /** @class */ (function () {
        function ChallengesService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(ChallengesService.name);
        }
        ChallengesService_1.prototype.create = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                var slug, challenge;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (![user_role_enum_1.UserRole.GOVERNMENT_OFFICER, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN].includes(user.role)) {
                                throw new common_1.ForbiddenException('Only government officers can create challenges');
                            }
                            if (!user.organizationId) {
                                throw new common_1.BadRequestException('You must belong to a government organization to create challenges');
                            }
                            slug = generateSlug(dto.title);
                            return [4 /*yield*/, this.prisma.challenge.create({
                                    data: {
                                        organizationId: user.organizationId,
                                        createdById: user.sub,
                                        title: dto.title,
                                        slug: slug,
                                        description: dto.description,
                                        problemStatement: dto.problemStatement,
                                        desiredOutcome: dto.desiredOutcome,
                                        existingApproach: dto.existingApproach,
                                        sector: dto.sector,
                                        domain: dto.domain,
                                        location: dto.location,
                                        state: dto.state,
                                        targetBeneficiaries: dto.targetBeneficiaries,
                                        technicalRequirements: dto.technicalRequirements,
                                        functionalRequirements: dto.functionalRequirements,
                                        constraints: dto.constraints,
                                        eligibilityCriteria: dto.eligibilityCriteria,
                                        budgetMinLakh: dto.budgetMinLakh,
                                        budgetMaxLakh: dto.budgetMaxLakh,
                                        pilotDurationDays: dto.pilotDurationDays,
                                        submissionDeadline: dto.submissionDeadline
                                            ? new Date(dto.submissionDeadline)
                                            : undefined,
                                        evaluationCriteria: dto.evaluationCriteria ? dto.evaluationCriteria : undefined,
                                        status: platform_enum_1.ChallengeStatus.DRAFT,
                                    },
                                    include: { organization: { select: { id: true, name: true } }, createdBy: { select: { id: true, firstName: true, lastName: true } } },
                                })];
                        case 1:
                            challenge = _a.sent();
                            return [4 /*yield*/, this.prisma.auditLog.create({
                                    data: {
                                        actorId: user.sub,
                                        action: platform_enum_1.AuditAction.CHALLENGE_CREATED,
                                        entityType: 'Challenge',
                                        entityId: challenge.id,
                                        challengeId: challenge.id,
                                        newValue: { title: challenge.title, status: challenge.status },
                                    },
                                })];
                        case 2:
                            _a.sent();
                            this.logger.log("Challenge created: \"".concat(challenge.title, "\" by ").concat(user.email));
                            return [2 /*return*/, challenge];
                    }
                });
            });
        };
        ChallengesService_1.prototype.findAll = function (query, user) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, skip, where, _a, challenges, total;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            page = Math.max(1, parseInt((_b = query.page) !== null && _b !== void 0 ? _b : '1', 10));
                            limit = Math.min(50, parseInt((_c = query.limit) !== null && _c !== void 0 ? _c : '20', 10));
                            skip = (page - 1) * limit;
                            where = {};
                            // Non-admin users only see their org's challenges + published challenges
                            if (![user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN].includes(user.role)) {
                                if (user.role === user_role_enum_1.UserRole.STARTUP_USER) {
                                    // Startups only see published challenges
                                    where.status = platform_enum_1.ChallengeStatus.PUBLISHED;
                                }
                                else if (user.organizationId) {
                                    // Government users see their org's challenges
                                    where.organizationId = user.organizationId;
                                }
                            }
                            if (query.status)
                                where.status = query.status;
                            if (query.sector)
                                where.sector = { contains: query.sector, mode: 'insensitive' };
                            if (query.state)
                                where.state = { contains: query.state, mode: 'insensitive' };
                            if (query.organizationId)
                                where.organizationId = query.organizationId;
                            if (query.search) {
                                where.OR = [
                                    { title: { contains: query.search, mode: 'insensitive' } },
                                    { description: { contains: query.search, mode: 'insensitive' } },
                                    { problemStatement: { contains: query.search, mode: 'insensitive' } },
                                ];
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.challenge.findMany({
                                        where: where,
                                        skip: skip,
                                        take: limit,
                                        orderBy: { createdAt: 'desc' },
                                        include: {
                                            organization: { select: { id: true, name: true, logoUrl: true } },
                                            createdBy: { select: { id: true, firstName: true, lastName: true } },
                                            _count: { select: { applications: true } },
                                        },
                                    }),
                                    this.prisma.challenge.count({ where: where }),
                                ])];
                        case 1:
                            _a = _d.sent(), challenges = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    data: challenges,
                                    meta: { total: total, page: page, limit: limit, totalPages: Math.ceil(total / limit) },
                                }];
                    }
                });
            });
        };
        ChallengesService_1.prototype.findOne = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                var challenge;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.challenge.findUnique({
                                where: { id: id },
                                include: {
                                    organization: { select: { id: true, name: true, type: true, logoUrl: true } },
                                    createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
                                    _count: { select: { applications: true } },
                                },
                            })];
                        case 1:
                            challenge = _a.sent();
                            if (!challenge)
                                throw new common_1.NotFoundException("Challenge ".concat(id, " not found"));
                            // Startup users can only view published challenges
                            if (user.role === user_role_enum_1.UserRole.STARTUP_USER &&
                                challenge.status !== platform_enum_1.ChallengeStatus.PUBLISHED) {
                                throw new common_1.ForbiddenException('This challenge is not publicly available');
                            }
                            return [2 /*return*/, challenge];
                    }
                });
            });
        };
        ChallengesService_1.prototype.update = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                var challenge, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id, user)];
                        case 1:
                            challenge = _a.sent();
                            // Only the creating org or admins can edit
                            this.assertOwnerOrAdmin(challenge, user);
                            // Cannot edit published or completed challenges
                            if ([platform_enum_1.ChallengeStatus.COMPLETED, platform_enum_1.ChallengeStatus.CANCELLED].includes(challenge.status)) {
                                throw new common_1.BadRequestException('Cannot edit a completed or cancelled challenge');
                            }
                            return [4 /*yield*/, this.prisma.challenge.update({
                                    where: { id: id },
                                    data: __assign(__assign({}, dto), { submissionDeadline: dto.submissionDeadline
                                            ? new Date(dto.submissionDeadline)
                                            : undefined, evaluationCriteria: dto.evaluationCriteria ? dto.evaluationCriteria : undefined }),
                                })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.prisma.auditLog.create({
                                    data: {
                                        actorId: user.sub,
                                        action: platform_enum_1.AuditAction.CHALLENGE_UPDATED,
                                        entityType: 'Challenge',
                                        entityId: id,
                                        challengeId: id,
                                        previousValue: { title: challenge.title, status: challenge.status },
                                        newValue: __assign({ title: updated.title }, dto),
                                    },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        ChallengesService_1.prototype.transition = function (id, targetStatus, user) {
            return __awaiter(this, void 0, void 0, function () {
                var challenge, current, allowed, data, updated, action;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.findOne(id, user)];
                        case 1:
                            challenge = _b.sent();
                            this.assertOwnerOrAdmin(challenge, user);
                            current = challenge.status;
                            allowed = (_a = ALLOWED_TRANSITIONS[current]) !== null && _a !== void 0 ? _a : [];
                            if (!allowed.includes(targetStatus)) {
                                throw new common_1.BadRequestException("Cannot transition from ".concat(current, " to ").concat(targetStatus, ". Allowed: [").concat(allowed.join(', '), "]"));
                            }
                            data = { status: targetStatus };
                            if (targetStatus === platform_enum_1.ChallengeStatus.PUBLISHED) {
                                data.publishedAt = new Date();
                            }
                            if (targetStatus === platform_enum_1.ChallengeStatus.COMPLETED) {
                                data.completedAt = new Date();
                            }
                            return [4 /*yield*/, this.prisma.challenge.update({ where: { id: id }, data: data })];
                        case 2:
                            updated = _b.sent();
                            action = targetStatus === platform_enum_1.ChallengeStatus.PUBLISHED
                                ? platform_enum_1.AuditAction.CHALLENGE_PUBLISHED
                                : targetStatus === platform_enum_1.ChallengeStatus.CANCELLED
                                    ? platform_enum_1.AuditAction.CHALLENGE_CANCELLED
                                    : platform_enum_1.AuditAction.CHALLENGE_UPDATED;
                            return [4 /*yield*/, this.prisma.auditLog.create({
                                    data: {
                                        actorId: user.sub,
                                        action: action,
                                        entityType: 'Challenge',
                                        entityId: id,
                                        challengeId: id,
                                        previousValue: { status: current },
                                        newValue: { status: targetStatus },
                                    },
                                })];
                        case 3:
                            _b.sent();
                            this.logger.log("Challenge ".concat(id, " transitioned: ").concat(current, " \u2192 ").concat(targetStatus));
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        ChallengesService_1.prototype.getStatsByOrg = function (organizationId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, total, byStatus;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.prisma.challenge.count({ where: { organizationId: organizationId } }),
                                this.prisma.challenge.groupBy({
                                    by: ['status'],
                                    where: { organizationId: organizationId },
                                    _count: { status: true },
                                }),
                            ])];
                        case 1:
                            _a = _b.sent(), total = _a[0], byStatus = _a[1];
                            return [2 /*return*/, {
                                    total: total,
                                    byStatus: byStatus.reduce(function (acc, cur) {
                                        var _a;
                                        return (__assign(__assign({}, acc), (_a = {}, _a[cur.status] = cur._count.status, _a)));
                                    }, {}),
                                }];
                    }
                });
            });
        };
        ChallengesService_1.prototype.assertOwnerOrAdmin = function (challenge, user) {
            if ([user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.ADMIN].includes(user.role))
                return;
            if (user.organizationId !== challenge.organizationId) {
                throw new common_1.ForbiddenException('You can only manage challenges in your own organization');
            }
        };
        return ChallengesService_1;
    }());
    __setFunctionName(_classThis, "ChallengesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChallengesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChallengesService = _classThis;
}();
exports.ChallengesService = ChallengesService;
