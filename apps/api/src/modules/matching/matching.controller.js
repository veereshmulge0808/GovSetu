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
exports.MatchingController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var roles_decorator_1 = require("../../shared/decorators/roles.decorator");
var user_role_enum_1 = require("../../common/enums/user-role.enum");
var MatchingController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Matching'), (0, swagger_1.ApiBearerAuth)('JWT-Auth'), (0, common_1.Controller)({ path: 'matching', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _findAll_decorators;
    var _triggerMatching_decorators;
    var _getMatchScores_decorators;
    var _getRecommendations_decorators;
    var MatchingController = _classThis = /** @class */ (function () {
        function MatchingController_1(matchingService) {
            this.matchingService = (__runInitializers(this, _instanceExtraInitializers), matchingService);
        }
        MatchingController_1.prototype.findAll = function () {
            return this.matchingService.findAll();
        };
        MatchingController_1.prototype.triggerMatching = function (challengeId) {
            return this.matchingService.matchChallengeToStartups(challengeId);
        };
        MatchingController_1.prototype.getMatchScores = function (challengeId, limit) {
            return this.matchingService.getMatchScores(challengeId, limit ? parseInt(limit, 10) : 20);
        };
        MatchingController_1.prototype.getRecommendations = function (startupProfileId, limit) {
            return this.matchingService.getRecommendationsForStartup(startupProfileId, limit ? parseInt(limit, 10) : 10);
        };
        return MatchingController_1;
    }());
    __setFunctionName(_classThis, "MatchingController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Matching service info' })];
        _triggerMatching_decorators = [(0, common_1.Post)('challenge/:challengeId/run'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.GOVERNMENT_OFFICER, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Trigger AI matching for a challenge (government officers only)' }), (0, swagger_1.ApiParam)({ name: 'challengeId', type: 'string', format: 'uuid' })];
        _getMatchScores_decorators = [(0, common_1.Get)('challenge/:challengeId'), (0, swagger_1.ApiOperation)({ summary: 'Get AI match scores for a challenge' }), (0, swagger_1.ApiParam)({ name: 'challengeId', type: 'string', format: 'uuid' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: 'number' })];
        _getRecommendations_decorators = [(0, common_1.Get)('startup/:startupProfileId/recommendations'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.STARTUP_USER), (0, swagger_1.ApiOperation)({ summary: 'Get recommended challenges for a startup' }), (0, swagger_1.ApiParam)({ name: 'startupProfileId', type: 'string', format: 'uuid' })];
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _triggerMatching_decorators, { kind: "method", name: "triggerMatching", static: false, private: false, access: { has: function (obj) { return "triggerMatching" in obj; }, get: function (obj) { return obj.triggerMatching; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMatchScores_decorators, { kind: "method", name: "getMatchScores", static: false, private: false, access: { has: function (obj) { return "getMatchScores" in obj; }, get: function (obj) { return obj.getMatchScores; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRecommendations_decorators, { kind: "method", name: "getRecommendations", static: false, private: false, access: { has: function (obj) { return "getRecommendations" in obj; }, get: function (obj) { return obj.getRecommendations; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MatchingController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MatchingController = _classThis;
}();
exports.MatchingController = MatchingController;
