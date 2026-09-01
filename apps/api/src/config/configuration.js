"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Application configuration factory.
 * Centralises all environment variable reading so the rest of the
 * application uses the typed config object rather than raw process.env.
 */
exports.default = (function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
    return ({
        app: {
            name: (_a = process.env.APP_NAME) !== null && _a !== void 0 ? _a : 'GovSetu API',
            version: (_b = process.env.APP_VERSION) !== null && _b !== void 0 ? _b : '1.0.0',
            port: parseInt((_c = process.env.PORT) !== null && _c !== void 0 ? _c : '3000', 10),
            env: (_d = process.env.NODE_ENV) !== null && _d !== void 0 ? _d : 'development',
        },
        database: {
            url: process.env.DATABASE_URL,
        },
        redis: {
            host: (_e = process.env.REDIS_HOST) !== null && _e !== void 0 ? _e : 'localhost',
            port: parseInt((_f = process.env.REDIS_PORT) !== null && _f !== void 0 ? _f : '6379', 10),
            password: (_g = process.env.REDIS_PASSWORD) !== null && _g !== void 0 ? _g : undefined,
        },
        jwt: {
            secret: process.env.JWT_SECRET,
            expiresIn: (_h = process.env.JWT_EXPIRES_IN) !== null && _h !== void 0 ? _h : '15m',
            refreshSecret: process.env.JWT_REFRESH_SECRET,
            refreshExpiresIn: (_j = process.env.JWT_REFRESH_EXPIRES_IN) !== null && _j !== void 0 ? _j : '7d',
        },
        storage: {
            endpoint: (_k = process.env.STORAGE_ENDPOINT) !== null && _k !== void 0 ? _k : 'http://localhost:9000',
            port: parseInt((_l = process.env.STORAGE_PORT) !== null && _l !== void 0 ? _l : '9000', 10),
            useSSL: process.env.STORAGE_USE_SSL === 'true',
            accessKey: (_m = process.env.STORAGE_ACCESS_KEY) !== null && _m !== void 0 ? _m : 'minioadmin',
            secretKey: (_o = process.env.STORAGE_SECRET_KEY) !== null && _o !== void 0 ? _o : 'minioadmin',
            bucketName: (_p = process.env.STORAGE_BUCKET_NAME) !== null && _p !== void 0 ? _p : 'govsetu-documents',
            region: (_q = process.env.STORAGE_REGION) !== null && _q !== void 0 ? _q : 'us-east-1',
        },
        aiService: {
            url: (_r = process.env.AI_SERVICE_URL) !== null && _r !== void 0 ? _r : 'http://localhost:8000',
            apiKey: (_s = process.env.AI_SERVICE_API_KEY) !== null && _s !== void 0 ? _s : '',
        },
        email: {
            host: (_t = process.env.SMTP_HOST) !== null && _t !== void 0 ? _t : 'localhost',
            port: parseInt((_u = process.env.SMTP_PORT) !== null && _u !== void 0 ? _u : '1025', 10),
            secure: process.env.SMTP_SECURE === 'true',
            user: (_v = process.env.SMTP_USER) !== null && _v !== void 0 ? _v : '',
            pass: (_w = process.env.SMTP_PASS) !== null && _w !== void 0 ? _w : '',
            from: (_x = process.env.SMTP_FROM) !== null && _x !== void 0 ? _x : 'GovSetu <noreply@govsetu.gov.in>',
        },
        throttle: {
            ttl: parseInt((_y = process.env.THROTTLE_TTL) !== null && _y !== void 0 ? _y : '60000', 10),
            limit: parseInt((_z = process.env.THROTTLE_LIMIT) !== null && _z !== void 0 ? _z : '100', 10),
        },
        swagger: {
            enabled: process.env.SWAGGER_ENABLED !== 'false',
            path: (_0 = process.env.SWAGGER_PATH) !== null && _0 !== void 0 ? _0 : 'api/docs',
        },
        cors: {
            origins: ((_1 = process.env.CORS_ORIGINS) !== null && _1 !== void 0 ? _1 : 'http://localhost:3001').split(','),
        },
        logging: {
            level: (_2 = process.env.LOG_LEVEL) !== null && _2 !== void 0 ? _2 : 'debug',
        },
    });
});
