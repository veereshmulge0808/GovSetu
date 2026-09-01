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
exports.ChallengesController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var roles_decorator_1 = require("../../shared/decorators/roles.decorator");
var user_role_enum_1 = require("../../common/enums/user-role.enum");
var platform_enum_1 = require("../../common/enums/platform.enum");
var class_validator_1 = require("class-validator");
var swagger_2 = require("@nestjs/swagger");
var TransitionDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function TransitionDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                __runInitializers(this, _status_extraInitializers);
            }
            return TransitionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_2.ApiProperty)({ enum: platform_enum_1.ChallengeStatus }), (0, class_validator_1.IsEnum)(platform_enum_1.ChallengeStatus)];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var ChallengesController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Challenges'), (0, swagger_1.ApiBearerAuth)('JWT-Auth'), (0, common_1.Controller)({ path: 'challenges', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _findOne_decorators;
    var _update_decorators;
    var _transition_decorators;
    var ChallengesController = _classThis = /** @class */ (function () {
        function ChallengesController_1(challengesService) {
            this.challengesService = (__runInitializers(this, _instanceExtraInitializers), challengesService);
        }
        ChallengesController_1.prototype.create = function (dto, user) {
            return this.challengesService.create(dto, user);
        };
        ChallengesController_1.prototype.findAll = function (query, user) {
            return this.challengesService.findAll(query, user);
        };
        ChallengesController_1.prototype.findOne = function (id, user) {
            return this.challengesService.findOne(id, user);
        };
        ChallengesController_1.prototype.update = function (id, dto, user) {
            return this.challengesService.update(id, dto, user);
        };
        ChallengesController_1.prototype.transition = function (id, dto, user) {
            return this.challengesService.transition(id, dto.status, user);
        };
        return ChallengesController_1;
    }());
    __setFunctionName(_classThis, "ChallengesController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.GOVERNMENT_OFFICER, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Create a new government innovation challenge' })];
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'List challenges with filters (role-based visibility)' })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get a single challenge by ID' }), (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid' })];
        _update_decorators = [(0, common_1.Patch)(':id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.GOVERNMENT_OFFICER, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Update challenge details (owner or admin only)' })];
        _transition_decorators = [(0, common_1.Patch)(':id/status'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.GOVERNMENT_OFFICER, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({
                summary: 'Transition challenge to a new status (lifecycle management)',
            })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _transition_decorators, { kind: "method", name: "transition", static: false, private: false, access: { has: function (obj) { return "transition" in obj; }, get: function (obj) { return obj.transition; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChallengesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChallengesController = _classThis;
}();
exports.ChallengesController = ChallengesController;
