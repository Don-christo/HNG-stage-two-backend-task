"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrgSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const helpers_1 = require("./helpers");
exports.registerSchema = zod_1.default.object({
    firstName: zod_1.default.string().min(2, "firstName is required"),
    lastName: zod_1.default.string().min(2, "lastName is required"),
    email: zod_1.default.string().email("email is not valid").min(2, "email is required"),
    password: zod_1.default
        .string()
        .min(4, helpers_1.passwordUtils.error)
        .regex(helpers_1.passwordUtils.regex, helpers_1.passwordUtils.error),
    phone: zod_1.default.string().min(11, "phone number is required"),
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.string().email("email is not valid").min(2, "email is required"),
    password: zod_1.default
        .string()
        .min(4, helpers_1.passwordUtils.error)
        .regex(helpers_1.passwordUtils.regex, helpers_1.passwordUtils.error),
});
exports.createOrgSchema = zod_1.default.object({
    name: zod_1.default.string().min(2, "name is required"),
    description: zod_1.default.string()
});
