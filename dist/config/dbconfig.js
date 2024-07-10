"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sequelize_1 = require("sequelize");
const env_1 = __importDefault(require("./env"));
exports.db = new sequelize_1.Sequelize(env_1.default.DB_NAME, env_1.default.DB_USERNAME, env_1.default.DB_PASSWORD, {
    host: env_1.default.DB_HOST,
    port: env_1.default.DB_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
        encrypt: env_1.default.IS_PROD,
    },
});
