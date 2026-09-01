"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
var public_decorator_1 = require("../../shared/decorators/public.decorator");
var AuthController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Auth'), (0, common_1.Controller)({ path: 'auth', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _register_decorators;
    var _login_decorators;
    var _refreshTokens_decorators;
    var _logout_decorators;
    var _verifyEmail_decorators;
    var _forgotPassword_decorators;
    var _resetPassword_decorators;
    var _changePassword_decorators;
    var _getMe_decorators;
    var AuthController = _classThis = /** @class */ (function () {
        function AuthController_1(authService) {
            this.authService = (__runInitializers(this, _instanceExtraInitializers), authService);
        }
        AuthController_1.prototype.register = function (dto) {
            return this.authService.register(dto);
        };
        AuthController_1.prototype.login = function (dto, req) {
            var ipAddress = req.headers['x-forwarded-for'] || req.ip;
            return this.authService.login(dto, ipAddress);
        };
        AuthController_1.prototype.refreshTokens = function (dto) {
            return this.authService.refreshTokens(dto);
        };
        AuthController_1.prototype.logout = function (user) {
            return this.authService.logout(user.sub);
        };
        AuthController_1.prototype.verifyEmail = function (token) {
            return this.authService.verifyEmail(token);
        };
        AuthController_1.prototype.forgotPassword = function (dto) {
            return this.authService.forgotPassword(dto);
        };
        AuthController_1.prototype.resetPassword = function (dto) {
            return this.authService.resetPassword(dto);
        };
        AuthController_1.prototype.changePassword = function (user, dto) {
            return this.authService.changePassword(user.sub, dto);
        };
        AuthController_1.prototype.getMe = function (user) {
            return user;
        };
        return AuthController_1;
    }());
    __setFunctionName(_classThis, "AuthController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _register_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Post)('register'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Register a new user account' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'User registered and tokens returned' }), (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already in use' })];
        _login_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Post)('login'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Login with email and password' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful, tokens returned' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' })];
        _refreshTokens_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Post)('refresh'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Refresh access token using a valid refresh token' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'New token pair issued' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid refresh token' })];
        _logout_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Post)('logout'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiBearerAuth)('JWT-Auth'), (0, swagger_1.ApiOperation)({ summary: 'Logout current user (invalidates refresh token)' })];
        _verifyEmail_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Get)('verify-email'), (0, swagger_1.ApiOperation)({ summary: 'Verify email address using token from email link' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Email verified' })];
        _forgotPassword_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Post)('forgot-password'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Request a password reset email' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Reset email sent if account exists' })];
        _resetPassword_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Post)('reset-password'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Reset password using token from email' })];
        _changePassword_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Post)('change-password'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiBearerAuth)('JWT-Auth'), (0, swagger_1.ApiOperation)({ summary: 'Change password for authenticated user' })];
        _getMe_decorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Get)('me'), (0, swagger_1.ApiBearerAuth)('JWT-Auth'), (0, swagger_1.ApiOperation)({ summary: 'Get current authenticated user profile' })];
        __esDecorate(_classThis, null, _register_decorators, { kind: "method", name: "register", static: false, private: false, access: { has: function (obj) { return "register" in obj; }, get: function (obj) { return obj.register; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _login_decorators, { kind: "method", name: "login", static: false, private: false, access: { has: function (obj) { return "login" in obj; }, get: function (obj) { return obj.login; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _refreshTokens_decorators, { kind: "method", name: "refreshTokens", static: false, private: false, access: { has: function (obj) { return "refreshTokens" in obj; }, get: function (obj) { return obj.refreshTokens; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logout_decorators, { kind: "method", name: "logout", static: false, private: false, access: { has: function (obj) { return "logout" in obj; }, get: function (obj) { return obj.logout; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifyEmail_decorators, { kind: "method", name: "verifyEmail", static: false, private: false, access: { has: function (obj) { return "verifyEmail" in obj; }, get: function (obj) { return obj.verifyEmail; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _forgotPassword_decorators, { kind: "method", name: "forgotPassword", static: false, private: false, access: { has: function (obj) { return "forgotPassword" in obj; }, get: function (obj) { return obj.forgotPassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resetPassword_decorators, { kind: "method", name: "resetPassword", static: false, private: false, access: { has: function (obj) { return "resetPassword" in obj; }, get: function (obj) { return obj.resetPassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _changePassword_decorators, { kind: "method", name: "changePassword", static: false, private: false, access: { has: function (obj) { return "changePassword" in obj; }, get: function (obj) { return obj.changePassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMe_decorators, { kind: "method", name: "getMe", static: false, private: false, access: { has: function (obj) { return "getMe" in obj; }, get: function (obj) { return obj.getMe; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthController = _classThis;
}();
exports.AuthController = AuthController;
