"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_REFRESH_SECRET = exports.JWT_SECRET = exports.APP_SECRET = exports.DB_PORT = exports.DB_PASSWORD = exports.DB_USERNAME = exports.DB_NAME = exports.DB_HOST = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Check condition to determine which environment to use
const isProduction = process.env.NODE_ENV === "production";
// Specify the path to the .env file
const envFilePath = isProduction ? ".env.production" : ".env.development";
console.log(`running in ${process.env.NODE_ENV} mode`);
// Load the environment variables from the specified file
const result = dotenv_1.default.config({ path: envFilePath });
if (result.error) {
    console.error(`Failed to load environment variables from ${envFilePath}`);
    process.exit(1);
}
_a = process.env, exports.PORT = _a.PORT, exports.DB_HOST = _a.DB_HOST, exports.DB_NAME = _a.DB_NAME, exports.DB_USERNAME = _a.DB_USERNAME, exports.DB_PASSWORD = _a.DB_PASSWORD, exports.DB_PORT = _a.DB_PORT, exports.APP_SECRET = _a.APP_SECRET, exports.JWT_SECRET = _a.JWT_SECRET, exports.JWT_REFRESH_SECRET = _a.JWT_REFRESH_SECRET;
const ENV = {
    PORT: Number(exports.PORT),
    DB_HOST: exports.DB_HOST,
    DB_NAME: exports.DB_NAME,
    DB_USERNAME: exports.DB_USERNAME,
    DB_PASSWORD: exports.DB_PASSWORD,
    DB_PORT: Number(exports.DB_PORT),
    APP_SECRET: exports.APP_SECRET,
    JWT_SECRET: exports.JWT_SECRET,
    JWT_REFRESH_SECRET: exports.JWT_REFRESH_SECRET,
    IS_PROD: isProduction,
};
exports.default = ENV;
