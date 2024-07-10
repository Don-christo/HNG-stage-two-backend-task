"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const http_status_codes_1 = require("http-status-codes");
const constants_1 = require("../constants");
const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (token === undefined || token === null) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({
                status: 'There is an Error',
                message: 'Ensure that you are logged in',
            });
        }
        const pin = token.split(' ')[1];
        if (!pin || pin === '') {
            return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).send({
                status: "Error",
                message: `${constants_1.JWT_INVALID_STATUS_CODE}. This pin can't be used`,
            });
        }
        const decoded = jsonwebtoken_1.default.verify(pin, env_1.default.APP_SECRET);
        req.user = decoded;
        return next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({
                status: "Error",
                message: `${constants_1.JWT_EXPIRATION_STATUS_CODE}. Please, login again`,
            });
        }
        console.log("ERROR:", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: "Error",
            message: "An unexpected error occurred.",
        });
    }
};
exports.auth = auth;
