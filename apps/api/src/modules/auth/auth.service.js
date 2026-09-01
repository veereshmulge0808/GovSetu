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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = require("bcrypt");
var uuid_1 = require("uuid");
var user_role_enum_1 = require("../../common/enums/user-role.enum");
var platform_enum_1 = require("../../common/enums/platform.enum");
var SALT_ROUNDS = 12;
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(prisma, jwtService, config) {
            this.prisma = prisma;
            this.jwtService = jwtService;
            this.config = config;
            this.logger = new common_1.Logger(AuthService.name);
        }
        // ─── Registration ──────────────────────────────────────────────────────────
        AuthService_1.prototype.register = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, passwordHash, emailVerifyToken, user, tokens;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: dto.email.toLowerCase() },
                            })];
                        case 1:
                            existing = _c.sent();
                            if (existing) {
                                throw new common_1.ConflictException('An account with this email already exists');
                            }
                            return [4 /*yield*/, bcrypt.hash(dto.password, SALT_ROUNDS)];
                        case 2:
                            passwordHash = _c.sent();
                            emailVerifyToken = (0, uuid_1.v4)();
                            return [4 /*yield*/, this.prisma.user.create({
                                    data: {
                                        email: dto.email.toLowerCase(),
                                        passwordHash: passwordHash,
                                        firstName: dto.firstName,
                                        lastName: dto.lastName,
                                        phone: dto.phone,
                                        role: (_a = dto.role) !== null && _a !== void 0 ? _a : user_role_enum_1.UserRole.STARTUP_USER,
                                        organizationId: (_b = dto.organizationId) !== null && _b !== void 0 ? _b : null,
                                        emailVerifyToken: emailVerifyToken,
                                    },
                                })];
                        case 3:
                            user = _c.sent();
                            // Audit log
                            return [4 /*yield*/, this.prisma.auditLog.create({
                                    data: {
                                        actorId: user.id,
                                        action: platform_enum_1.AuditAction.USER_REGISTERED,
                                        entityType: 'User',
                                        entityId: user.id,
                                        newValue: { email: user.email, role: user.role },
                                    },
                                })];
                        case 4:
                            // Audit log
                            _c.sent();
                            this.logger.log("New user registered: ".concat(user.email, " [").concat(user.role, "]"));
                            return [4 /*yield*/, this.generateTokens(user.id, user.email, user.role, user.organizationId)];
                        case 5:
                            tokens = _c.sent();
                            return [4 /*yield*/, this.storeRefreshToken(user.id, tokens.refreshToken)];
                        case 6:
                            _c.sent();
                            return [2 /*return*/, __assign(__assign({}, tokens), { user: {
                                        id: user.id,
                                        email: user.email,
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        role: user.role,
                                        organizationId: user.organizationId,
                                    } })];
                    }
                });
            });
        };
        // ─── Login ─────────────────────────────────────────────────────────────────
        AuthService_1.prototype.login = function (dto, ipAddress) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isPasswordValid, tokens;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: dto.email.toLowerCase() },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user || !user.isActive) {
                                throw new common_1.UnauthorizedException('Invalid email or password');
                            }
                            return [4 /*yield*/, bcrypt.compare(dto.password, user.passwordHash)];
                        case 2:
                            isPasswordValid = _a.sent();
                            if (!isPasswordValid) {
                                throw new common_1.UnauthorizedException('Invalid email or password');
                            }
                            // Update last login timestamp
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: { lastLoginAt: new Date() },
                                })];
                        case 3:
                            // Update last login timestamp
                            _a.sent();
                            // Audit log
                            return [4 /*yield*/, this.prisma.auditLog.create({
                                    data: {
                                        actorId: user.id,
                                        action: platform_enum_1.AuditAction.USER_LOGIN,
                                        entityType: 'User',
                                        entityId: user.id,
                                        ipAddress: ipAddress,
                                    },
                                })];
                        case 4:
                            // Audit log
                            _a.sent();
                            this.logger.log("User logged in: ".concat(user.email));
                            return [4 /*yield*/, this.generateTokens(user.id, user.email, user.role, user.organizationId)];
                        case 5:
                            tokens = _a.sent();
                            return [4 /*yield*/, this.storeRefreshToken(user.id, tokens.refreshToken)];
                        case 6:
                            _a.sent();
                            return [2 /*return*/, __assign(__assign({}, tokens), { user: {
                                        id: user.id,
                                        email: user.email,
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        role: user.role,
                                        organizationId: user.organizationId,
                                    } })];
                    }
                });
            });
        };
        // ─── Refresh Token ─────────────────────────────────────────────────────────
        AuthService_1.prototype.refreshTokens = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, user, isTokenValid, tokens;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            try {
                                payload = this.jwtService.verify(dto.refreshToken, {
                                    secret: this.config.get('JWT_REFRESH_SECRET'),
                                });
                            }
                            catch (_b) {
                                throw new common_1.UnauthorizedException('Invalid or expired refresh token');
                            }
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { id: payload.sub },
                                    select: { id: true, email: true, role: true, organizationId: true, isActive: true, refreshToken: true },
                                })];
                        case 1:
                            user = _a.sent();
                            if (!user || !user.isActive) {
                                throw new common_1.UnauthorizedException('User account not found or inactive');
                            }
                            // Validate that the stored hashed refresh token matches
                            if (!user.refreshToken) {
                                throw new common_1.UnauthorizedException('Session expired — please login again');
                            }
                            return [4 /*yield*/, bcrypt.compare(dto.refreshToken, user.refreshToken)];
                        case 2:
                            isTokenValid = _a.sent();
                            if (!isTokenValid) {
                                throw new common_1.UnauthorizedException('Refresh token rotation: token mismatch');
                            }
                            return [4 /*yield*/, this.generateTokens(user.id, user.email, user.role, user.organizationId)];
                        case 3:
                            tokens = _a.sent();
                            return [4 /*yield*/, this.storeRefreshToken(user.id, tokens.refreshToken)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, __assign(__assign({}, tokens), { user: {
                                        id: user.id,
                                        email: user.email,
                                        firstName: '',
                                        lastName: '',
                                        role: user.role,
                                        organizationId: user.organizationId,
                                    } })];
                    }
                });
            });
        };
        // ─── Logout ────────────────────────────────────────────────────────────────
        AuthService_1.prototype.logout = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.update({
                                where: { id: userId },
                                data: { refreshToken: null },
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ─── Email Verification ─────────────────────────────────────────────────────
        AuthService_1.prototype.verifyEmail = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findFirst({
                                where: { emailVerifyToken: token },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.BadRequestException('Invalid or expired email verification token');
                            }
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: { isEmailVerified: true, emailVerifyToken: null },
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { message: 'Email verified successfully' }];
                    }
                });
            });
        };
        // ─── Forgot Password ───────────────────────────────────────────────────────
        AuthService_1.prototype.forgotPassword = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, resetToken, resetExpiry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: dto.email.toLowerCase() },
                            })];
                        case 1:
                            user = _a.sent();
                            // Return same message regardless to prevent email enumeration
                            if (!user) {
                                return [2 /*return*/, { message: 'If this email exists, a reset link will be sent' }];
                            }
                            resetToken = (0, uuid_1.v4)();
                            resetExpiry = new Date(Date.now() + 60 * 60 * 1000);
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: { passwordResetToken: resetToken, passwordResetExpiry: resetExpiry },
                                })];
                        case 2:
                            _a.sent();
                            // TODO: Send email via EmailService (Task 14)
                            this.logger.log("Password reset requested for: ".concat(user.email, ", token: ").concat(resetToken));
                            return [2 /*return*/, { message: 'If this email exists, a reset link will be sent' }];
                    }
                });
            });
        };
        // ─── Reset Password ─────────────────────────────────────────────────────────
        AuthService_1.prototype.resetPassword = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, passwordHash;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findFirst({
                                where: {
                                    passwordResetToken: dto.token,
                                    passwordResetExpiry: { gt: new Date() },
                                },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.BadRequestException('Invalid or expired password reset token');
                            }
                            return [4 /*yield*/, bcrypt.hash(dto.newPassword, SALT_ROUNDS)];
                        case 2:
                            passwordHash = _a.sent();
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: {
                                        passwordHash: passwordHash,
                                        passwordResetToken: null,
                                        passwordResetExpiry: null,
                                        refreshToken: null, // Invalidate all sessions
                                    },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { message: 'Password reset successfully' }];
                    }
                });
            });
        };
        // ─── Change Password ────────────────────────────────────────────────────────
        AuthService_1.prototype.changePassword = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isCurrentValid, passwordHash;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({ where: { id: userId } })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.NotFoundException('User not found');
                            }
                            return [4 /*yield*/, bcrypt.compare(dto.currentPassword, user.passwordHash)];
                        case 2:
                            isCurrentValid = _a.sent();
                            if (!isCurrentValid) {
                                throw new common_1.UnauthorizedException('Current password is incorrect');
                            }
                            return [4 /*yield*/, bcrypt.hash(dto.newPassword, SALT_ROUNDS)];
                        case 3:
                            passwordHash = _a.sent();
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: userId },
                                    data: { passwordHash: passwordHash, refreshToken: null },
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, { message: 'Password changed successfully' }];
                    }
                });
            });
        };
        // ─── Internal Helpers ───────────────────────────────────────────────────────
        AuthService_1.prototype.generateTokens = function (userId, email, role, organizationId) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, _a, accessToken, refreshToken;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            payload = { sub: userId, email: email, role: role, organizationId: organizationId };
                            return [4 /*yield*/, Promise.all([
                                    this.jwtService.signAsync(payload, {
                                        secret: this.config.get('JWT_SECRET'),
                                        expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
                                    }),
                                    this.jwtService.signAsync(payload, {
                                        secret: this.config.get('JWT_REFRESH_SECRET'),
                                        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
                                    }),
                                ])];
                        case 1:
                            _a = _b.sent(), accessToken = _a[0], refreshToken = _a[1];
                            return [2 /*return*/, {
                                    accessToken: accessToken,
                                    refreshToken: refreshToken,
                                    expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.storeRefreshToken = function (userId, refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                var hashed;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, bcrypt.hash(refreshToken, SALT_ROUNDS)];
                        case 1:
                            hashed = _a.sent();
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: userId },
                                    data: { refreshToken: hashed },
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
