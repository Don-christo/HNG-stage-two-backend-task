"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordHarsher = exports.passwordUtils = void 0;
const config_1 = require("../config");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.passwordUtils = {
    length: config_1.ENV.IS_PROD ? 8 : 4,
    regex: config_1.ENV.IS_PROD
        ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?.&])[A-Za-z\d@$!%*?.&]{8,}$/
        : /^(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?.&]{4,}$/,
    error: config_1.ENV.IS_PROD
        ? "Password: Min 8 characters, with an uppercase, a lowercase, a number, and a special character."
        : "Password: Min 4 characters, with a lowercase and a number.",
};
class PasswordHarsher {
    static async compare(password, hash) {
        return await bcrypt_1.default.compare(password, hash);
    }
    static async hash(password) {
        const salt = await bcrypt_1.default.genSalt(10);
        return await bcrypt_1.default.hash(password, salt);
    }
}
exports.PasswordHarsher = PasswordHarsher;
