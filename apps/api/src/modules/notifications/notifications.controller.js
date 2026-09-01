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
exports.NotificationsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var NotificationsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Notifications'), (0, swagger_1.ApiBearerAuth)('JWT-Auth'), (0, common_1.Controller)({ path: 'notifications', version: '1' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getMyNotifications_decorators;
    var _markAsRead_decorators;
    var _markAllAsRead_decorators;
    var _findAll_decorators;
    var NotificationsController = _classThis = /** @class */ (function () {
        function NotificationsController_1(notificationsService) {
            this.notificationsService = (__runInitializers(this, _instanceExtraInitializers), notificationsService);
        }
        NotificationsController_1.prototype.getMyNotifications = function (user, unreadOnly, page, limit) {
            return this.notificationsService.getMyNotifications(user.sub, unreadOnly === 'true', page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20);
        };
        NotificationsController_1.prototype.markAsRead = function (id, user) {
            return this.notificationsService.markAsRead(id, user.sub);
        };
        NotificationsController_1.prototype.markAllAsRead = function (user) {
            return this.notificationsService.markAllAsRead(user.sub);
        };
        NotificationsController_1.prototype.findAll = function () {
            return this.notificationsService.findAll();
        };
        return NotificationsController_1;
    }());
    __setFunctionName(_classThis, "NotificationsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getMyNotifications_decorators = [(0, common_1.Get)('me'), (0, swagger_1.ApiOperation)({ summary: 'Get notifications for the current user' }), (0, swagger_1.ApiQuery)({ name: 'unreadOnly', required: false, type: 'boolean' }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: 'number' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: 'number' })];
        _markAsRead_decorators = [(0, common_1.Patch)(':id/read'), (0, swagger_1.ApiOperation)({ summary: 'Mark a notification as read' })];
        _markAllAsRead_decorators = [(0, common_1.Patch)('mark-all-read'), (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' })];
        _findAll_decorators = [(0, common_1.Get)()];
        __esDecorate(_classThis, null, _getMyNotifications_decorators, { kind: "method", name: "getMyNotifications", static: false, private: false, access: { has: function (obj) { return "getMyNotifications" in obj; }, get: function (obj) { return obj.getMyNotifications; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _markAsRead_decorators, { kind: "method", name: "markAsRead", static: false, private: false, access: { has: function (obj) { return "markAsRead" in obj; }, get: function (obj) { return obj.markAsRead; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _markAllAsRead_decorators, { kind: "method", name: "markAllAsRead", static: false, private: false, access: { has: function (obj) { return "markAllAsRead" in obj; }, get: function (obj) { return obj.markAllAsRead; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationsController = _classThis;
}();
exports.NotificationsController = NotificationsController;
