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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var Environment;
(function (Environment) {
    Environment["Development"] = "development";
    Environment["Production"] = "production";
    Environment["Test"] = "test";
    Environment["Staging"] = "staging";
})(Environment || (Environment = {}));
var EnvironmentVariables = function () {
    var _a;
    var _NODE_ENV_decorators;
    var _NODE_ENV_initializers = [];
    var _NODE_ENV_extraInitializers = [];
    var _PORT_decorators;
    var _PORT_initializers = [];
    var _PORT_extraInitializers = [];
    var _DATABASE_URL_decorators;
    var _DATABASE_URL_initializers = [];
    var _DATABASE_URL_extraInitializers = [];
    var _REDIS_HOST_decorators;
    var _REDIS_HOST_initializers = [];
    var _REDIS_HOST_extraInitializers = [];
    var _REDIS_PORT_decorators;
    var _REDIS_PORT_initializers = [];
    var _REDIS_PORT_extraInitializers = [];
    var _JWT_SECRET_decorators;
    var _JWT_SECRET_initializers = [];
    var _JWT_SECRET_extraInitializers = [];
    var _JWT_REFRESH_SECRET_decorators;
    var _JWT_REFRESH_SECRET_initializers = [];
    var _JWT_REFRESH_SECRET_extraInitializers = [];
    var _JWT_EXPIRES_IN_decorators;
    var _JWT_EXPIRES_IN_initializers = [];
    var _JWT_EXPIRES_IN_extraInitializers = [];
    var _JWT_REFRESH_EXPIRES_IN_decorators;
    var _JWT_REFRESH_EXPIRES_IN_initializers = [];
    var _JWT_REFRESH_EXPIRES_IN_extraInitializers = [];
    var _STORAGE_ACCESS_KEY_decorators;
    var _STORAGE_ACCESS_KEY_initializers = [];
    var _STORAGE_ACCESS_KEY_extraInitializers = [];
    var _STORAGE_SECRET_KEY_decorators;
    var _STORAGE_SECRET_KEY_initializers = [];
    var _STORAGE_SECRET_KEY_extraInitializers = [];
    return _a = /** @class */ (function () {
            function EnvironmentVariables() {
                this.NODE_ENV = __runInitializers(this, _NODE_ENV_initializers, Environment.Development);
                this.PORT = (__runInitializers(this, _NODE_ENV_extraInitializers), __runInitializers(this, _PORT_initializers, 3000));
                this.DATABASE_URL = (__runInitializers(this, _PORT_extraInitializers), __runInitializers(this, _DATABASE_URL_initializers, void 0));
                this.REDIS_HOST = (__runInitializers(this, _DATABASE_URL_extraInitializers), __runInitializers(this, _REDIS_HOST_initializers, 'localhost'));
                this.REDIS_PORT = (__runInitializers(this, _REDIS_HOST_extraInitializers), __runInitializers(this, _REDIS_PORT_initializers, 6379));
                this.JWT_SECRET = (__runInitializers(this, _REDIS_PORT_extraInitializers), __runInitializers(this, _JWT_SECRET_initializers, void 0));
                this.JWT_REFRESH_SECRET = (__runInitializers(this, _JWT_SECRET_extraInitializers), __runInitializers(this, _JWT_REFRESH_SECRET_initializers, void 0));
                this.JWT_EXPIRES_IN = (__runInitializers(this, _JWT_REFRESH_SECRET_extraInitializers), __runInitializers(this, _JWT_EXPIRES_IN_initializers, '15m'));
                this.JWT_REFRESH_EXPIRES_IN = (__runInitializers(this, _JWT_EXPIRES_IN_extraInitializers), __runInitializers(this, _JWT_REFRESH_EXPIRES_IN_initializers, '7d'));
                this.STORAGE_ACCESS_KEY = (__runInitializers(this, _JWT_REFRESH_EXPIRES_IN_extraInitializers), __runInitializers(this, _STORAGE_ACCESS_KEY_initializers, 'minioadmin'));
                this.STORAGE_SECRET_KEY = (__runInitializers(this, _STORAGE_ACCESS_KEY_extraInitializers), __runInitializers(this, _STORAGE_SECRET_KEY_initializers, 'minioadmin'));
                __runInitializers(this, _STORAGE_SECRET_KEY_extraInitializers);
            }
            return EnvironmentVariables;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _NODE_ENV_decorators = [(0, class_validator_1.IsEnum)(Environment), (0, class_validator_1.IsOptional)()];
            _PORT_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(65535), (0, class_validator_1.IsOptional)()];
            _DATABASE_URL_decorators = [(0, class_validator_1.IsString)()];
            _REDIS_HOST_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _REDIS_PORT_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _JWT_SECRET_decorators = [(0, class_validator_1.IsString)()];
            _JWT_REFRESH_SECRET_decorators = [(0, class_validator_1.IsString)()];
            _JWT_EXPIRES_IN_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _JWT_REFRESH_EXPIRES_IN_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _STORAGE_ACCESS_KEY_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _STORAGE_SECRET_KEY_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _NODE_ENV_decorators, { kind: "field", name: "NODE_ENV", static: false, private: false, access: { has: function (obj) { return "NODE_ENV" in obj; }, get: function (obj) { return obj.NODE_ENV; }, set: function (obj, value) { obj.NODE_ENV = value; } }, metadata: _metadata }, _NODE_ENV_initializers, _NODE_ENV_extraInitializers);
            __esDecorate(null, null, _PORT_decorators, { kind: "field", name: "PORT", static: false, private: false, access: { has: function (obj) { return "PORT" in obj; }, get: function (obj) { return obj.PORT; }, set: function (obj, value) { obj.PORT = value; } }, metadata: _metadata }, _PORT_initializers, _PORT_extraInitializers);
            __esDecorate(null, null, _DATABASE_URL_decorators, { kind: "field", name: "DATABASE_URL", static: false, private: false, access: { has: function (obj) { return "DATABASE_URL" in obj; }, get: function (obj) { return obj.DATABASE_URL; }, set: function (obj, value) { obj.DATABASE_URL = value; } }, metadata: _metadata }, _DATABASE_URL_initializers, _DATABASE_URL_extraInitializers);
            __esDecorate(null, null, _REDIS_HOST_decorators, { kind: "field", name: "REDIS_HOST", static: false, private: false, access: { has: function (obj) { return "REDIS_HOST" in obj; }, get: function (obj) { return obj.REDIS_HOST; }, set: function (obj, value) { obj.REDIS_HOST = value; } }, metadata: _metadata }, _REDIS_HOST_initializers, _REDIS_HOST_extraInitializers);
            __esDecorate(null, null, _REDIS_PORT_decorators, { kind: "field", name: "REDIS_PORT", static: false, private: false, access: { has: function (obj) { return "REDIS_PORT" in obj; }, get: function (obj) { return obj.REDIS_PORT; }, set: function (obj, value) { obj.REDIS_PORT = value; } }, metadata: _metadata }, _REDIS_PORT_initializers, _REDIS_PORT_extraInitializers);
            __esDecorate(null, null, _JWT_SECRET_decorators, { kind: "field", name: "JWT_SECRET", static: false, private: false, access: { has: function (obj) { return "JWT_SECRET" in obj; }, get: function (obj) { return obj.JWT_SECRET; }, set: function (obj, value) { obj.JWT_SECRET = value; } }, metadata: _metadata }, _JWT_SECRET_initializers, _JWT_SECRET_extraInitializers);
            __esDecorate(null, null, _JWT_REFRESH_SECRET_decorators, { kind: "field", name: "JWT_REFRESH_SECRET", static: false, private: false, access: { has: function (obj) { return "JWT_REFRESH_SECRET" in obj; }, get: function (obj) { return obj.JWT_REFRESH_SECRET; }, set: function (obj, value) { obj.JWT_REFRESH_SECRET = value; } }, metadata: _metadata }, _JWT_REFRESH_SECRET_initializers, _JWT_REFRESH_SECRET_extraInitializers);
            __esDecorate(null, null, _JWT_EXPIRES_IN_decorators, { kind: "field", name: "JWT_EXPIRES_IN", static: false, private: false, access: { has: function (obj) { return "JWT_EXPIRES_IN" in obj; }, get: function (obj) { return obj.JWT_EXPIRES_IN; }, set: function (obj, value) { obj.JWT_EXPIRES_IN = value; } }, metadata: _metadata }, _JWT_EXPIRES_IN_initializers, _JWT_EXPIRES_IN_extraInitializers);
            __esDecorate(null, null, _JWT_REFRESH_EXPIRES_IN_decorators, { kind: "field", name: "JWT_REFRESH_EXPIRES_IN", static: false, private: false, access: { has: function (obj) { return "JWT_REFRESH_EXPIRES_IN" in obj; }, get: function (obj) { return obj.JWT_REFRESH_EXPIRES_IN; }, set: function (obj, value) { obj.JWT_REFRESH_EXPIRES_IN = value; } }, metadata: _metadata }, _JWT_REFRESH_EXPIRES_IN_initializers, _JWT_REFRESH_EXPIRES_IN_extraInitializers);
            __esDecorate(null, null, _STORAGE_ACCESS_KEY_decorators, { kind: "field", name: "STORAGE_ACCESS_KEY", static: false, private: false, access: { has: function (obj) { return "STORAGE_ACCESS_KEY" in obj; }, get: function (obj) { return obj.STORAGE_ACCESS_KEY; }, set: function (obj, value) { obj.STORAGE_ACCESS_KEY = value; } }, metadata: _metadata }, _STORAGE_ACCESS_KEY_initializers, _STORAGE_ACCESS_KEY_extraInitializers);
            __esDecorate(null, null, _STORAGE_SECRET_KEY_decorators, { kind: "field", name: "STORAGE_SECRET_KEY", static: false, private: false, access: { has: function (obj) { return "STORAGE_SECRET_KEY" in obj; }, get: function (obj) { return obj.STORAGE_SECRET_KEY; }, set: function (obj, value) { obj.STORAGE_SECRET_KEY = value; } }, metadata: _metadata }, _STORAGE_SECRET_KEY_initializers, _STORAGE_SECRET_KEY_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
/**
 * Validates environment variables on application startup.
 * Throws on missing or invalid values so the problem is immediately visible.
 */
function validate(config) {
    var validatedConfig = (0, class_transformer_1.plainToInstance)(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    var errors = (0, class_validator_1.validateSync)(validatedConfig, {
        skipMissingProperties: false,
    });
    if (errors.length > 0) {
        throw new Error("Environment validation failed:\n".concat(errors
            .map(function (e) { var _a; return Object.values((_a = e.constraints) !== null && _a !== void 0 ? _a : {}).join(', '); })
            .join('\n')));
    }
    return validatedConfig;
}
