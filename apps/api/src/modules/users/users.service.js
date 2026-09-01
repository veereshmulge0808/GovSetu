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
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var user_role_enum_1 = require("../../common/enums/user-role.enum");
var platform_enum_1 = require("../../common/enums/platform.enum");
// Fields to return for a user — never expose password hash
var USER_SELECT = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    phone: true,
    avatarUrl: true,
    role: true,
    isEmailVerified: true,
    isActive: true,
    lastLoginAt: true,
    organizationId: true,
    organization: {
        select: { id: true, name: true, type: true, logoUrl: true },
    },
    createdAt: true,
    updatedAt: true,
};
var UsersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UsersService = _classThis = /** @class */ (function () {
        function UsersService_1(prisma) {
            this.prisma = prisma;
        }
        UsersService_1.prototype.findAll = function (query, requestor) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, skip, where, _a, users, total;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            // Only admins can list all users
                            if (![user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.ADMIN].includes(requestor.role)) {
                                throw new common_1.ForbiddenException('Only administrators can list all users');
                            }
                            page = Math.max(1, parseInt((_b = query.page) !== null && _b !== void 0 ? _b : '1', 10));
                            limit = Math.min(100, parseInt((_c = query.limit) !== null && _c !== void 0 ? _c : '20', 10));
                            skip = (page - 1) * limit;
                            where = {};
                            if (query.search) {
                                where.OR = [
                                    { email: { contains: query.search, mode: 'insensitive' } },
                                    { firstName: { contains: query.search, mode: 'insensitive' } },
                                    { lastName: { contains: query.search, mode: 'insensitive' } },
                                ];
                            }
                            if (query.role)
                                where.role = query.role;
                            if (query.organizationId)
                                where.organizationId = query.organizationId;
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.user.findMany({ where: where, select: USER_SELECT, skip: skip, take: limit, orderBy: { createdAt: 'desc' } }),
                                    this.prisma.user.count({ where: where }),
                                ])];
                        case 1:
                            _a = _d.sent(), users = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    data: users,
                                    meta: { total: total, page: page, limit: limit, totalPages: Math.ceil(total / limit) },
                                }];
                    }
                });
            });
        };
        UsersService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: id },
                                select: USER_SELECT,
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException("User with ID ".concat(id, " not found"));
                            return [2 /*return*/, user];
                    }
                });
            });
        };
        UsersService_1.prototype.getMyProfile = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.findOne(userId)];
                });
            });
        };
        UsersService_1.prototype.updateProfile = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(userId)];
                        case 1:
                            _a.sent(); // ensures user exists
                            return [2 /*return*/, this.prisma.user.update({
                                    where: { id: userId },
                                    data: dto,
                                    select: USER_SELECT,
                                })];
                    }
                });
            });
        };
        UsersService_1.prototype.updateRole = function (id, dto, requestor) {
            return __awaiter(this, void 0, void 0, function () {
                var user, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (![user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.ADMIN].includes(requestor.role)) {
                                throw new common_1.ForbiddenException('Only administrators can change user roles');
                            }
                            return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            user = _a.sent();
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: id },
                                    data: { role: dto.role, organizationId: dto.organizationId },
                                    select: USER_SELECT,
                                })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.prisma.auditLog.create({
                                    data: {
                                        actorId: requestor.sub,
                                        action: platform_enum_1.AuditAction.USER_ROLE_CHANGED,
                                        entityType: 'User',
                                        entityId: id,
                                        previousValue: { role: user.role },
                                        newValue: { role: dto.role, organizationId: dto.organizationId },
                                    },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        UsersService_1.prototype.deactivateUser = function (id, requestor) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (![user_role_enum_1.UserRole.SUPER_ADMIN, user_role_enum_1.UserRole.ADMIN].includes(requestor.role)) {
                                throw new common_1.ForbiddenException('Only administrators can deactivate users');
                            }
                            if (id === requestor.sub) {
                                throw new common_1.ForbiddenException('You cannot deactivate your own account');
                            }
                            return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            user = _a.sent();
                            return [4 /*yield*/, this.prisma.user.update({ where: { id: id }, data: { isActive: false } })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.auditLog.create({
                                    data: {
                                        actorId: requestor.sub,
                                        action: platform_enum_1.AuditAction.USER_DISABLED,
                                        entityType: 'User',
                                        entityId: id,
                                        previousValue: { isActive: true },
                                        newValue: { isActive: false },
                                    },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { message: "User ".concat(user.email, " has been deactivated") }];
                    }
                });
            });
        };
        return UsersService_1;
    }());
    __setFunctionName(_classThis, "UsersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsersService = _classThis;
}();
exports.UsersService = UsersService;
