"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = exports.generateToken = void 0;
const http_status_codes_1 = require("http-status-codes");
const uuid_1 = require("uuid");
const helpers_1 = require("../../utilities/helpers");
const users_1 = __importDefault(require("../../models/users"));
const sequelize_1 = require("sequelize");
const lodash_1 = __importStar(require("lodash"));
const organizations_1 = __importDefault(require("../../models/organizations"));
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = require("../../config");
const validators_1 = require("../../utilities/validators");
const constants_1 = require("../../constants");
const userOrganization_1 = __importDefault(require("../../models/userOrganization"));
const generateToken = (user) => {
    const payload = { userId: user.id, email: user.email };
    return jwt.sign(payload, config_1.ENV.APP_SECRET, {
        expiresIn: constants_1.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
};
exports.generateToken = generateToken;
const registerUser = async (req, res) => {
    try {
        const userValidated = validators_1.registerSchema.strict().safeParse(req.body);
        if (!userValidated.success) {
            return res.status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY).json({
                status: "error",
                message: "Validation error",
                error: userValidated.error.issues,
            });
        }
        const { firstName, lastName, email, password, phone } = userValidated.data;
        const newEmail = email.trim().toLowerCase();
        const existingUser = await users_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [{ email: newEmail }, { phone }],
            },
        });
        if (!existingUser) {
            const hashedPassword = await helpers_1.PasswordHarsher.hash(password);
            const id = (0, uuid_1.v4)();
            const newUser = await users_1.default.create({
                id,
                firstName: (0, lodash_1.toLower)(firstName),
                lastName: (0, lodash_1.toLower)(lastName),
                email: newEmail,
                password: hashedPassword,
                phone,
            });
            const orgId = (0, uuid_1.v4)();
            const orgName = `${firstName}'s Organisation`;
            const newOrganization = await organizations_1.default.create({
                orgId: orgId,
                name: orgName,
                description: "",
            });
            await userOrganization_1.default.create({
                userId: newUser.id,
                organizationId: newOrganization.orgId,
            });
            const token = (0, exports.generateToken)(newUser);
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                status: "Success",
                message: "Registration successful",
                data: {
                    accessToken: token,
                    user: lodash_1.default.pick(newUser, [
                        "id",
                        "firstName",
                        "lastName",
                        "email",
                        "phone",
                    ]),
                },
            });
        }
        return res.status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY).json({
            status: "error",
            message: "User or phone already exists",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: "Bad request",
            message: "Registration unsuccessful",
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
        });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const validationResult = validators_1.loginSchema.strict().safeParse(req.body);
        if (!validationResult.success) {
            return res.status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY).json({
                message: validationResult.error.issues,
            });
        }
        const { email, password } = validationResult.data;
        const confirmUser = await users_1.default.findOne({
            where: { email },
        });
        if (confirmUser) {
            const confirmPassword = await helpers_1.PasswordHarsher.compare(password, confirmUser.password);
            if (confirmPassword) {
                const accessToken = (0, exports.generateToken)(confirmUser);
                res.cookie(constants_1.ACCESS_TOKEN, accessToken, {
                    httpOnly: true,
                    sameSite: "strict",
                    secure: config_1.ENV.IS_PROD,
                });
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: "success",
                    message: "Login successful",
                    data: {
                        accessToken,
                        user: lodash_1.default.pick(confirmUser.dataValues, [
                            "id",
                            "firstName",
                            "lastName",
                            "email",
                            "phone",
                        ]),
                    },
                });
            }
        }
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            message: "Invalid credentials!",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            status: "Bad request",
            message: "Authentication failed",
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
        });
    }
};
exports.loginUser = loginUser;
