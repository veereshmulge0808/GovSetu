"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
var common_1 = require("@nestjs/common");
/**
 * Parameter decorator to extract the authenticated user from the request.
 *
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: JwtPayload) { ... }
 */
exports.CurrentUser = (0, common_1.createParamDecorator)(function (data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    var user = request.user;
    // If a specific field is requested, return just that field
    return data ? user === null || user === void 0 ? void 0 : user[data] : user;
});
